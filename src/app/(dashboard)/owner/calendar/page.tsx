"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Calendar } from "@/components/calendar-new/application/calendar/calendar";
import type { CalendarEvent } from "@/components/calendar-new/application/calendar/calendar";
import { CalendarMetrics } from "@/components/calendar/calendar-metrics";

export default function CalendarPage() {
    // Get current month range for fetching events
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0).getTime();

    const events = useQuery(api.calendar.queries.getCalendarEvents, {
        startDate: startOfMonth,
        endDate: endOfMonth,
    });

    const stats = useQuery(api.calendar.queries.getEventStats, {});

    // Transform Convex events to calendar format
    const calendarEvents: CalendarEvent[] = useMemo(() => {
        if (!events) return [];

        return events.map((event) => ({
            id: event._id,
            title: event.title,
            start: new Date(event.startTime),
            end: new Date(event.endTime),
            color: getEventColor(event.type),
            dot: event.type === "showing",
        }));
    }, [events]);

    return (
        <div className="flex flex-col gap-6">
            {/* Metrics Cards */}
            <CalendarMetrics stats={stats} />

            {/* Calendar Component */}
            <Calendar events={calendarEvents} view="week" />
        </div>
    );
}

// Helper to map event types to valid calendar colors
function getEventColor(type: string): "brand" | "orange" | "pink" | "green" | "blue" | "purple" | "gray" | "indigo" | "yellow" {
    switch (type) {
        case "showing":
            return "brand";
        case "maintenance":
            return "orange";
        case "inspection":
            return "purple";
        case "moveIn":
            return "green";
        case "moveOut":
            return "pink"; // Changed from "rose" to valid "pink"
        case "lease":
            return "blue";
        case "rent":
            return "orange";
        case "reminder":
            return "gray";
        default:
            return "brand";
    }
}
