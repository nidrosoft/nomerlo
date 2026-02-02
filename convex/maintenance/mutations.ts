import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Maintenance mutations
export const createWorkOrder = mutation({
    args: {
        organizationId: v.id("organizations"),
        unitId: v.id("units"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        return null;
    },
});

export const updateWorkOrder = mutation({
    args: {
        workOrderId: v.id("maintenanceRequests"),
    },
    handler: async (ctx, args) => {
        return null;
    },
});
