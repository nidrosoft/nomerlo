"use client";

import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { cx } from "@/utils/cx";

interface ChartTooltipContentProps extends TooltipProps<ValueType, NameType> {
    className?: string;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    active?: boolean;
    label?: string | number;
    payload?: Array<{
        value?: ValueType;
        name?: NameType;
        color?: string;
        dataKey?: string;
        payload?: Record<string, unknown>;
        [key: string]: unknown;
    }>;
}

export function ChartTooltipContent({
    active,
    payload,
    label,
    className,
    hideLabel = false,
    hideIndicator = false,
    indicator = "dot",
    labelFormatter,
    formatter,
}: ChartTooltipContentProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const formattedLabel = labelFormatter ? labelFormatter(label, payload) : label;

    return (
        <div
            className={cx(
                "rounded-lg border border-secondary bg-primary px-3 py-2 shadow-lg",
                className
            )}
        >
            {!hideLabel && formattedLabel && (
                <p className="mb-1.5 text-xs font-medium text-tertiary">{formattedLabel}</p>
            )}
            <div className="flex flex-col gap-1">
                {payload.map((entry, index) => {
                    const value = formatter
                        ? formatter(entry.value, entry.name, entry, index, payload)
                        : entry.value;

                    return (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                            {!hideIndicator && (
                                <div
                                    className={cx(
                                        "shrink-0",
                                        indicator === "dot" && "h-2 w-2 rounded-full",
                                        indicator === "line" && "h-0.5 w-3 rounded-full",
                                        indicator === "dashed" && "h-0.5 w-3 rounded-full border-dashed"
                                    )}
                                    style={{ backgroundColor: entry.color }}
                                />
                            )}
                            <span className="text-sm font-semibold text-primary">
                                {Array.isArray(value) ? value[0] : value}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Simple line chart wrapper for consistent styling
export function ChartContainer({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cx("h-full w-full", className)}>
            {children}
        </div>
    );
}
