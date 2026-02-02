import { query } from "../_generated/server";
import { v } from "convex/values";

// Coming soon: Maintenance queries
export const getWorkOrder = query({
    args: { workOrderId: v.id("maintenanceRequests") },
    handler: async (ctx, args) => {
        return null;
    },
});

export const listWorkOrders = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        return [];
    },
});
