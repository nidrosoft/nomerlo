"use client";

import { CurrencyDollar, Calendar, TrendUp01, TrendDown01 } from "@untitledui/icons";
import { MetricsChart04 } from "@/components/application/metrics/metrics";

interface ExpenseStatsProps {
    totalThisMonth: number;
    totalLastMonth: number;
    totalYTD: number;
    changePercent: number;
    maintenanceTotal?: number;
    utilitiesTotal?: number;
    isLoading?: boolean;
}

export function ExpenseStats({
    totalThisMonth,
    totalLastMonth,
    totalYTD,
    changePercent,
    maintenanceTotal = 0,
    utilitiesTotal = 0,
    isLoading,
}: ExpenseStatsProps) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

    // Generate simple chart data
    const generateChartData = (value: number) => {
        const data = [];
        for (let i = 0; i < 8; i++) {
            const variance = 1 + (Math.random() - 0.5) * 0.3;
            data.push({ value: Math.round(value * variance * (0.7 + i * 0.05)) });
        }
        return data;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-5 md:flex-row md:flex-wrap lg:gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="flex-1 animate-pulse rounded-2xl border border-secondary bg-primary p-5 md:min-w-[240px]"
                    >
                        <div className="h-4 w-24 rounded bg-secondary mb-3" />
                        <div className="h-8 w-32 rounded bg-secondary mb-2" />
                        <div className="h-3 w-20 rounded bg-secondary" />
                    </div>
                ))}
            </div>
        );
    }

    // For expenses, increase is typically negative (spending more)
    const trendIsGood = changePercent <= 0;

    return (
        <div className="flex flex-col gap-5 md:flex-row md:flex-wrap lg:gap-6">
            <MetricsChart04
                className="flex-1 md:min-w-[240px]"
                title={formatCurrency(totalThisMonth)}
                subtitle="This Month"
                icon={CurrencyDollar}
                change={`${changePercent >= 0 ? "+" : ""}${changePercent}%`}
                changeTrend={trendIsGood ? "positive" : "negative"}
                changeDescription="vs last month"
                chartData={generateChartData(totalThisMonth)}
            />
            <MetricsChart04
                className="flex-1 md:min-w-[240px]"
                title={formatCurrency(totalYTD)}
                subtitle="Year to Date"
                icon={Calendar}
                change="All properties"
                changeTrend="neutral"
                changeDescription=""
                chartData={generateChartData(totalYTD)}
            />
            <MetricsChart04
                className="flex-1 md:min-w-[240px]"
                title={formatCurrency(maintenanceTotal)}
                subtitle="Maintenance"
                icon={TrendUp01}
                change="This month"
                changeTrend="neutral"
                changeDescription=""
                chartData={generateChartData(maintenanceTotal || 1)}
            />
            <MetricsChart04
                className="flex-1 md:min-w-[240px]"
                title={formatCurrency(utilitiesTotal)}
                subtitle="Utilities"
                icon={TrendDown01}
                change="This month"
                changeTrend="neutral"
                changeDescription=""
                chartData={generateChartData(utilitiesTotal || 1)}
            />
        </div>
    );
}
