"use client";

import { cx } from "@/utils/cx";

interface CategoryData {
    category: string;
    amount: number;
    percentage: number;
}

interface CategoryBreakdownProps {
    categories: CategoryData[];
    isLoading?: boolean;
}

const categoryColors: Record<string, string> = {
    maintenance: "bg-brand-primary",
    utilities: "bg-blue-500",
    insurance: "bg-purple-500",
    taxes: "bg-amber-500",
    landscaping: "bg-green-500",
    cleaning: "bg-cyan-500",
    legal: "bg-rose-500",
    advertising: "bg-orange-500",
    office: "bg-gray-500",
    other: "bg-slate-400",
};

const categoryLabels: Record<string, string> = {
    maintenance: "Maintenance",
    utilities: "Utilities",
    insurance: "Insurance",
    taxes: "Property Taxes",
    landscaping: "Landscaping",
    cleaning: "Cleaning",
    legal: "Legal & Professional",
    advertising: "Advertising",
    office: "Office/Admin",
    other: "Other",
};

export function CategoryBreakdown({ categories, isLoading }: CategoryBreakdownProps) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-secondary bg-primary p-6">
                <div className="h-5 w-40 rounded bg-secondary mb-4 animate-pulse" />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                            <div className="flex justify-between">
                                <div className="h-4 w-24 rounded bg-secondary" />
                                <div className="h-4 w-16 rounded bg-secondary" />
                            </div>
                            <div className="h-2 w-full rounded bg-secondary" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-secondary bg-primary p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Expenses by Category</h3>
            <div className="space-y-4">
                {categories.map((cat) => {
                    const colorClass = categoryColors[cat.category.toLowerCase()] || "bg-slate-400";
                    const label = categoryLabels[cat.category.toLowerCase()] || cat.category;

                    return (
                        <div key={cat.category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">{label}</span>
                                <span className="font-medium text-primary">
                                    {formatCurrency(cat.amount)} ({cat.percentage}%)
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary/30">
                                <div
                                    className={cx("h-2 rounded-full transition-all", colorClass)}
                                    style={{ width: `${cat.percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}

                {categories.length === 0 && (
                    <p className="text-sm text-tertiary text-center py-4">No expenses recorded this month</p>
                )}
            </div>
        </div>
    );
}
