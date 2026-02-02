import { query } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Admin queries
export const listAllOrganizations = query({
    args: {},
    handler: async (ctx, args) => {
        return [];
    },
});

export const getPlatformStats = query({
    args: {},
    handler: async (ctx, args) => {
        return null;
    },
});
