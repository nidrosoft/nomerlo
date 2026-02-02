import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Helper to generate URL-friendly slug
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Create a new organization (during onboarding)
export const createOrganization = mutation({
    args: {
        name: v.string(),
        slug: v.optional(v.string()),
        type: v.union(
            v.literal("individual"),
            v.literal("business"),
            v.literal("property_manager")
        ),
        email: v.string(),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),
        address: v.optional(v.object({
            street: v.string(),
            unit: v.optional(v.string()),
            city: v.string(),
            state: v.string(),
            zip: v.string(),
            country: v.string(),
        })),
        userId: v.id("users"), // The user creating the organization
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Generate slug from name if not provided
        let slug = args.slug || generateSlug(args.name);

        // Make sure slug is unique
        const existingOrg = await ctx.db
            .query("organizations")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .first();

        if (existingOrg) {
            // Append timestamp to make unique
            slug = `${slug}-${Date.now().toString(36)}`;
        }

        // Create the organization
        const organizationId = await ctx.db.insert("organizations", {
            name: args.name,
            slug,
            type: args.type,
            email: args.email,
            phone: args.phone,
            website: args.website,
            address: args.address,
            logoUrl: undefined,
            brandColor: undefined,
            settings: {
                timezone: "America/New_York",
                currency: "USD",
                locale: "en-US",
                lateFeeDays: 5,
                lateFeeAmount: 50,
                lateFeeType: "fixed",
            },
            subscriptionId: undefined,
            stripeCustomerId: undefined,
            status: "onboarding",
            onboardingStep: "properties",
            verifiedAt: undefined,
            createdAt: now,
            updatedAt: now,
        });

        // Add the user as an owner of the organization
        await ctx.db.insert("organizationMembers", {
            organizationId,
            userId: args.userId,
            role: "owner",
            propertyIds: undefined,
            status: "active",
            invitedAt: undefined,
            joinedAt: now,
            createdAt: now,
        });

        return { organizationId, slug };
    },
});

// Update organization details
export const updateOrganization = mutation({
    args: {
        organizationId: v.id("organizations"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),
        address: v.optional(v.object({
            street: v.string(),
            unit: v.optional(v.string()),
            city: v.string(),
            state: v.string(),
            zip: v.string(),
            country: v.string(),
        })),
        logoUrl: v.optional(v.string()),
        brandColor: v.optional(v.string()),
        status: v.optional(v.union(
            v.literal("onboarding"),
            v.literal("active"),
            v.literal("suspended"),
            v.literal("cancelled")
        )),
        onboardingStep: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, ...updates } = args;

        const org = await ctx.db.get(organizationId);
        if (!org) {
            throw new Error("Organization not found");
        }

        const updateData: Record<string, unknown> = {
            updatedAt: Date.now(),
        };

        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.email !== undefined) updateData.email = updates.email;
        if (updates.phone !== undefined) updateData.phone = updates.phone;
        if (updates.website !== undefined) updateData.website = updates.website;
        if (updates.address !== undefined) updateData.address = updates.address;
        if (updates.logoUrl !== undefined) updateData.logoUrl = updates.logoUrl;
        if (updates.brandColor !== undefined) updateData.brandColor = updates.brandColor;
        if (updates.status !== undefined) updateData.status = updates.status;
        if (updates.onboardingStep !== undefined) updateData.onboardingStep = updates.onboardingStep;

        await ctx.db.patch(organizationId, updateData);

        return { success: true };
    },
});

// Complete onboarding
export const completeOnboarding = mutation({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const org = await ctx.db.get(args.organizationId);
        if (!org) {
            throw new Error("Organization not found");
        }

        await ctx.db.patch(args.organizationId, {
            status: "active",
            onboardingStep: undefined,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Add a member to organization
export const addMember = mutation({
    args: {
        organizationId: v.id("organizations"),
        userId: v.id("users"),
        role: v.union(
            v.literal("owner"),
            v.literal("property_manager"),
            v.literal("staff")
        ),
        propertyIds: v.optional(v.array(v.id("properties"))),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Check if member already exists
        const existingMember = await ctx.db
            .query("organizationMembers")
            .withIndex("by_user_org", (q) =>
                q.eq("userId", args.userId).eq("organizationId", args.organizationId)
            )
            .first();

        if (existingMember) {
            // Update existing membership
            await ctx.db.patch(existingMember._id, {
                role: args.role,
                propertyIds: args.propertyIds,
                status: "active",
            });
            return { memberId: existingMember._id };
        }

        // Create new membership
        const memberId = await ctx.db.insert("organizationMembers", {
            organizationId: args.organizationId,
            userId: args.userId,
            role: args.role,
            propertyIds: args.propertyIds,
            status: "active",
            invitedAt: undefined,
            joinedAt: now,
            createdAt: now,
        });

        return { memberId };
    },
});

// Remove a member from organization
export const removeMember = mutation({
    args: {
        organizationId: v.id("organizations"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const member = await ctx.db
            .query("organizationMembers")
            .withIndex("by_user_org", (q) =>
                q.eq("userId", args.userId).eq("organizationId", args.organizationId)
            )
            .first();

        if (!member) {
            throw new Error("Member not found");
        }

        // Don't allow removing the last owner
        if (member.role === "owner") {
            const owners = await ctx.db
                .query("organizationMembers")
                .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
                .collect();

            const ownerCount = owners.filter((m) => m.role === "owner" && m.status === "active").length;

            if (ownerCount <= 1) {
                throw new Error("Cannot remove the last owner");
            }
        }

        await ctx.db.patch(member._id, {
            status: "inactive",
        });

        return { success: true };
    },
});

// Update organization settings
export const updateSettings = mutation({
    args: {
        organizationId: v.id("organizations"),
        settings: v.object({
            timezone: v.string(),
            currency: v.string(),
            locale: v.string(),
            lateFeeDays: v.number(),
            lateFeeAmount: v.number(),
            lateFeeType: v.union(v.literal("fixed"), v.literal("percentage")),
        }),
    },
    handler: async (ctx, args) => {
        const org = await ctx.db.get(args.organizationId);
        if (!org) {
            throw new Error("Organization not found");
        }

        await ctx.db.patch(args.organizationId, {
            settings: args.settings,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});
