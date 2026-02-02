import { query } from "../_generated/server";
import { v } from "convex/values";

// Get a single payment by ID
export const getPayment = query({
    args: { paymentId: v.id("payments") },
    handler: async (ctx, args) => {
        const payment = await ctx.db.get(args.paymentId);
        if (!payment) return null;

        const tenant = await ctx.db.get(payment.tenantId);
        const unit = await ctx.db.get(payment.unitId);
        const property = unit ? await ctx.db.get(unit.propertyId) : null;

        return { ...payment, tenant, unit, property };
    },
});

// List payments with optional filters
export const listPayments = query({
    args: { 
        organizationId: v.optional(v.id("organizations")),
        tenantId: v.optional(v.id("tenants")),
        status: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let payments;

        if (args.organizationId) {
            payments = await ctx.db
                .query("payments")
                .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
                .order("desc")
                .collect();
        } else {
            payments = await ctx.db.query("payments").order("desc").collect();
        }

        if (args.tenantId) {
            payments = payments.filter((p) => p.tenantId === args.tenantId);
        }

        if (args.status) {
            payments = payments.filter((p) => p.status === args.status);
        }

        if (args.limit) {
            payments = payments.slice(0, args.limit);
        }

        const paymentsWithDetails = await Promise.all(
            payments.map(async (payment) => {
                const tenant = await ctx.db.get(payment.tenantId);
                const unit = await ctx.db.get(payment.unitId);
                return { ...payment, tenant, unit };
            })
        );

        return paymentsWithDetails;
    },
});

// Get recent payments for billing overview
export const getRecentPayments = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        const payments = await ctx.db
            .query("payments")
            .filter((q) => q.eq(q.field("status"), "completed"))
            .order("desc")
            .take(limit);

        const paymentsWithDetails = await Promise.all(
            payments.map(async (payment) => {
                const tenant = await ctx.db.get(payment.tenantId);
                return { ...payment, tenant };
            })
        );

        return paymentsWithDetails;
    },
});
