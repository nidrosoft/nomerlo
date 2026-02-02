import { query } from "../_generated/server";
import { v } from "convex/values";

// Get a single unit by ID
export const getUnit = query({
    args: { unitId: v.id("units") },
    handler: async (ctx, args) => {
        const unit = await ctx.db.get(args.unitId);
        if (!unit) return null;

        const property = await ctx.db.get(unit.propertyId);

        return {
            ...unit,
            property,
        };
    },
});

// List units for a property
export const listUnits = query({
    args: { propertyId: v.id("properties") },
    handler: async (ctx, args) => {
        const units = await ctx.db
            .query("units")
            .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
            .collect();

        return units;
    },
});

// List vacant units for a property (for listing creation)
export const listVacantUnits = query({
    args: { propertyId: v.id("properties") },
    handler: async (ctx, args) => {
        const units = await ctx.db
            .query("units")
            .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
            .collect();

        return units.filter((unit) => unit.status === "vacant");
    },
});

// List all units for an organization
export const listUnitsByOrg = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        if (!args.organizationId) {
            const units = await ctx.db.query("units").collect();
            return Promise.all(
                units.map(async (unit) => {
                    const property = await ctx.db.get(unit.propertyId);
                    return { ...unit, property };
                })
            );
        }

        const units = await ctx.db
            .query("units")
            .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
            .collect();

        const unitsWithProperty = await Promise.all(
            units.map(async (unit) => {
                const property = await ctx.db.get(unit.propertyId);
                return {
                    ...unit,
                    property,
                };
            })
        );

        return unitsWithProperty;
    },
});
