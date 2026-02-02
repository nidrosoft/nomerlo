import { query } from "../_generated/server";
import { v } from "convex/values";

// Get a single invoice by ID with related data
export const getInvoice = query({
    args: { invoiceId: v.id("invoices") },
    handler: async (ctx, args) => {
        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice) return null;

        // Get related data
        const tenant = await ctx.db.get(invoice.tenantId);
        const lease = await ctx.db.get(invoice.leaseId);
        const unit = lease ? await ctx.db.get(lease.unitId) : null;
        const property = unit ? await ctx.db.get(unit.propertyId) : null;

        // Get payments for this invoice
        const payments = await ctx.db
            .query("payments")
            .filter((q) => q.eq(q.field("leaseId"), invoice.leaseId))
            .order("desc")
            .collect();

        return {
            ...invoice,
            tenant,
            lease,
            unit,
            property,
            payments,
        };
    },
});

// List invoices with optional filters
export const listInvoices = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        status: v.optional(v.string()),
        tenantId: v.optional(v.id("tenants")),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let invoices;

        if (args.organizationId) {
            const orgId = args.organizationId;
            if (args.status) {
                const status = args.status;
                invoices = await ctx.db
                    .query("invoices")
                    .withIndex("by_status", (q) =>
                        q.eq("organizationId", orgId).eq("status", status as any)
                    )
                    .order("desc")
                    .collect();
            } else {
                invoices = await ctx.db
                    .query("invoices")
                    .withIndex("by_org", (q) => q.eq("organizationId", orgId))
                    .order("desc")
                    .collect();
            }
        } else {
            invoices = await ctx.db.query("invoices").order("desc").collect();
        }

        // Filter by tenant if provided
        if (args.tenantId) {
            invoices = invoices.filter((i) => i.tenantId === args.tenantId);
        }

        // Apply limit if provided
        if (args.limit) {
            invoices = invoices.slice(0, args.limit);
        }

        // Fetch related data
        const invoicesWithDetails = await Promise.all(
            invoices.map(async (invoice) => {
                const tenant = await ctx.db.get(invoice.tenantId);
                const lease = await ctx.db.get(invoice.leaseId);
                const unit = lease ? await ctx.db.get(lease.unitId) : null;

                return {
                    ...invoice,
                    tenant,
                    unit,
                };
            })
        );

        return invoicesWithDetails;
    },
});

// Get recent invoices for billing overview
export const getRecentInvoices = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        const invoices = await ctx.db.query("invoices").order("desc").take(limit);

        const invoicesWithDetails = await Promise.all(
            invoices.map(async (invoice) => {
                const tenant = await ctx.db.get(invoice.tenantId);
                const lease = await ctx.db.get(invoice.leaseId);
                const unit = lease ? await ctx.db.get(lease.unitId) : null;

                return {
                    ...invoice,
                    tenant,
                    unit,
                };
            })
        );

        return invoicesWithDetails;
    },
});

// Get invoice statistics for billing overview
export const getInvoiceStats = query({
    args: { 
        organizationId: v.optional(v.id("organizations")),
        month: v.optional(v.number()), // Unix timestamp for month start
    },
    handler: async (ctx, args) => {
        let invoices;

        if (args.organizationId) {
            const orgId = args.organizationId;
            invoices = await ctx.db
                .query("invoices")
                .withIndex("by_org", (q) => q.eq("organizationId", orgId))
                .collect();
        } else {
            invoices = await ctx.db.query("invoices").collect();
        }

        // Filter by month if provided
        if (args.month) {
            const monthStart = args.month;
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            
            invoices = invoices.filter((i) => 
                i.dueDate >= monthStart && i.dueDate < monthEnd.getTime()
            );
        }

        // Calculate stats
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter((i) => i.status === "paid");
        const pendingInvoices = invoices.filter((i) => 
            i.status === "sent" || i.status === "viewed" || i.status === "partial"
        );
        const overdueInvoices = invoices.filter((i) => i.status === "overdue");

        const collected = paidInvoices.reduce((sum, i) => sum + i.amountPaid, 0);
        const outstanding = [...pendingInvoices, ...overdueInvoices].reduce(
            (sum, i) => sum + i.amountDue, 0
        );
        const expected = invoices.reduce((sum, i) => sum + i.total, 0);
        const collectionRate = expected > 0 ? Math.round((collected / expected) * 100) : 0;

        return {
            collected,
            outstanding,
            expected,
            collectionRate,
            totalInvoices,
            paidCount: paidInvoices.length,
            pendingCount: pendingInvoices.length,
            overdueCount: overdueInvoices.length,
        };
    },
});
