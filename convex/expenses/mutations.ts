import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create expense
export const createExpense = mutation({
    args: {
        organizationId: v.optional(v.id("organizations")),
        propertyId: v.optional(v.id("properties")),
        unitId: v.optional(v.id("units")),
        category: v.string(),
        description: v.string(),
        amount: v.number(),
        date: v.number(),
        vendorId: v.optional(v.id("vendors")),
        vendorName: v.optional(v.string()),
        receiptUrl: v.optional(v.string()),
        receiptStorageId: v.optional(v.id("_storage")),
        isTaxDeductible: v.optional(v.boolean()),
        taxCategory: v.optional(v.string()),
        status: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        let orgId = args.organizationId;
        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) throw new Error("No organization found");
            orgId = orgs[0]._id;
        }

        const expenseId = await ctx.db.insert("expenses", {
            organizationId: orgId,
            propertyId: args.propertyId,
            unitId: args.unitId,
            category: args.category,
            description: args.description,
            amount: args.amount,
            date: args.date,
            vendorId: args.vendorId,
            vendorName: args.vendorName,
            receiptUrl: args.receiptUrl,
            receiptStorageId: args.receiptStorageId,
            isTaxDeductible: args.isTaxDeductible ?? true,
            taxCategory: args.taxCategory,
            status: (args.status as "pending" | "paid" | "cancelled") || "paid",
            notes: args.notes,
            createdAt: now,
            updatedAt: now,
        });

        return { success: true, expenseId };
    },
});

// Update expense
export const updateExpense = mutation({
    args: {
        expenseId: v.id("expenses"),
        propertyId: v.optional(v.id("properties")),
        unitId: v.optional(v.id("units")),
        category: v.optional(v.string()),
        description: v.optional(v.string()),
        amount: v.optional(v.number()),
        date: v.optional(v.number()),
        vendorId: v.optional(v.id("vendors")),
        vendorName: v.optional(v.string()),
        receiptUrl: v.optional(v.string()),
        receiptStorageId: v.optional(v.id("_storage")),
        isTaxDeductible: v.optional(v.boolean()),
        taxCategory: v.optional(v.string()),
        status: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { expenseId, ...updates } = args;

        const expense = await ctx.db.get(expenseId);
        if (!expense) throw new Error("Expense not found");

        // Build update object
        const updateData: Record<string, unknown> = { updatedAt: Date.now() };

        if (updates.propertyId !== undefined) updateData.propertyId = updates.propertyId;
        if (updates.unitId !== undefined) updateData.unitId = updates.unitId;
        if (updates.category !== undefined) updateData.category = updates.category;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.amount !== undefined) updateData.amount = updates.amount;
        if (updates.date !== undefined) updateData.date = updates.date;
        if (updates.vendorId !== undefined) updateData.vendorId = updates.vendorId;
        if (updates.vendorName !== undefined) updateData.vendorName = updates.vendorName;
        if (updates.receiptUrl !== undefined) updateData.receiptUrl = updates.receiptUrl;
        if (updates.receiptStorageId !== undefined) updateData.receiptStorageId = updates.receiptStorageId;
        if (updates.isTaxDeductible !== undefined) updateData.isTaxDeductible = updates.isTaxDeductible;
        if (updates.taxCategory !== undefined) updateData.taxCategory = updates.taxCategory;
        if (updates.status !== undefined) updateData.status = updates.status;
        if (updates.notes !== undefined) updateData.notes = updates.notes;

        await ctx.db.patch(expenseId, updateData);

        return { success: true };
    },
});

// Delete expense
export const deleteExpense = mutation({
    args: { expenseId: v.id("expenses") },
    handler: async (ctx, args) => {
        const expense = await ctx.db.get(args.expenseId);
        if (!expense) throw new Error("Expense not found");

        await ctx.db.delete(args.expenseId);

        return { success: true };
    },
});

// Mark expense as paid
export const markAsPaid = mutation({
    args: { expenseId: v.id("expenses") },
    handler: async (ctx, args) => {
        const expense = await ctx.db.get(args.expenseId);
        if (!expense) throw new Error("Expense not found");

        await ctx.db.patch(args.expenseId, {
            status: "paid",
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Cancel expense
export const cancelExpense = mutation({
    args: { expenseId: v.id("expenses") },
    handler: async (ctx, args) => {
        const expense = await ctx.db.get(args.expenseId);
        if (!expense) throw new Error("Expense not found");

        await ctx.db.patch(args.expenseId, {
            status: "cancelled",
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});
