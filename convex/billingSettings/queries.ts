import { query } from "../_generated/server";
import { v } from "convex/values";

// Get billing settings for an organization
export const getBillingSettings = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        // If org provided, get specific settings
        if (args.organizationId) {
            const orgId = args.organizationId;
            const settings = await ctx.db
                .query("billingSettings")
                .withIndex("by_org", (q) => q.eq("organizationId", orgId))
                .first();
            return settings;
        }

        // Get first org's settings for demo
        const orgs = await ctx.db.query("organizations").take(1);
        if (orgs.length === 0) return null;

        const settings = await ctx.db
            .query("billingSettings")
            .withIndex("by_org", (q) => q.eq("organizationId", orgs[0]._id))
            .first();

        return settings;
    },
});

// Get default settings (used when no settings exist yet)
export const getDefaultSettings = query({
    args: {},
    handler: async () => {
        return {
            payoutSchedule: "daily" as const,
            achEnabled: true,
            cardEnabled: true,
            paypalEnabled: false,
            checkEnabled: false,
            lateFeeEnabled: true,
            lateFeeType: "fixed" as const,
            lateFeeAmount: 50,
            gracePeriodDays: 5,
            autoApplyLateFee: true,
            remindersEnabled: true,
            beforeDueDays: [3, 1],
            afterDueDays: [1, 3, 7],
            emailRemindersEnabled: true,
            smsRemindersEnabled: false,
        };
    },
});
