import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Notification mutations
export const markAsRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        return null;
    },
});

export const markAllAsRead = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return null;
    },
});
