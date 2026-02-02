import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Unit mutations
export const createUnit = mutation({
    args: {
        organizationId: v.id("organizations"),
        propertyId: v.id("properties"),
        unitNumber: v.string(),
    },
    handler: async (ctx, args) => {
        // Coming soon
        return null;
    },
});

export const updateUnit = mutation({
    args: {
        unitId: v.id("units"),
        unitNumber: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Coming soon
        return null;
    },
});
