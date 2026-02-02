import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create vendor
export const createVendor = mutation({
    args: {
        organizationId: v.optional(v.id("organizations")),
        name: v.string(),
        contactName: v.string(),
        email: v.string(),
        phone: v.string(),
        categories: v.array(v.string()),
        address: v.optional(
            v.object({
                street: v.string(),
                city: v.string(),
                state: v.string(),
                zip: v.string(),
            })
        ),
        paymentTerms: v.optional(v.string()),
        w9OnFile: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        let orgId = args.organizationId;
        if (!orgId) {
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length === 0) throw new Error("No organization found");
            orgId = orgs[0]._id;
        }

        const vendorId = await ctx.db.insert("vendors", {
            organizationId: orgId,
            name: args.name,
            contactName: args.contactName,
            email: args.email,
            phone: args.phone,
            categories: args.categories,
            address: args.address,
            paymentTerms: args.paymentTerms,
            w9OnFile: args.w9OnFile ?? false,
            rating: undefined,
            completedJobs: 0,
            status: "active",
            createdAt: now,
            updatedAt: now,
        });

        return { success: true, vendorId };
    },
});

// Update vendor
export const updateVendor = mutation({
    args: {
        vendorId: v.id("vendors"),
        name: v.optional(v.string()),
        contactName: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        categories: v.optional(v.array(v.string())),
        address: v.optional(
            v.object({
                street: v.string(),
                city: v.string(),
                state: v.string(),
                zip: v.string(),
            })
        ),
        paymentTerms: v.optional(v.string()),
        w9OnFile: v.optional(v.boolean()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { vendorId, ...updates } = args;

        const vendor = await ctx.db.get(vendorId);
        if (!vendor) throw new Error("Vendor not found");

        const updateData: Record<string, unknown> = { updatedAt: Date.now() };

        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.contactName !== undefined) updateData.contactName = updates.contactName;
        if (updates.email !== undefined) updateData.email = updates.email;
        if (updates.phone !== undefined) updateData.phone = updates.phone;
        if (updates.categories !== undefined) updateData.categories = updates.categories;
        if (updates.address !== undefined) updateData.address = updates.address;
        if (updates.paymentTerms !== undefined) updateData.paymentTerms = updates.paymentTerms;
        if (updates.w9OnFile !== undefined) updateData.w9OnFile = updates.w9OnFile;
        if (updates.status !== undefined) updateData.status = updates.status;

        await ctx.db.patch(vendorId, updateData);

        return { success: true };
    },
});

// Delete vendor
export const deleteVendor = mutation({
    args: { vendorId: v.id("vendors") },
    handler: async (ctx, args) => {
        const vendor = await ctx.db.get(args.vendorId);
        if (!vendor) throw new Error("Vendor not found");

        await ctx.db.delete(args.vendorId);

        return { success: true };
    },
});
