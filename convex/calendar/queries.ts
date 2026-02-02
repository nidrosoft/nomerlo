import { v } from "convex/values";
import { query } from "../_generated/server";

// Get calendar events for a date range
export const getCalendarEvents = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
        type: v.optional(v.string()),
        propertyId: v.optional(v.id("properties")),
    },
    handler: async (ctx, args) => {
        let eventsQuery = ctx.db.query("calendarEvents");

        if (args.organizationId) {
            eventsQuery = eventsQuery.withIndex("by_org", (q) => 
                q.eq("organizationId", args.organizationId!)
            );
        }

        let events = await eventsQuery.collect();

        // Filter by date range
        if (args.startDate && args.endDate) {
            events = events.filter(
                (e) => e.startTime >= args.startDate! && e.startTime <= args.endDate!
            );
        }

        // Filter by type
        if (args.type) {
            events = events.filter((e) => e.type === args.type);
        }

        // Filter by property
        if (args.propertyId) {
            events = events.filter((e) => e.propertyId === args.propertyId);
        }

        // Get related data for each event
        const eventsWithDetails = await Promise.all(
            events.map(async (event) => {
                const property = event.propertyId
                    ? await ctx.db.get(event.propertyId)
                    : null;
                const unit = event.unitId
                    ? await ctx.db.get(event.unitId)
                    : null;
                const tenant = event.tenantId
                    ? await ctx.db.get(event.tenantId)
                    : null;

                return {
                    ...event,
                    property: property ? { name: property.name } : null,
                    unit: unit ? { unitNumber: unit.unitNumber } : null,
                    tenant: tenant
                        ? { firstName: tenant.firstName, lastName: tenant.lastName }
                        : null,
                };
            })
        );

        return eventsWithDetails.sort((a, b) => a.startTime - b.startTime);
    },
});

// Get a single event by ID
export const getEvent = query({
    args: { eventId: v.id("calendarEvents") },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.eventId);
        if (!event) return null;

        const property = event.propertyId
            ? await ctx.db.get(event.propertyId)
            : null;
        const unit = event.unitId ? await ctx.db.get(event.unitId) : null;
        const tenant = event.tenantId ? await ctx.db.get(event.tenantId) : null;

        return {
            ...event,
            property,
            unit,
            tenant,
        };
    },
});

// Get upcoming events (next 7 days)
export const getUpcomingEvents = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;
        const limit = args.limit || 10;

        let eventsQuery = ctx.db.query("calendarEvents");

        if (args.organizationId) {
            eventsQuery = eventsQuery.withIndex("by_org", (q) =>
                q.eq("organizationId", args.organizationId!)
            );
        }

        const events = await eventsQuery.collect();

        const upcomingEvents = events
            .filter(
                (e) =>
                    e.startTime >= now &&
                    e.startTime <= sevenDaysFromNow &&
                    e.status !== "cancelled"
            )
            .sort((a, b) => a.startTime - b.startTime)
            .slice(0, limit);

        return upcomingEvents;
    },
});

// Get event statistics
export const getEventStats = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        let eventsQuery = ctx.db.query("calendarEvents");

        if (args.organizationId) {
            eventsQuery = eventsQuery.withIndex("by_org", (q) =>
                q.eq("organizationId", args.organizationId!)
            );
        }

        const events = await eventsQuery.collect();
        const now = Date.now();
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthEvents = events.filter(
            (e) => e.startTime >= startOfMonth.getTime()
        );

        return {
            total: events.length,
            thisMonth: thisMonthEvents.length,
            upcoming: events.filter(
                (e) => e.startTime > now && e.status !== "cancelled"
            ).length,
            showings: events.filter((e) => e.type === "showing").length,
            maintenance: events.filter((e) => e.type === "maintenance").length,
        };
    },
});
