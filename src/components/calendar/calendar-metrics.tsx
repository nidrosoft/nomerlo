"use client";

import { Calendar, Clock, CheckCircle, AlertCircle } from "@untitledui/icons";

interface CalendarMetricsProps {
    stats?: {
        total: number;
        thisMonth: number;
        upcoming: number;
        showings: number;
        maintenance: number;
    } | null;
}

export function CalendarMetrics({ stats }: CalendarMetricsProps) {
    const metrics = [
        {
            title: "Upcoming Events",
            value: stats?.upcoming ?? 0,
            icon: Calendar,
            color: "text-brand-primary",
            bgColor: "bg-brand-secondary",
        },
        {
            title: "This Month",
            value: stats?.thisMonth ?? 0,
            icon: Clock,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Showings",
            value: stats?.showings ?? 0,
            icon: CheckCircle,
            color: "text-success-primary",
            bgColor: "bg-success-secondary",
        },
        {
            title: "Maintenance",
            value: stats?.maintenance ?? 0,
            icon: AlertCircle,
            color: "text-warning-primary",
            bgColor: "bg-warning-secondary",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <div
                    key={metric.title}
                    className="flex items-center gap-4 rounded-xl border border-secondary bg-primary p-5 shadow-xs"
                >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${metric.bgColor}`}>
                        <metric.icon className={`size-6 ${metric.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-tertiary">{metric.title}</p>
                        <p className="text-2xl font-semibold text-primary">{metric.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
