import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Payment mutations
export const createPayment = mutation({
    args: {
        organizationId: v.id("organizations"),
        leaseId: v.id("leases"),
        amount: v.number(),
    },
    handler: async (ctx, args) => {
        // Coming soon
        return null;
    },
});

export const updatePayment = mutation({
    args: {
        paymentId: v.id("payments"),
    },
    handler: async (ctx, args) => {
        // Coming soon
        return null;
    },
});
