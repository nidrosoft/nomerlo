"use client";

import { ArrowDown, ArrowUp } from "@untitledui/icons";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cx } from "@/utils/cx";

// ============================================================================
// Metric Change Indicator
// ============================================================================

interface MetricChangeIndicatorProps {
    value: string;
    trend: "positive" | "negative" | "neutral";
    type?: "simple" | "badge";
    className?: string;
}

export function MetricChangeIndicator({
    value,
    trend,
    type = "simple",
    className,
}: MetricChangeIndicatorProps) {
    const isPositive = trend === "positive";
    const isNegative = trend === "negative";

    if (type === "badge") {
        return (
            <span
                className={cx(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    isPositive && "bg-success-secondary text-success-primary",
                    isNegative && "bg-error-secondary text-error-primary",
                    !isPositive && !isNegative && "bg-secondary text-tertiary",
                    className
                )}
            >
                {isPositive && <ArrowUp className="size-3" />}
                {isNegative && <ArrowDown className="size-3" />}
                {value}
            </span>
        );
    }

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1 text-sm font-medium",
                isPositive && "text-success-primary",
                isNegative && "text-error-primary",
                !isPositive && !isNegative && "text-tertiary",
                className
            )}
        >
            {isPositive && <ArrowUp className="size-4" />}
            {isNegative && <ArrowDown className="size-4" />}
            {value}
        </span>
    );
}

// ============================================================================
// Metrics Chart Card (MetricsChart04 style)
// ============================================================================

interface MetricsChart04Props {
    title: string;
    subtitle: string;
    icon?: React.ComponentType<{ className?: string }>;
    change?: string;
    changeTrend?: "positive" | "negative" | "neutral";
    changeDescription?: string;
    chartColor?: string;
    chartCurveType?: "linear" | "monotone" | "natural";
    chartData?: Array<{ value: number }>;
    className?: string;
}

export function MetricsChart04({
    title,
    subtitle,
    icon: Icon,
    change,
    changeTrend = "neutral",
    changeDescription,
    chartColor = "text-fg-brand-secondary",
    chartCurveType = "natural",
    chartData,
    className,
}: MetricsChart04Props) {
    // Default chart data if none provided
    const defaultChartData = [
        { value: 30 },
        { value: 45 },
        { value: 35 },
        { value: 50 },
        { value: 40 },
        { value: 60 },
        { value: 55 },
        { value: 70 },
        { value: 65 },
        { value: 80 },
        { value: 75 },
        { value: 95 },
    ];

    const dataToUse = chartData || defaultChartData;

    // Convert chart data to format recharts expects
    const formattedData = dataToUse.map((item, index) => ({
        index,
        value: item.value,
    }));

    // Get color value from class name or trend
    const getStrokeColor = () => {
        if (changeTrend === "negative") return "var(--color-fg-error-primary)";
        if (chartColor.includes("error")) return "var(--color-fg-error-primary)";
        if (chartColor.includes("warning")) return "var(--color-fg-warning-primary)";
        return "var(--color-fg-brand-primary)";
    };

    const strokeColor = getStrokeColor();
    const gradientId = `gradient-${subtitle.replace(/\s/g, "")}-${Math.random().toString(36).slice(2, 9)}`;

    return (
        <div
            className={cx(
                "flex flex-col overflow-hidden rounded-2xl border border-secondary bg-primary shadow-xs",
                className
            )}
        >
            {/* Header with subtitle and icon */}
            <div className="flex items-center gap-2 border-b border-secondary px-4 py-2.5">
                {Icon && <Icon className="size-4 text-fg-quaternary" />}
                <span className="text-sm font-semibold text-primary">{subtitle}</span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-3">
                {/* Title and change indicator on same row */}
                <div className="flex items-center gap-3">
                    <span className="text-display-xs font-semibold text-primary">{title}</span>
                    {change && (
                        <div className="flex items-center gap-1.5">
                            <MetricChangeIndicator value={change} trend={changeTrend} type="simple" />
                            {changeDescription && (
                                <span className="text-sm text-tertiary">{changeDescription}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Sparkline chart - full width at bottom */}
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={formattedData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
                                    <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type={chartCurveType}
                                dataKey="value"
                                stroke={strokeColor}
                                strokeWidth={2}
                                fill={`url(#${gradientId})`}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Simple Metrics Card
// ============================================================================

interface MetricsCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeTrend?: "positive" | "negative" | "neutral";
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
}

export function MetricsCard({
    title,
    value,
    change,
    changeTrend = "neutral",
    icon: Icon,
    className,
}: MetricsCardProps) {
    return (
        <div
            className={cx(
                "flex flex-col gap-2 rounded-2xl border border-secondary bg-primary p-5 shadow-xs",
                className
            )}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-tertiary">{title}</p>
                {Icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="size-4 text-fg-quaternary" />
                    </div>
                )}
            </div>
            <p className="text-display-sm font-semibold text-primary">{value}</p>
            {change && (
                <MetricChangeIndicator value={change} trend={changeTrend} type="simple" />
            )}
        </div>
    );
}
