import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Save all billing settings
export const saveBillingSettings = mutation({
    args: {
        organizationId: v.optional(v.id("organizations")),
        payoutSchedule: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
        achEnabled: v.boolean(),
        cardEnabled: v.boolean(),
        paypalEnabled: v.boolean(),
        checkEnabled: v.boolean(),
        lateFeeEnabled: v.boolean(),
        lateFeeType: v.union(v.literal("fixed"), v.literal("percentage")),
        lateFeeAmount: v.number(),
        gracePeriodDays: v.number(),
        autoApplyLateFee: v.boolean(),
        remindersEnabled: v.boolean(),
        beforeDueDays: v.array(v.number()),
        afterDueDays: v.array(v.number()),
        emailRemindersEnabled: v.boolean(),
        smsRemindersEnabled: v.boolean(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Get org ID
        let orgId = args.organizationId;
        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) throw new Error("No organization found");
            orgId = orgs[0]._id;
        }

        // Check if settings exist
        const existingSettings = await ctx.db
            .query("billingSettings")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .first();

        if (existingSettings) {
            // Update existing settings
            await ctx.db.patch(existingSettings._id, {
                payoutSchedule: args.payoutSchedule,
                achEnabled: args.achEnabled,
                cardEnabled: args.cardEnabled,
                paypalEnabled: args.paypalEnabled,
                checkEnabled: args.checkEnabled,
                lateFeeEnabled: args.lateFeeEnabled,
                lateFeeType: args.lateFeeType,
                lateFeeAmount: args.lateFeeAmount,
                gracePeriodDays: args.gracePeriodDays,
                autoApplyLateFee: args.autoApplyLateFee,
                remindersEnabled: args.remindersEnabled,
                beforeDueDays: args.beforeDueDays,
                afterDueDays: args.afterDueDays,
                emailRemindersEnabled: args.emailRemindersEnabled,
                smsRemindersEnabled: args.smsRemindersEnabled,
                updatedAt: now,
            });
            return { success: true, id: existingSettings._id };
        }

        // Create new settings
        const settingsId = await ctx.db.insert("billingSettings", {
            organizationId: orgId,
            payoutSchedule: args.payoutSchedule,
            achEnabled: args.achEnabled,
            cardEnabled: args.cardEnabled,
            paypalEnabled: args.paypalEnabled,
            checkEnabled: args.checkEnabled,
            lateFeeEnabled: args.lateFeeEnabled,
            lateFeeType: args.lateFeeType,
            lateFeeAmount: args.lateFeeAmount,
            gracePeriodDays: args.gracePeriodDays,
            autoApplyLateFee: args.autoApplyLateFee,
            remindersEnabled: args.remindersEnabled,
            beforeDueDays: args.beforeDueDays,
            afterDueDays: args.afterDueDays,
            emailRemindersEnabled: args.emailRemindersEnabled,
            smsRemindersEnabled: args.smsRemindersEnabled,
            createdAt: now,
            updatedAt: now,
        });

        return { success: true, id: settingsId };
    },
});

// Update payout schedule only
export const updatePayoutSchedule = mutation({
    args: {
        schedule: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
    },
    handler: async (ctx, args) => {
        const orgs = await ctx.db.query("organizations").take(1);
        if (orgs.length === 0) throw new Error("No organization found");

        const settings = await ctx.db
            .query("billingSettings")
            .withIndex("by_org", (q) => q.eq("organizationId", orgs[0]._id))
            .first();

        if (settings) {
            await ctx.db.patch(settings._id, {
                payoutSchedule: args.schedule,
                updatedAt: Date.now(),
            });
        }

        return { success: true };
    },
});
