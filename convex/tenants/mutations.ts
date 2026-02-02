import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Generate a random invite code
function generateInviteCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "TNT-";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Create/Invite a new tenant
export const inviteTenant = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        phone: v.string(),
        unitId: v.id("units"),
        propertyId: v.id("properties"),
        leaseStartDate: v.number(),
        leaseEndDate: v.number(),
        monthlyRent: v.number(),
        securityDeposit: v.optional(v.number()),
        sendInviteEmail: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        // Get the unit to find organization
        const unit = await ctx.db.get(args.unitId);
        if (!unit) throw new Error("Unit not found");

        const property = await ctx.db.get(args.propertyId);
        if (!property) throw new Error("Property not found");

        const inviteCode = generateInviteCode();
        const now = Date.now();

        // Create the tenant record
        const tenantId = await ctx.db.insert("tenants", {
            organizationId: unit.organizationId,
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            phone: args.phone,
            unitId: args.unitId,
            propertyId: args.propertyId,
            emergencyContacts: [],
            vehicles: [],
            portalStatus: "invited",
            inviteCode,
            invitedAt: now,
            autopayEnabled: false,
            status: "current",
            moveInDate: args.leaseStartDate,
            currentBalance: 0,
            createdAt: now,
            updatedAt: now,
        });

        // Create the lease record
        const leaseId = await ctx.db.insert("leases", {
            organizationId: unit.organizationId,
            propertyId: args.propertyId,
            unitId: args.unitId,
            tenantId,
            type: "fixed",
            startDate: args.leaseStartDate,
            endDate: args.leaseEndDate,
            rentAmount: args.monthlyRent,
            depositAmount: args.securityDeposit || args.monthlyRent,
            depositStatus: args.securityDeposit ? "held" : "pending",
            status: "active",
            paymentDueDay: 1,
            lateFeeAmount: 50,
            lateFeeGraceDays: 5,
            terms: {
                petsAllowed: property.policies?.petsAllowed || false,
                smokingAllowed: false,
                sublettingAllowed: false,
            },
            signatures: {},
            createdAt: now,
            updatedAt: now,
        });

        // Update tenant with lease ID
        await ctx.db.patch(tenantId, { leaseId });

        // Update unit with tenant and lease
        await ctx.db.patch(args.unitId, {
            status: "occupied",
            currentTenantId: tenantId,
            currentLeaseId: leaseId,
            updatedAt: now,
        });

        return { tenantId, leaseId, inviteCode };
    },
});

// Update tenant details
export const updateTenant = mutation({
    args: {
        tenantId: v.id("tenants"),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        dateOfBirth: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { tenantId, ...updates } = args;
        
        const tenant = await ctx.db.get(tenantId);
        if (!tenant) throw new Error("Tenant not found");

        // Filter out undefined values
        const filteredUpdates: Record<string, any> = {};
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                filteredUpdates[key] = value;
            }
        }

        if (Object.keys(filteredUpdates).length > 0) {
            await ctx.db.patch(tenantId, {
                ...filteredUpdates,
                updatedAt: Date.now(),
            });
        }

        return tenantId;
    },
});

// Update emergency contacts
export const updateEmergencyContacts = mutation({
    args: {
        tenantId: v.id("tenants"),
        emergencyContacts: v.array(v.object({
            name: v.string(),
            relationship: v.string(),
            phone: v.string(),
            email: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error("Tenant not found");

        await ctx.db.patch(args.tenantId, {
            emergencyContacts: args.emergencyContacts,
            updatedAt: Date.now(),
        });

        return args.tenantId;
    },
});

// Update vehicles
export const updateVehicles = mutation({
    args: {
        tenantId: v.id("tenants"),
        vehicles: v.array(v.object({
            make: v.string(),
            model: v.string(),
            year: v.number(),
            color: v.string(),
            licensePlate: v.string(),
            state: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error("Tenant not found");

        await ctx.db.patch(args.tenantId, {
            vehicles: args.vehicles,
            updatedAt: Date.now(),
        });

        return args.tenantId;
    },
});

// Mark tenant as moving out
export const markMovingOut = mutation({
    args: {
        tenantId: v.id("tenants"),
        moveOutDate: v.number(),
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error("Tenant not found");

        await ctx.db.patch(args.tenantId, {
            moveOutDate: args.moveOutDate,
            updatedAt: Date.now(),
        });

        return args.tenantId;
    },
});

// Complete move out
export const completeMoveOut = mutation({
    args: {
        tenantId: v.id("tenants"),
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error("Tenant not found");

        const now = Date.now();

        // Update tenant status
        await ctx.db.patch(args.tenantId, {
            status: "past",
            moveOutDate: now,
            updatedAt: now,
        });

        // Update lease status
        if (tenant.leaseId) {
            await ctx.db.patch(tenant.leaseId, {
                status: "terminated",
                updatedAt: now,
            });
        }

        // Update unit status
        await ctx.db.patch(tenant.unitId, {
            status: "vacant",
            currentTenantId: undefined,
            currentLeaseId: undefined,
            updatedAt: now,
        });

        return args.tenantId;
    },
});

// Record a manual payment
export const recordPayment = mutation({
    args: {
        tenantId: v.id("tenants"),
        amount: v.number(),
        type: v.union(
            v.literal("rent"),
            v.literal("deposit"),
            v.literal("late_fee"),
            v.literal("other")
        ),
        paymentMethod: v.string(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error("Tenant not found");

        const now = Date.now();

        // Create payment record
        const paymentId = await ctx.db.insert("payments", {
            organizationId: tenant.organizationId,
            tenantId: args.tenantId,
            leaseId: tenant.leaseId!,
            unitId: tenant.unitId,
            type: args.type,
            amount: args.amount,
            dueDate: now,
            paidDate: now,
            status: "completed",
            paymentMethod: args.paymentMethod as any,
            isLate: false,
            createdAt: now,
            updatedAt: now,
        });

        // Update tenant balance
        await ctx.db.patch(args.tenantId, {
            currentBalance: tenant.currentBalance - args.amount,
            updatedAt: now,
        });

        return paymentId;
    },
});

// Charge a fee (late fee, etc.)
export const chargeFee = mutation({
    args: {
        tenantId: v.id("tenants"),
        amount: v.number(),
        description: v.string(),
        type: v.union(
            v.literal("late_fee"),
            v.literal("pet_fee"),
            v.literal("utility"),
            v.literal("damage"),
            v.literal("other")
        ),
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error("Tenant not found");

        const now = Date.now();

        // Update tenant balance
        await ctx.db.patch(args.tenantId, {
            currentBalance: tenant.currentBalance + args.amount,
            updatedAt: now,
        });

        return args.tenantId;
    },
});

// Resend invite
export const resendInvite = mutation({
    args: {
        tenantId: v.id("tenants"),
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error("Tenant not found");

        const inviteCode = generateInviteCode();

        await ctx.db.patch(args.tenantId, {
            inviteCode,
            invitedAt: Date.now(),
            portalStatus: "invited",
            updatedAt: Date.now(),
        });

        return { inviteCode };
    },
});
