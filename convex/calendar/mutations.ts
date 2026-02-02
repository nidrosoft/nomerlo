import { v } from "convex/values";
import { mutation } from "../_generated/server";

// Create a new calendar event
export const createEvent = mutation({
    args: {
        organizationId: v.id("organizations"),
        title: v.string(),
        description: v.optional(v.string()),
        type: v.union(
            v.literal("showing"),
            v.literal("maintenance"),
            v.literal("lease"),
            v.literal("rent"),
            v.literal("inspection"),
            v.literal("moveIn"),
            v.literal("moveOut"),
            v.literal("reminder"),
            v.literal("custom")
        ),
        startTime: v.number(),
        endTime: v.number(),
        allDay: v.boolean(),
        color: v.optional(v.union(
            v.literal("brand"),
            v.literal("orange"),
            v.literal("rose"),
            v.literal("green"),
            v.literal("blue"),
            v.literal("purple"),
            v.literal("gray")
        )),
        propertyId: v.optional(v.id("properties")),
        unitId: v.optional(v.id("units")),
        tenantId: v.optional(v.id("tenants")),
        prospectName: v.optional(v.string()),
        prospectEmail: v.optional(v.string()),
        prospectPhone: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const eventId = await ctx.db.insert("calendarEvents", {
            organizationId: args.organizationId,
            title: args.title,
            description: args.description,
            type: args.type,
            startTime: args.startTime,
            endTime: args.endTime,
            allDay: args.allDay,
            color: args.color || "brand",
            propertyId: args.propertyId,
            unitId: args.unitId,
            tenantId: args.tenantId,
            prospectName: args.prospectName,
            prospectEmail: args.prospectEmail,
            prospectPhone: args.prospectPhone,
            notes: args.notes,
            status: "scheduled",
            createdAt: now,
            updatedAt: now,
        });

        return eventId;
    },
});

// Update an existing event
export const updateEvent = mutation({
    args: {
        eventId: v.id("calendarEvents"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        type: v.optional(v.union(
            v.literal("showing"),
            v.literal("maintenance"),
            v.literal("lease"),
            v.literal("rent"),
            v.literal("inspection"),
            v.literal("moveIn"),
            v.literal("moveOut"),
            v.literal("reminder"),
            v.literal("custom")
        )),
        startTime: v.optional(v.number()),
        endTime: v.optional(v.number()),
        allDay: v.optional(v.boolean()),
        color: v.optional(v.union(
            v.literal("brand"),
            v.literal("orange"),
            v.literal("rose"),
            v.literal("green"),
            v.literal("blue"),
            v.literal("purple"),
            v.literal("gray")
        )),
        status: v.optional(v.union(
            v.literal("scheduled"),
            v.literal("confirmed"),
            v.literal("completed"),
            v.literal("cancelled"),
            v.literal("rescheduled")
        )),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { eventId, ...updates } = args;

        const existingEvent = await ctx.db.get(eventId);
        if (!existingEvent) {
            throw new Error("Event not found");
        }

        await ctx.db.patch(eventId, {
            ...updates,
            updatedAt: Date.now(),
        });

        return eventId;
    },
});

// Delete an event
export const deleteEvent = mutation({
    args: { eventId: v.id("calendarEvents") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.eventId);
        return { success: true };
    },
});

// Cancel an event (soft delete)
export const cancelEvent = mutation({
    args: { eventId: v.id("calendarEvents") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.eventId, {
            status: "cancelled",
            updatedAt: Date.now(),
        });
        return { success: true };
    },
});

// Mark event as completed
export const completeEvent = mutation({
    args: { eventId: v.id("calendarEvents") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.eventId, {
            status: "completed",
            updatedAt: Date.now(),
        });
        return { success: true };
    },
});

// Schedule a property showing
export const scheduleShowing = mutation({
    args: {
        organizationId: v.id("organizations"),
        listingId: v.optional(v.id("listings")),
        propertyId: v.optional(v.id("properties")),
        unitId: v.optional(v.id("units")),
        prospectName: v.string(),
        prospectEmail: v.string(),
        prospectPhone: v.optional(v.string()),
        startTime: v.number(),
        duration: v.number(), // in minutes
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const endTime = args.startTime + args.duration * 60 * 1000;

        // Get property and unit names for the title
        let propertyName = "Property";
        let unitName = "";

        if (args.propertyId) {
            const property = await ctx.db.get(args.propertyId);
            if (property) propertyName = property.name;
        }

        if (args.unitId) {
            const unit = await ctx.db.get(args.unitId);
            if (unit) unitName = ` - ${unit.unitNumber}`;
        }

        const eventId = await ctx.db.insert("calendarEvents", {
            organizationId: args.organizationId,
            title: `Showing: ${propertyName}${unitName}`,
            description: `Property showing with ${args.prospectName}`,
            type: "showing",
            startTime: args.startTime,
            endTime,
            allDay: false,
            color: "brand",
            propertyId: args.propertyId,
            unitId: args.unitId,
            listingId: args.listingId,
            prospectName: args.prospectName,
            prospectEmail: args.prospectEmail,
            prospectPhone: args.prospectPhone,
            notes: args.notes,
            status: "scheduled",
            createdAt: now,
            updatedAt: now,
        });

        return eventId;
    },
});
