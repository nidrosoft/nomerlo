import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create or update a user from Clerk webhook
export const createUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        phone: v.optional(v.string()),
        role: v.optional(v.union(
            v.literal("super_admin"),
            v.literal("owner"),
            v.literal("tenant"),
            v.literal("maintenance"),
            v.literal("staff")
        )),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (existingUser) {
            // Update existing user
            await ctx.db.patch(existingUser._id, {
                email: args.email,
                firstName: args.firstName,
                lastName: args.lastName,
                imageUrl: args.imageUrl,
                phone: args.phone,
                lastLoginAt: now,
                updatedAt: now,
            });
            return existingUser._id;
        }

        // Create new user
        const userId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            firstName: args.firstName,
            lastName: args.lastName,
            imageUrl: args.imageUrl,
            phone: args.phone,
            role: args.role || "owner", // Default to owner for new signups
            status: "active",
            lastLoginAt: now,
            createdAt: now,
            updatedAt: now,
        });

        return userId;
    },
});

// Update user profile
export const updateUser = mutation({
    args: {
        userId: v.id("users"),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        phone: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { userId, ...updates } = args;

        const user = await ctx.db.get(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const updateData: Record<string, unknown> = {
            updatedAt: Date.now(),
        };

        if (updates.firstName !== undefined) updateData.firstName = updates.firstName;
        if (updates.lastName !== undefined) updateData.lastName = updates.lastName;
        if (updates.phone !== undefined) updateData.phone = updates.phone;
        if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl;

        await ctx.db.patch(userId, updateData);

        return { success: true };
    },
});

// Update last login time
export const updateLastLogin = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (user) {
            await ctx.db.patch(user._id, {
                lastLoginAt: Date.now(),
            });
        }

        return user?._id;
    },
});

// Sync user from Clerk (called by webhook or on login)
export const syncFromClerk = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (existingUser) {
            // Update existing user
            await ctx.db.patch(existingUser._id, {
                email: args.email,
                firstName: args.firstName,
                lastName: args.lastName,
                imageUrl: args.imageUrl,
                lastLoginAt: now,
                updatedAt: now,
            });
            return { userId: existingUser._id, isNew: false };
        }

        // Create new user
        const userId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            firstName: args.firstName,
            lastName: args.lastName,
            imageUrl: args.imageUrl,
            phone: undefined,
            role: "owner",
            status: "active",
            lastLoginAt: now,
            createdAt: now,
            updatedAt: now,
        });

        return { userId, isNew: true };
    },
});
