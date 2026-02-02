import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Generate invoice number
const generateInvoiceNumber = (date: Date): string => {
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `INV-${year}-${random}`;
};

// Create a new invoice
export const createInvoice = mutation({
    args: {
        organizationId: v.id("organizations"),
        tenantId: v.id("tenants"),
        leaseId: v.id("leases"),
        lineItems: v.array(v.object({
            description: v.string(),
            amount: v.number(),
            type: v.string(),
        })),
        dueDate: v.number(),
        notes: v.optional(v.string()),
        sendEmail: v.optional(v.boolean()),
        sendNotification: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        
        // Calculate totals
        const subtotal = args.lineItems.reduce((sum, item) => sum + item.amount, 0);
        const total = subtotal; // No tax for now
        
        const invoiceId = await ctx.db.insert("invoices", {
            organizationId: args.organizationId,
            tenantId: args.tenantId,
            leaseId: args.leaseId,
            invoiceNumber: generateInvoiceNumber(new Date()),
            lineItems: args.lineItems,
            subtotal,
            total,
            amountPaid: 0,
            amountDue: total,
            issueDate: now,
            dueDate: args.dueDate,
            status: args.sendEmail ? "sent" : "draft",
            reminderCount: 0,
            createdAt: now,
            updatedAt: now,
        });

        return invoiceId;
    },
});

// Send invoice to tenant
export const sendInvoice = mutation({
    args: { invoiceId: v.id("invoices") },
    handler: async (ctx, args) => {
        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice) throw new Error("Invoice not found");

        await ctx.db.patch(args.invoiceId, {
            status: "sent",
            updatedAt: Date.now(),
        });

        // TODO: Send email notification to tenant
        return { success: true };
    },
});

// Mark invoice as paid
export const markAsPaid = mutation({
    args: { 
        invoiceId: v.id("invoices"),
        paymentMethod: v.optional(v.string()),
        paymentDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice) throw new Error("Invoice not found");

        const now = Date.now();

        await ctx.db.patch(args.invoiceId, {
            status: "paid",
            amountPaid: invoice.total,
            amountDue: 0,
            updatedAt: now,
        });

        // Record the payment
        await ctx.db.insert("payments", {
            organizationId: invoice.organizationId,
            tenantId: invoice.tenantId,
            leaseId: invoice.leaseId,
            unitId: (await ctx.db.get(invoice.leaseId))?.unitId!,
            type: "rent",
            amount: invoice.total,
            status: "completed",
            paymentMethod: (args.paymentMethod as any) || "manual",
            dueDate: invoice.dueDate,
            paidAt: args.paymentDate || now,
            isLate: (args.paymentDate || now) > invoice.dueDate,
            createdAt: now,
            updatedAt: now,
        });

        return { success: true };
    },
});

// Cancel invoice
export const cancelInvoice = mutation({
    args: { invoiceId: v.id("invoices") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.invoiceId, {
            status: "cancelled",
            updatedAt: Date.now(),
        });
        return { success: true };
    },
});

// Send payment reminder
export const sendReminder = mutation({
    args: { invoiceId: v.id("invoices") },
    handler: async (ctx, args) => {
        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice) throw new Error("Invoice not found");

        await ctx.db.patch(args.invoiceId, {
            lastReminderAt: Date.now(),
            reminderCount: invoice.reminderCount + 1,
            updatedAt: Date.now(),
        });

        // TODO: Send reminder notification
        return { success: true };
    },
});

// Apply late fee to overdue invoice
export const applyLateFee = mutation({
    args: { 
        invoiceId: v.id("invoices"),
        lateFeeAmount: v.number(),
    },
    handler: async (ctx, args) => {
        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice) throw new Error("Invoice not found");

        const newLineItems = [
            ...invoice.lineItems,
            { description: "Late Fee", amount: args.lateFeeAmount, type: "late_fee" },
        ];

        const newTotal = invoice.total + args.lateFeeAmount;

        await ctx.db.patch(args.invoiceId, {
            lineItems: newLineItems,
            total: newTotal,
            amountDue: newTotal - invoice.amountPaid,
            status: "overdue",
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});
