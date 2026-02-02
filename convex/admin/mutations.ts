import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Admin mutations
export const suspendOrganization = mutation({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        return null;
    },
});

export const updatePlatformSettings = mutation({
    args: {},
    handler: async (ctx, args) => {
        return null;
    },
});
