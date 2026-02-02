import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Lease mutations
export const createLease = mutation({
    args: {
        organizationId: v.id("organizations"),
        unitId: v.id("units"),
        tenantId: v.id("tenants"),
    },
    handler: async (ctx, args) => {
        // Coming soon
        return null;
    },
});

export const updateLease = mutation({
    args: {
        leaseId: v.id("leases"),
    },
    handler: async (ctx, args) => {
        // Coming soon
        return null;
    },
});
