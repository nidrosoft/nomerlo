import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Helper to generate a URL-friendly slug
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
}

// Create a new listing
export const createListing = mutation({
    args: {
        organizationId: v.id("organizations"),
        propertyId: v.id("properties"),
        unitId: v.id("units"),
        // Listing details
        title: v.string(),
        description: v.string(),
        // Pricing
        rentAmount: v.number(),
        depositAmount: v.number(),
        // Availability
        availableDate: v.number(),
        leaseTerm: v.union(
            v.literal("month_to_month"),
            v.literal("6_months"),
            v.literal("12_months"),
            v.literal("24_months"),
            v.literal("flexible")
        ),
        // Requirements
        requirements: v.object({
            minCreditScore: v.optional(v.number()),
            minIncome: v.optional(v.number()),
            petsAllowed: v.boolean(),
            petTypes: v.optional(v.array(v.string())),
            petDeposit: v.optional(v.number()),
            smokingAllowed: v.boolean(),
            maxOccupants: v.optional(v.number()),
        }),
        // Utilities
        utilities: v.object({
            included: v.array(v.string()),
            tenantPays: v.array(v.string()),
        }),
        // Syndication
        syndicateTo: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Generate slug from title
        const slug = generateSlug(args.title);

        // Create the listing
        const listingId = await ctx.db.insert("listings", {
            organizationId: args.organizationId,
            propertyId: args.propertyId,
            unitId: args.unitId,
            title: args.title,
            description: args.description,
            rentAmount: args.rentAmount,
            depositAmount: args.depositAmount,
            availableDate: args.availableDate,
            leaseTerm: args.leaseTerm,
            requirements: args.requirements,
            utilities: args.utilities,
            slug,
            keywords: args.title.toLowerCase().split(' '),
            status: "draft",
            viewCount: 0,
            inquiryCount: 0,
            applicationCount: 0,
            syndicateTo: args.syndicateTo || [],
            verificationStatus: "pending",
            verifiedAt: undefined,
            publishedAt: undefined,
            expiresAt: undefined,
            createdAt: now,
            updatedAt: now,
        });

        return { listingId, slug };
    },
});

// Update an existing listing
export const updateListing = mutation({
    args: {
        listingId: v.id("listings"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        rentAmount: v.optional(v.number()),
        depositAmount: v.optional(v.number()),
        availableDate: v.optional(v.number()),
        leaseTerm: v.optional(v.union(
            v.literal("month_to_month"),
            v.literal("6_months"),
            v.literal("12_months"),
            v.literal("24_months"),
            v.literal("flexible")
        )),
        requirements: v.optional(v.object({
            minCreditScore: v.optional(v.number()),
            minIncome: v.optional(v.number()),
            petsAllowed: v.boolean(),
            petTypes: v.optional(v.array(v.string())),
            petDeposit: v.optional(v.number()),
            smokingAllowed: v.boolean(),
            maxOccupants: v.optional(v.number()),
        })),
        utilities: v.optional(v.object({
            included: v.array(v.string()),
            tenantPays: v.array(v.string()),
        })),
        status: v.optional(v.union(
            v.literal("draft"),
            v.literal("active"),
            v.literal("paused"),
            v.literal("rented"),
            v.literal("expired")
        )),
    },
    handler: async (ctx, args) => {
        const { listingId, ...updates } = args;

        const listing = await ctx.db.get(listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        // Build update object with only provided fields
        const updateData: Record<string, unknown> = {
            updatedAt: Date.now(),
        };

        if (updates.title !== undefined) {
            updateData.title = updates.title;
            updateData.keywords = updates.title.toLowerCase().split(' ');
        }
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.rentAmount !== undefined) updateData.rentAmount = updates.rentAmount;
        if (updates.depositAmount !== undefined) updateData.depositAmount = updates.depositAmount;
        if (updates.availableDate !== undefined) updateData.availableDate = updates.availableDate;
        if (updates.leaseTerm !== undefined) updateData.leaseTerm = updates.leaseTerm;
        if (updates.requirements !== undefined) updateData.requirements = updates.requirements;
        if (updates.utilities !== undefined) updateData.utilities = updates.utilities;
        if (updates.status !== undefined) {
            updateData.status = updates.status;
            // Track publish time
            if (updates.status === "active" && !listing.publishedAt) {
                updateData.publishedAt = Date.now();
            }
        }

        await ctx.db.patch(listingId, updateData);

        return { success: true };
    },
});

// Publish a listing (change status from draft to active)
export const publishListing = mutation({
    args: { listingId: v.id("listings") },
    handler: async (ctx, args) => {
        const listing = await ctx.db.get(args.listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        const now = Date.now();

        await ctx.db.patch(args.listingId, {
            status: "active",
            publishedAt: now,
            updatedAt: now,
        });

        return { success: true };
    },
});

// Pause a listing
export const pauseListing = mutation({
    args: { listingId: v.id("listings") },
    handler: async (ctx, args) => {
        const listing = await ctx.db.get(args.listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        await ctx.db.patch(args.listingId, {
            status: "paused",
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Mark listing as rented
export const markAsRented = mutation({
    args: { listingId: v.id("listings") },
    handler: async (ctx, args) => {
        const listing = await ctx.db.get(args.listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        await ctx.db.patch(args.listingId, {
            status: "rented",
            updatedAt: Date.now(),
        });

        // Also update the unit status
        await ctx.db.patch(listing.unitId, {
            status: "occupied",
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Increment view count for analytics
export const incrementViewCount = mutation({
    args: { listingId: v.id("listings") },
    handler: async (ctx, args) => {
        const listing = await ctx.db.get(args.listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        await ctx.db.patch(args.listingId, {
            viewCount: (listing.viewCount || 0) + 1,
        });

        return { success: true };
    },
});

// Delete a listing
export const deleteListing = mutation({
    args: { listingId: v.id("listings") },
    handler: async (ctx, args) => {
        const listing = await ctx.db.get(args.listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        // Delete associated photos
        const photos = await ctx.db
            .query("listingPhotos")
            .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
            .collect();

        for (const photo of photos) {
            await ctx.db.delete(photo._id);
        }

        // Delete the listing
        await ctx.db.delete(args.listingId);

        return { success: true };
    },
});
