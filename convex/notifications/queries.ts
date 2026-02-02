import { query } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Notification queries
export const listNotifications = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return [];
    },
});

export const getUnreadCount = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return 0;
    },
});
