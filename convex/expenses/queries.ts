import { query } from "../_generated/server";
import { v } from "convex/values";

// List expenses with filters
export const listExpenses = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        propertyId: v.optional(v.id("properties")),
        category: v.optional(v.string()),
        status: v.optional(v.string()),
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let orgId = args.organizationId;

        // Get first org if not provided
        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) return [];
            orgId = orgs[0]._id;
        }

        let expensesQuery = ctx.db
            .query("expenses")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId));

        let expenses = await expensesQuery.collect();

        // Apply filters
        if (args.propertyId) {
            expenses = expenses.filter((e) => e.propertyId === args.propertyId);
        }
        if (args.category) {
            expenses = expenses.filter((e) => e.category === args.category);
        }
        if (args.status) {
            expenses = expenses.filter((e) => e.status === args.status);
        }
        if (args.startDate) {
            expenses = expenses.filter((e) => e.date >= args.startDate!);
        }
        if (args.endDate) {
            expenses = expenses.filter((e) => e.date <= args.endDate!);
        }

        // Sort by date descending
        expenses.sort((a, b) => b.date - a.date);

        // Apply limit
        if (args.limit) {
            expenses = expenses.slice(0, args.limit);
        }

        // Enrich with property and vendor info
        const enriched = await Promise.all(
            expenses.map(async (expense) => {
                const property = expense.propertyId
                    ? await ctx.db.get(expense.propertyId)
                    : null;
                const vendor = expense.vendorId
                    ? await ctx.db.get(expense.vendorId)
                    : null;

                return {
                    ...expense,
                    propertyName: property?.name || "All Properties",
                    vendorDisplayName: vendor?.name || expense.vendorName || null,
                };
            })
        );

        return enriched;
    },
});

// Get single expense
export const getExpense = query({
    args: { expenseId: v.id("expenses") },
    handler: async (ctx, args) => {
        const expense = await ctx.db.get(args.expenseId);
        if (!expense) return null;

        const property = expense.propertyId
            ? await ctx.db.get(expense.propertyId)
            : null;
        const unit = expense.unitId ? await ctx.db.get(expense.unitId) : null;
        const vendor = expense.vendorId
            ? await ctx.db.get(expense.vendorId)
            : null;

        return {
            ...expense,
            propertyName: property?.name || "All Properties",
            unitName: unit?.name || null,
            vendorDisplayName: vendor?.name || expense.vendorName || null,
        };
    },
});

// Get expense statistics
export const getExpenseStats = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        month: v.optional(v.number()), // Unix timestamp for start of month
    },
    handler: async (ctx, args) => {
        let orgId = args.organizationId;

        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) {
                return {
                    totalThisMonth: 0,
                    totalLastMonth: 0,
                    totalYTD: 0,
                    byCategory: [],
                    changePercent: 0,
                };
            }
            orgId = orgs[0]._id;
        }

        const now = new Date();
        const monthStart = args.month || new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();

        // Last month
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime();

        // Year start
        const yearStart = new Date(now.getFullYear(), 0, 1).getTime();

        const allExpenses = await ctx.db
            .query("expenses")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .collect();

        // Filter by status (only paid expenses)
        const paidExpenses = allExpenses.filter((e) => e.status === "paid");

        // This month
        const thisMonthExpenses = paidExpenses.filter(
            (e) => e.date >= monthStart && e.date <= monthEnd
        );
        const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

        // Last month
        const lastMonthExpenses = paidExpenses.filter(
            (e) => e.date >= lastMonthStart && e.date <= lastMonthEnd
        );
        const totalLastMonth = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

        // YTD
        const ytdExpenses = paidExpenses.filter((e) => e.date >= yearStart);
        const totalYTD = ytdExpenses.reduce((sum, e) => sum + e.amount, 0);

        // By category (this month)
        const categoryMap = new Map<string, number>();
        thisMonthExpenses.forEach((e) => {
            const current = categoryMap.get(e.category) || 0;
            categoryMap.set(e.category, current + e.amount);
        });

        const byCategory = Array.from(categoryMap.entries())
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalThisMonth > 0 ? Math.round((amount / totalThisMonth) * 100) : 0,
            }))
            .sort((a, b) => b.amount - a.amount);

        // Change percent
        const changePercent = totalLastMonth > 0
            ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
            : 0;

        return {
            totalThisMonth,
            totalLastMonth,
            totalYTD,
            byCategory,
            changePercent: Math.round(changePercent * 10) / 10,
        };
    },
});

// Get recent expenses
export const getRecentExpenses = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        let orgId = args.organizationId;

        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) return [];
            orgId = orgs[0]._id;
        }

        const expenses = await ctx.db
            .query("expenses")
            .withIndex("by_org", (q) => q.eq("organizationId", orgId))
            .order("desc")
            .take(limit * 2); // Get more to account for enrichment

        // Enrich with property info
        const enriched = await Promise.all(
            expenses.slice(0, limit).map(async (expense) => {
                const property = expense.propertyId
                    ? await ctx.db.get(expense.propertyId)
                    : null;

                return {
                    ...expense,
                    propertyName: property?.name || "All Properties",
                };
            })
        );

        return enriched;
    },
});
