import { query } from "../_generated/server";
import { v } from "convex/values";

// Get a single listing by ID
export const getListing = query({
    args: { listingId: v.id("listings") },
    handler: async (ctx, args) => {
        const listing = await ctx.db.get(args.listingId);
        if (!listing) return null;

        // Get related data
        const property = await ctx.db.get(listing.propertyId);
        const unit = await ctx.db.get(listing.unitId);

        return {
            ...listing,
            property,
            unit,
        };
    },
});

// Get listing by slug (for public pages)
export const getListingBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const listing = await ctx.db
            .query("listings")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!listing) return null;

        const property = await ctx.db.get(listing.propertyId);
        const unit = await ctx.db.get(listing.unitId);

        return {
            ...listing,
            property,
            unit,
        };
    },
});

// List all active listings (for public marketplace)
export const listActiveListings = query({
    args: {},
    handler: async (ctx) => {
        const listings = await ctx.db
            .query("listings")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();

        // Fetch related property and unit data for each listing
        const listingsWithDetails = await Promise.all(
            listings.map(async (listing) => {
                const property = await ctx.db.get(listing.propertyId);
                const unit = await ctx.db.get(listing.unitId);
                return {
                    ...listing,
                    property,
                    unit,
                };
            })
        );

        return listingsWithDetails;
    },
});

// List listings for an organization (owner dashboard)
export const listListings = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        if (!args.organizationId) {
            // If no org ID, return all listings (for now)
            const listings = await ctx.db.query("listings").collect();
            return Promise.all(
                listings.map(async (listing) => {
                    const property = await ctx.db.get(listing.propertyId);
                    const unit = await ctx.db.get(listing.unitId);
                    return { ...listing, property, unit };
                })
            );
        }

        const orgId = args.organizationId;
        const listings = await ctx.db
            .query("listings")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .collect();

        const listingsWithDetails = await Promise.all(
            listings.map(async (listing) => {
                const property = await ctx.db.get(listing.propertyId);
                const unit = await ctx.db.get(listing.unitId);
                return {
                    ...listing,
                    property,
                    unit,
                };
            })
        );

        return listingsWithDetails;
    },
});

// Get listing analytics
export const getListingAnalytics = query({
    args: { listingId: v.id("listings") },
    handler: async (ctx, args) => {
        const listing = await ctx.db.get(args.listingId);
        if (!listing) return null;

        return {
            viewCount: listing.viewCount,
            inquiryCount: listing.inquiryCount,
            applicationCount: listing.applicationCount,
            publishedAt: listing.publishedAt,
            status: listing.status,
        };
    },
});
