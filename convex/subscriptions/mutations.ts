import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create or update subscription
export const createSubscription = mutation({
    args: {
        organizationId: v.optional(v.id("organizations")),
        plan: v.union(v.literal("starter"), v.literal("growth"), v.literal("professional")),
        billingPeriod: v.union(v.literal("monthly"), v.literal("yearly")),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        let orgId = args.organizationId;
        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) throw new Error("No organization found");
            orgId = orgs[0]._id;
        }

        // Plan configurations
        const planConfig = {
            starter: { price: 0, yearlyPrice: 0, units: 3, ai: 0 },
            growth: { price: 29, yearlyPrice: 290, units: 25, ai: 100 },
            professional: { price: 79, yearlyPrice: 790, units: 100, ai: -1 },
        };

        const config = planConfig[args.plan];
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        const periodLength = args.billingPeriod === "yearly" ? oneYear : oneMonth;

        // Check if subscription exists
        const existing = await ctx.db
            .query("subscriptions")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .first();

        if (existing) {
            // Update existing
            await ctx.db.patch(existing._id, {
                plan: args.plan,
                billingPeriod: args.billingPeriod,
                pricePerMonth: config.price,
                pricePerYear: config.yearlyPrice,
                unitLimit: config.units,
                aiInteractionsAllowed: config.ai,
                currentPeriodEnd: now + periodLength,
                nextBillingDate: args.plan === "starter" ? undefined : now + periodLength,
                updatedAt: now,
            });
            return { success: true, subscriptionId: existing._id };
        }

        // Create new subscription
        const subscriptionId = await ctx.db.insert("subscriptions", {
            organizationId: orgId,
            plan: args.plan,
            billingPeriod: args.billingPeriod,
            status: args.plan === "starter" ? "active" : "trialing",
            pricePerMonth: config.price,
            pricePerYear: config.yearlyPrice,
            startDate: now,
            currentPeriodStart: now,
            currentPeriodEnd: now + periodLength,
            nextBillingDate: args.plan === "starter" ? undefined : now + periodLength,
            trialEndsAt: args.plan !== "starter" ? now + 14 * 24 * 60 * 60 * 1000 : undefined,
            unitLimit: config.units,
            userLimit: 10,
            aiInteractionsAllowed: config.ai,
            aiInteractionsUsed: 0,
            createdAt: now,
            updatedAt: now,
        });

        return { success: true, subscriptionId };
    },
});

// Update payment method
export const updatePaymentMethod = mutation({
    args: {
        organizationId: v.optional(v.id("organizations")),
        paymentMethodType: v.string(),
        paymentMethodLast4: v.string(),
    },
    handler: async (ctx, args) => {
        let orgId = args.organizationId;
        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) throw new Error("No organization found");
            orgId = orgs[0]._id;
        }

        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .first();

        if (!subscription) throw new Error("No subscription found");

        await ctx.db.patch(subscription._id, {
            paymentMethodType: args.paymentMethodType,
            paymentMethodLast4: args.paymentMethodLast4,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Change plan
export const changePlan = mutation({
    args: {
        organizationId: v.optional(v.id("organizations")),
        newPlan: v.union(v.literal("starter"), v.literal("growth"), v.literal("professional")),
        billingPeriod: v.optional(v.union(v.literal("monthly"), v.literal("yearly"))),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        let orgId = args.organizationId;
        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) throw new Error("No organization found");
            orgId = orgs[0]._id;
        }

        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .first();

        if (!subscription) throw new Error("No subscription found");

        const planConfig = {
            starter: { price: 0, yearlyPrice: 0, units: 3, ai: 0 },
            growth: { price: 29, yearlyPrice: 290, units: 25, ai: 100 },
            professional: { price: 79, yearlyPrice: 790, units: 100, ai: -1 },
        };

        const config = planConfig[args.newPlan];
        const billingPeriod = args.billingPeriod || subscription.billingPeriod;

        await ctx.db.patch(subscription._id, {
            plan: args.newPlan,
            billingPeriod,
            pricePerMonth: config.price,
            pricePerYear: config.yearlyPrice,
            unitLimit: config.units,
            aiInteractionsAllowed: config.ai,
            status: args.newPlan === "starter" ? "active" : subscription.status,
            updatedAt: now,
        });

        return { success: true };
    },
});

// Cancel subscription
export const cancelSubscription = mutation({
    args: {
        organizationId: v.optional(v.id("organizations")),
        reason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        let orgId = args.organizationId;
        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) throw new Error("No organization found");
            orgId = orgs[0]._id;
        }

        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .first();

        if (!subscription) throw new Error("No subscription found");

        await ctx.db.patch(subscription._id, {
            status: "cancelled",
            cancelledAt: now,
            cancellationReason: args.reason,
            updatedAt: now,
        });

        return { success: true };
    },
});

// Record a payment (for demo purposes)
export const recordPayment = mutation({
    args: {
        organizationId: v.optional(v.id("organizations")),
        amount: v.number(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        let orgId = args.organizationId;
        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) throw new Error("No organization found");
            orgId = orgs[0]._id;
        }

        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .first();

        if (!subscription) throw new Error("No subscription found");

        const oneMonth = 30 * 24 * 60 * 60 * 1000;

        const paymentId = await ctx.db.insert("subscriptionPayments", {
            organizationId: orgId,
            subscriptionId: subscription._id,
            amount: args.amount,
            currency: "USD",
            description: args.description,
            status: "succeeded",
            paymentDate: now,
            periodStart: now,
            periodEnd: now + oneMonth,
            paymentMethod: subscription.paymentMethodType && subscription.paymentMethodLast4
                ? `${subscription.paymentMethodType} ****${subscription.paymentMethodLast4}`
                : undefined,
            createdAt: now,
        });

        return { success: true, paymentId };
    },
});
