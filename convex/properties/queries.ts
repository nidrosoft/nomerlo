import { query } from "../_generated/server";
import { v } from "convex/values";

// Get a single property by ID
export const getProperty = query({
    args: { propertyId: v.id("properties") },
    handler: async (ctx, args) => {
        const property = await ctx.db.get(args.propertyId);
        if (!property) return null;

        // Get units for this property
        const units = await ctx.db
            .query("units")
            .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
            .collect();

        return {
            ...property,
            units,
        };
    },
});

// List properties for an organization
export const listProperties = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        if (!args.organizationId) {
            // If no org ID, return all properties (for demo purposes)
            const properties = await ctx.db.query("properties").collect();
            return Promise.all(
                properties.map(async (property) => {
                    const units = await ctx.db
                        .query("units")
                        .withIndex("by_property", (q) => q.eq("propertyId", property._id))
                        .collect();
                    return { ...property, units };
                })
            );
        }

        const orgId = args.organizationId;
        const properties = await ctx.db
            .query("properties")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .collect();

        // Get units for each property
        const propertiesWithUnits = await Promise.all(
            properties.map(async (property) => {
                const units = await ctx.db
                    .query("units")
                    .withIndex("by_property", (q) => q.eq("propertyId", property._id))
                    .collect();
                return {
                    ...property,
                    units,
                };
            })
        );

        return propertiesWithUnits;
    },
});

// List properties with active status
export const listActiveProperties = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const properties = await ctx.db
            .query("properties")
            .withIndex("by_org_status", (q) =>
                q.eq("organizationId", args.organizationId).eq("status", "active")
            )
            .collect();

        const propertiesWithUnits = await Promise.all(
            properties.map(async (property) => {
                const units = await ctx.db
                    .query("units")
                    .withIndex("by_property", (q) => q.eq("propertyId", property._id))
                    .collect();

                // Get vacancy counts
                const vacantUnits = units.filter((u) => u.status === "vacant");
                const occupiedUnits = units.filter((u) => u.status === "occupied");

                return {
                    ...property,
                    units,
                    vacantCount: vacantUnits.length,
                    occupiedCount: occupiedUnits.length,
                };
            })
        );

        return propertiesWithUnits;
    },
});

// Get property stats for dashboard
export const getPropertyStats = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        let properties;
        
        if (args.organizationId) {
            const orgId = args.organizationId;
            properties = await ctx.db
                .query("properties")
                .withIndex("by_org", (q) => q.eq("organizationId", orgId))
                .collect();
        } else {
            properties = await ctx.db.query("properties").collect();
        }

        let totalUnits = 0;
        let vacantUnits = 0;
        let occupiedUnits = 0;

        for (const property of properties) {
            const units = await ctx.db
                .query("units")
                .withIndex("by_property", (q) => q.eq("propertyId", property._id))
                .collect();

            totalUnits += units.length;
            vacantUnits += units.filter((u) => u.status === "vacant").length;
            occupiedUnits += units.filter((u) => u.status === "occupied").length;
        }

        return {
            totalProperties: properties.length,
            totalUnits,
            vacantUnits,
            occupiedUnits,
            occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
        };
    },
});
