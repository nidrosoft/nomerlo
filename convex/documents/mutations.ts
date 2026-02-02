import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Document mutations
export const createDocument = mutation({
    args: {
        organizationId: v.id("organizations"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        return null;
    },
});

export const deleteDocument = mutation({
    args: {
        documentId: v.id("documents"),
    },
    handler: async (ctx, args) => {
        return null;
    },
});
