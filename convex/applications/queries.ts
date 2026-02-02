import { query } from "../_generated/server";
import { v } from "convex/values";

// Get a single application by ID with related data
export const getApplication = query({
    args: { applicationId: v.id("applications") },
    handler: async (ctx, args) => {
        const application = await ctx.db.get(args.applicationId);
        if (!application) return null;

        // Get related data
        const listing = await ctx.db.get(application.listingId);
        const unit = await ctx.db.get(application.unitId);
        const property = unit ? await ctx.db.get(unit.propertyId) : null;

        return {
            ...application,
            listing,
            unit,
            property,
        };
    },
});

// List applications for an organization with optional filters
export const listApplications = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        status: v.optional(v.string()),
        listingId: v.optional(v.id("listings")),
    },
    handler: async (ctx, args) => {
        let applications;

        if (args.organizationId) {
            if (args.status) {
                applications = await ctx.db
                    .query("applications")
                    .withIndex("by_status", (q) =>
                        q.eq("organizationId", args.organizationId).eq("status", args.status as any)
                    )
                    .order("desc")
                    .collect();
            } else {
                applications = await ctx.db
                    .query("applications")
                    .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
                    .order("desc")
                    .collect();
            }
        } else {
            // For demo, get all applications
            applications = await ctx.db.query("applications").order("desc").collect();
        }

        // Filter by listing if provided
        if (args.listingId) {
            applications = applications.filter((a) => a.listingId === args.listingId);
        }

        // Fetch related data for each application
        const applicationsWithDetails = await Promise.all(
            applications.map(async (application) => {
                const listing = await ctx.db.get(application.listingId);
                const unit = await ctx.db.get(application.unitId);
                const property = unit ? await ctx.db.get(unit.propertyId) : null;

                return {
                    ...application,
                    listing,
                    unit,
                    property,
                };
            })
        );

        return applicationsWithDetails;
    },
});

// Get application statistics for dashboard
export const getApplicationStats = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        let applications;

        if (args.organizationId) {
            applications = await ctx.db
                .query("applications")
                .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
                .collect();
        } else {
            applications = await ctx.db.query("applications").collect();
        }

        const stats = {
            total: applications.length,
            submitted: applications.filter((a) => a.status === "submitted").length,
            underReview: applications.filter((a) => a.status === "under_review").length,
            screening: applications.filter((a) => a.status === "screening").length,
            approved: applications.filter((a) => a.status === "approved").length,
            conditionallyApproved: applications.filter((a) => a.status === "conditionally_approved").length,
            denied: applications.filter((a) => a.status === "denied").length,
            withdrawn: applications.filter((a) => a.status === "withdrawn").length,
            expired: applications.filter((a) => a.status === "expired").length,
        };

        return stats;
    },
});

// Get applications for a specific listing
export const getApplicationsByListing = query({
    args: { listingId: v.id("listings") },
    handler: async (ctx, args) => {
        const applications = await ctx.db
            .query("applications")
            .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
            .order("desc")
            .collect();

        return applications;
    },
});

// Search applications by applicant email
export const searchByEmail = query({
    args: { 
        organizationId: v.id("organizations"),
        email: v.string() 
    },
    handler: async (ctx, args) => {
        const applications = await ctx.db
            .query("applications")
            .withIndex("by_applicant_email", (q) => q.eq("applicant.email", args.email))
            .collect();

        // Filter by organization
        return applications.filter((a) => a.organizationId === args.organizationId);
    },
});
