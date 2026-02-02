"use client";

import { Briefcase, DollarSign, Clock, Phone } from "lucide-react";

interface EmploymentSectionProps {
    employment: {
        status: "employed" | "self_employed" | "unemployed" | "retired" | "student";
        employer?: string;
        position?: string;
        income: number;
        startDate?: number;
        supervisorName?: string;
        supervisorPhone?: string;
    };
    rentAmount: number;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
};

const getEmploymentYears = (startDate?: number): string => {
    if (!startDate) return "N/A";
    const years = Math.floor((Date.now() - startDate) / (365 * 24 * 60 * 60 * 1000));
    if (years < 1) {
        const months = Math.floor((Date.now() - startDate) / (30 * 24 * 60 * 60 * 1000));
        return `${months} month${months !== 1 ? "s" : ""}`;
    }
    return `${years} year${years !== 1 ? "s" : ""}`;
};

const formatEmploymentStatus = (status: string): string => {
    const statuses: Record<string, string> = {
        employed: "Employed",
        self_employed: "Self-Employed",
        unemployed: "Unemployed",
        retired: "Retired",
        student: "Student",
    };
    return statuses[status] || status;
};

export function EmploymentSection({ employment, rentAmount }: EmploymentSectionProps) {
    const incomeToRent = rentAmount > 0 ? (employment.income / rentAmount).toFixed(2) : "N/A";
    const meetsRequirement = typeof incomeToRent === "string" ? false : parseFloat(incomeToRent) >= 3;

    return (
        <div className="rounded-2xl border border-secondary bg-primary p-6">
            <h3 className="mb-4 text-lg font-semibold text-primary">Employment & Income</h3>

            <div className="space-y-4">
                {/* Employment Status */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <Briefcase className="size-5 text-tertiary" />
                    </div>
                    <div>
                        <p className="text-sm text-tertiary">Employment Status</p>
                        <p className="font-medium text-primary">{formatEmploymentStatus(employment.status)}</p>
                    </div>
                </div>

                {/* Employer & Position */}
                {employment.employer && (
                    <div className="rounded-xl bg-secondary/50 p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-tertiary">Employer</p>
                                <p className="font-medium text-primary">{employment.employer}</p>
                            </div>
                            {employment.position && (
                                <div>
                                    <p className="text-sm text-tertiary">Position</p>
                                    <p className="font-medium text-primary">{employment.position}</p>
                                </div>
                            )}
                            {employment.startDate && (
                                <div>
                                    <p className="text-sm text-tertiary">Employment Length</p>
                                    <p className="font-medium text-primary">{getEmploymentYears(employment.startDate)}</p>
                                </div>
                            )}
                            {employment.supervisorName && (
                                <div>
                                    <p className="text-sm text-tertiary">Supervisor</p>
                                    <p className="font-medium text-primary">
                                        {employment.supervisorName}
                                        {employment.supervisorPhone && (
                                            <span className="ml-1 text-tertiary">· {employment.supervisorPhone}</span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Income */}
                <div className="rounded-xl border border-secondary p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-secondary">
                                <DollarSign className="size-5 text-success-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-tertiary">Monthly Income</p>
                                <p className="text-xl font-semibold text-primary">{formatCurrency(employment.income)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Income-to-Rent Ratio */}
                    <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-tertiary">Income-to-Rent Ratio</span>
                            <span className={`text-lg font-semibold ${meetsRequirement ? "text-success-primary" : "text-warning-primary"}`}>
                                {incomeToRent}x {meetsRequirement ? "✓" : ""}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-tertiary">
                            {meetsRequirement 
                                ? "Meets the 3x monthly rent requirement" 
                                : "Does not meet the 3x monthly rent requirement"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
