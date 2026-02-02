import { action } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Payment actions (Stripe integration)
export const processPayment = action({
    args: {
        paymentId: v.id("payments"),
        amount: v.number(),
    },
    handler: async (ctx, args) => {
        // Coming soon: Stripe payment processing
        return null;
    },
});
