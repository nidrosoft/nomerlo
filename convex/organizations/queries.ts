import { query } from "../_generated/server";
import { v } from "convex/values";

// Get an organization by ID
export const getOrganization = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.organizationId);
    },
});

// Get organization by slug
export const getOrganizationBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("organizations")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
    },
});

// Get the current user's organization
export const getMyOrganization = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        // Find user by Clerk ID
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) {
            return null;
        }

        // Find the user's organization membership
        const membership = await ctx.db
            .query("organizationMembers")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .first();

        if (!membership) {
            return null;
        }

        // Get the organization
        const organization = await ctx.db.get(membership.organizationId);

        return {
            organization,
            membership,
            user,
        };
    },
});

// List all organizations (admin only)
export const listOrganizations = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("organizations").collect();
    },
});
