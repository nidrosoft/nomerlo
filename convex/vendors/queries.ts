import { query } from "../_generated/server";
import { v } from "convex/values";

// List vendors
export const listVendors = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        category: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let orgId = args.organizationId;

        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) return [];
            orgId = orgs[0]._id;
        }

        let vendors = await ctx.db
            .query("vendors")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .collect();

        // Filter by category
        if (args.category) {
            vendors = vendors.filter((v) => v.categories.includes(args.category!));
        }

        // Filter by status
        if (args.status) {
            vendors = vendors.filter((v) => v.status === args.status);
        }

        // Sort by name
        vendors.sort((a, b) => a.name.localeCompare(b.name));

        return vendors;
    },
});

// Get single vendor
export const getVendor = query({
    args: { vendorId: v.id("vendors") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.vendorId);
    },
});

// Get vendor options for dropdowns
export const getVendorOptions = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        let orgId = args.organizationId;

        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) return [];
            orgId = orgs[0]._id;
        }

        const vendors = await ctx.db
            .query("vendors")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .collect();

        return vendors
            .filter((v) => v.status === "active")
            .map((v) => ({
                id: v._id,
                name: v.name,
                categories: v.categories,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    },
});
