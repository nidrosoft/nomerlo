import { query } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Document queries
export const getDocument = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, args) => {
        return null;
    },
});

export const listDocuments = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        return [];
    },
});
