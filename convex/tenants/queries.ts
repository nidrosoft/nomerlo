import { query } from "../_generated/server";
import { v } from "convex/values";

// Get a single tenant by ID with related data
export const getTenant = query({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) return null;

        // Get related data
        const unit = await ctx.db.get(tenant.unitId);
        const property = await ctx.db.get(tenant.propertyId);
        const lease = tenant.leaseId ? await ctx.db.get(tenant.leaseId) : null;

        // Get payment stats
        const payments = await ctx.db
            .query("payments")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .collect();

        const onTimePayments = payments.filter((p) => p.status === "completed" && !p.isLate).length;
        const latePayments = payments.filter((p) => p.status === "completed" && p.isLate).length;
        const totalPaid = payments
            .filter((p) => p.status === "completed")
            .reduce((sum, p) => sum + p.amount, 0);

        return {
            ...tenant,
            unit,
            property,
            lease,
            paymentStats: {
                onTimePayments,
                latePayments,
                totalPaid,
            },
        };
    },
});

// List tenants for an organization with optional filters
export const listTenants = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        status: v.optional(v.string()),
        propertyId: v.optional(v.id("properties")),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let tenants;

        if (args.organizationId) {
            if (args.status) {
                tenants = await ctx.db
                    .query("tenants")
                    .withIndex("by_status", (q) =>
                        q.eq("organizationId", args.organizationId).eq("status", args.status as any)
                    )
                    .order("desc")
                    .collect();
            } else {
                tenants = await ctx.db
                    .query("tenants")
                    .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
                    .order("desc")
                    .collect();
            }
        } else {
            // For demo, get all tenants
            tenants = await ctx.db.query("tenants").order("desc").collect();
        }

        // Filter by property if provided
        if (args.propertyId) {
            tenants = tenants.filter((t) => t.propertyId === args.propertyId);
        }

        // Filter by search if provided
        if (args.search) {
            const searchLower = args.search.toLowerCase();
            tenants = tenants.filter(
                (t) =>
                    t.firstName.toLowerCase().includes(searchLower) ||
                    t.lastName.toLowerCase().includes(searchLower) ||
                    t.email.toLowerCase().includes(searchLower) ||
                    t.phone.includes(args.search!)
            );
        }

        // Fetch related data for each tenant
        const tenantsWithDetails = await Promise.all(
            tenants.map(async (tenant) => {
                const unit = await ctx.db.get(tenant.unitId);
                const property = await ctx.db.get(tenant.propertyId);
                const lease = tenant.leaseId ? await ctx.db.get(tenant.leaseId) : null;

                return {
                    ...tenant,
                    unit,
                    property,
                    lease,
                };
            })
        );

        return tenantsWithDetails;
    },
});

// Get tenant statistics for dashboard
export const getTenantStats = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        let tenants;

        if (args.organizationId) {
            tenants = await ctx.db
                .query("tenants")
                .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
                .collect();
        } else {
            tenants = await ctx.db.query("tenants").collect();
        }

        const stats = {
            total: tenants.length,
            active: tenants.filter((t) => t.status === "current").length,
            movingOut: tenants.filter((t) => {
                if (t.status !== "current" || !t.moveOutDate) return false;
                const daysUntilMoveOut = (t.moveOutDate - Date.now()) / (1000 * 60 * 60 * 24);
                return daysUntilMoveOut > 0 && daysUntilMoveOut <= 60;
            }).length,
            past: tenants.filter((t) => t.status === "past").length,
            withBalance: tenants.filter((t) => t.currentBalance > 0).length,
        };

        return stats;
    },
});

// Get tenants with expiring leases
export const getExpiringLeases = query({
    args: { 
        organizationId: v.optional(v.id("organizations")),
        daysAhead: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const daysAhead = args.daysAhead || 60;
        const cutoffDate = Date.now() + daysAhead * 24 * 60 * 60 * 1000;

        let tenants;
        if (args.organizationId) {
            tenants = await ctx.db
                .query("tenants")
                .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
                .collect();
        } else {
            tenants = await ctx.db.query("tenants").collect();
        }

        // Filter to current tenants only
        tenants = tenants.filter((t) => t.status === "current");

        // Get tenants with expiring leases
        const tenantsWithExpiringLeases = await Promise.all(
            tenants.map(async (tenant) => {
                if (!tenant.leaseId) return null;
                
                const lease = await ctx.db.get(tenant.leaseId);
                if (!lease || lease.endDate > cutoffDate) return null;

                const unit = await ctx.db.get(tenant.unitId);
                const property = await ctx.db.get(tenant.propertyId);

                const daysRemaining = Math.ceil((lease.endDate - Date.now()) / (1000 * 60 * 60 * 24));

                return {
                    ...tenant,
                    unit,
                    property,
                    lease,
                    daysRemaining,
                };
            })
        );

        return tenantsWithExpiringLeases
            .filter((t) => t !== null)
            .sort((a, b) => a.daysRemaining - b.daysRemaining);
    },
});
