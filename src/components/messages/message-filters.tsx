"use client";

import { cx } from "@/utils/cx";

interface MessageFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    stats?: {
        total: number;
        unread: number;
        tenants: number;
        applicants: number;
        vendors: number;
    };
}

export function MessageFilters({ activeFilter, onFilterChange, stats }: MessageFiltersProps) {
    const filters = [
        { id: "all", label: "All", count: stats?.total },
        { id: "unread", label: "Unread", count: stats?.unread, highlight: true },
        { id: "tenants", label: "Tenants", count: stats?.tenants },
        { id: "applicants", label: "Applicants", count: stats?.applicants },
        { id: "vendors", label: "Vendors", count: stats?.vendors },
    ];

    return (
        <div className="flex gap-1 overflow-x-auto border-b border-secondary px-4 py-2">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={cx(
                        "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                        activeFilter === filter.id
                            ? "bg-brand-secondary text-brand-primary"
                            : "text-tertiary hover:bg-secondary hover:text-primary"
                    )}
                >
                    {filter.label}
                    {filter.count !== undefined && filter.count > 0 && (
                        <span
                            className={cx(
                                "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                                filter.highlight && filter.count > 0
                                    ? "bg-error-solid text-white"
                                    : "bg-tertiary/20 text-tertiary"
                            )}
                        >
                            {filter.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
