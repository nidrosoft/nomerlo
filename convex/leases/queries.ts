import { query } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Lease queries
export const getLease = query({
    args: { leaseId: v.id("leases") },
    handler: async (ctx, args) => {
        // Coming soon
        return null;
    },
});

export const listLeases = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        // Coming soon
        return [];
    },
});
