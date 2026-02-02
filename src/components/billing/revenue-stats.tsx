"use client";

// Revenue statistics display component
import { CreditCard02, Clock, CurrencyDollar, TrendUp01 } from "@untitledui/icons";
import { MetricsChart04 } from "@/components/application/metrics/metrics";

interface RevenueStatsProps {
    collected: number;
    outstanding: number;
    expected: number;
    collectionRate: number;
    paidCount: number;
    pendingCount: number;
    totalInvoices: number;
    isLoading?: boolean;
}

export function RevenueStats({
    collected,
    outstanding,
    expected,
    collectionRate,
    paidCount,
    pendingCount,
    totalInvoices,
    isLoading,
}: RevenueStatsProps) {
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

    return (
        <div className="flex flex-col gap-5 md:flex-row md:flex-wrap lg:gap-6">
            <MetricsChart04
                className="flex-1 md:min-w-[240px]"
                title={formatCurrency(collected)}
                subtitle="Collected"
                icon={CurrencyDollar}
                change={`${paidCount} paid`}
                changeTrend="positive"
                changeDescription="invoices"
                chartData={generateChartData(collected)}
            />
            <MetricsChart04
                className="flex-1 md:min-w-[240px]"
                title={formatCurrency(outstanding)}
                subtitle="Outstanding"
                icon={Clock}
                change={`${pendingCount} pending`}
                changeTrend={pendingCount > 0 ? "negative" : "positive"}
                changeDescription="invoices"
                chartData={generateChartData(outstanding || 1)}
            />
            <MetricsChart04
                className="flex-1 md:min-w-[240px]"
                title={formatCurrency(expected)}
                subtitle="Expected"
                icon={CreditCard02}
                change={`${totalInvoices}`}
                changeTrend="neutral"
                changeDescription="total invoices"
                chartData={generateChartData(expected)}
            />
            <MetricsChart04
                className="flex-1 md:min-w-[240px]"
                title={`${collectionRate}%`}
                subtitle="Collection Rate"
                icon={TrendUp01}
                change={collectionRate >= 80 ? "On track" : "Needs attention"}
                changeTrend={collectionRate >= 80 ? "positive" : "negative"}
                changeDescription=""
                chartData={generateChartData(collectionRate)}
            />
        </div>
    );
}
