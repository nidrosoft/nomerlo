import { action } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Subscription actions (Stripe integration)
export const createCheckoutSession = action({
    args: {
        organizationId: v.id("organizations"),
        planId: v.string(),
    },
    handler: async (ctx, args) => {
        // Coming soon: Stripe checkout session
        return null;
    },
});
