import { query } from "../_generated/server";
import { v } from "convex/values";

// Plan definitions
const planFeatures = {
    starter: {
        name: "Starter",
        price: 0,
        yearlyPrice: 0,
        unitsAllowed: 3,
        aiInteractions: 0,
        features: [
            "Up to 3 units",
            "Rent collection (ACH only)",
            "Basic maintenance tracking",
            "Limited listing syndication",
            "Email support",
        ],
        notIncluded: [
            "AI assistant",
            "Same-day payments",
            "Tenant screening",
            "E-signatures",
            "Full reports",
        ],
    },
    growth: {
        name: "Growth",
        price: 29,
        yearlyPrice: 290,
        unitsAllowed: 25,
        aiInteractions: 100,
        features: [
            "Up to 25 units",
            "ACH + Card payments",
            "Tenant screening",
            "E-signatures",
            "Full reports & analytics",
            "AI assistant (100 interactions/month)",
            "Phone support",
            "Listing syndication to all major sites",
        ],
        notIncluded: [],
    },
    professional: {
        name: "Professional",
        price: 79,
        yearlyPrice: 790,
        unitsAllowed: 100,
        aiInteractions: -1, // Unlimited
        features: [
            "Up to 100 units",
            "All payment methods",
            "Unlimited AI assistant",
            "Custom branding",
            "API access",
            "Priority support",
            "Dedicated account manager",
            "Advanced analytics",
        ],
        notIncluded: [],
    },
};

// Get current subscription
export const getSubscription = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        let orgId = args.organizationId;

        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) return null;
            orgId = orgs[0]._id;
        }

        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .first();

        if (!subscription) {
            // Return default starter plan info
            return {
                plan: "starter" as const,
                planDetails: planFeatures.starter,
                status: "active" as const,
                billingPeriod: "monthly" as const,
                pricePerMonth: 0,
                unitLimit: 3,
                unitsUsed: 0,
                aiInteractionsAllowed: 0,
                aiInteractionsUsed: 0,
                paymentMethodType: null,
                paymentMethodLast4: null,
                nextBillingDate: null,
                currentPeriodEnd: null,
                isDemo: true,
            };
        }

        // Map plan to features (handle "free" as "starter")
        let planKey = subscription.plan as string;
        if (planKey === "free" || planKey === "enterprise") {
            planKey = "starter";
        }
        const plan = planKey as keyof typeof planFeatures;

        return {
            ...subscription,
            planDetails: planFeatures[plan] || planFeatures.starter,
            isDemo: false,
        };
    },
});

// Get payment history
export const getPaymentHistory = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 20;
        let orgId = args.organizationId;

        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) return [];
            orgId = orgs[0]._id;
        }

        const payments = await ctx.db
            .query("subscriptionPayments")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .order("desc")
            .take(limit);

        return payments;
    },
});

// Get plan options for comparison
export const getPlanOptions = query({
    args: {},
    handler: async () => {
        return planFeatures;
    },
});

// Get usage statistics
export const getUsageStats = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        let orgId = args.organizationId;

        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) {
                return {
                    unitsUsed: 0,
                    unitsAllowed: 3,
                    unitsPercentage: 0,
                    aiInteractionsUsed: 0,
                    aiInteractionsAllowed: 0,
                    aiInteractionsPercentage: 0,
                };
            }
            orgId = orgs[0]._id;
        }

        // Count units
        const units = await ctx.db
            .query("units")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .collect();
        const unitsUsed = units.length;

        // Get subscription for limits
        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .first();

        const unitsAllowed = subscription?.unitLimit || 3;
        const aiInteractionsAllowed = subscription?.aiInteractionsAllowed || 0;
        const aiInteractionsUsed = subscription?.aiInteractionsUsed || 0;

        return {
            unitsUsed,
            unitsAllowed,
            unitsPercentage: unitsAllowed > 0 ? Math.round((unitsUsed / unitsAllowed) * 100) : 0,
            aiInteractionsUsed,
            aiInteractionsAllowed,
            aiInteractionsPercentage: aiInteractionsAllowed > 0 
                ? Math.round((aiInteractionsUsed / aiInteractionsAllowed) * 100) 
                : 0,
            aiInteractionsRemaining: aiInteractionsAllowed > 0 
                ? aiInteractionsAllowed - aiInteractionsUsed 
                : 0,
        };
    },
});
