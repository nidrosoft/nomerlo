"use client";

import Link from "next/link";
import { Building07 } from "@untitledui/icons";
import { DollarSign, Calendar } from "lucide-react";
import { BadgeWithDot } from "@/components/base/badges/badges";

export interface ApplicationData {
    id: string;
    applicant: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    status: "submitted" | "under_review" | "screening" | "approved" | "conditionally_approved" | "denied" | "withdrawn" | "expired";
    propertyName: string;
    unitName: string;
    rentAmount: number;
    desiredMoveIn: number;
    income: number;
    creditScore?: number;
    backgroundCheckPassed?: boolean;
    submittedAt: number;
    screeningStatus: "pending" | "in_progress" | "completed" | "failed";
}

interface ApplicationCardProps {
    application: ApplicationData;
    viewMode: "grid" | "list";
}

const getStatusConfig = (status: string): { color: "error" | "warning" | "success" | "gray" | "blue"; label: string } => {
    const config: Record<string, { color: "error" | "warning" | "success" | "gray" | "blue"; label: string }> = {
        submitted: { color: "error", label: "New" },
        under_review: { color: "warning", label: "In Review" },
        screening: { color: "blue", label: "Screening" },
        approved: { color: "success", label: "Approved" },
        conditionally_approved: { color: "warning", label: "Conditional" },
        denied: { color: "error", label: "Denied" },
        withdrawn: { color: "gray", label: "Withdrawn" },
        expired: { color: "gray", label: "Expired" },
    };
    return config[status] || { color: "gray", label: status };
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export function ApplicationCard({ application, viewMode }: ApplicationCardProps) {
    const statusConfig = getStatusConfig(application.status);
    const incomeToRent = application.rentAmount > 0 ? (application.income / application.rentAmount).toFixed(1) : "N/A";

    if (viewMode === "list") {
        return (
            <Link
                href={`/owner/applications/${application.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-secondary bg-primary p-4 transition-shadow hover:shadow-md"
            >
                {/* Avatar */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-secondary text-brand-primary font-semibold">
                    {getInitials(application.applicant.firstName, application.applicant.lastName)}
                </div>

                {/* Main Info */}
                <div className="flex flex-1 items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-primary">
                                {application.applicant.firstName} {application.applicant.lastName}
                            </h3>
                            <BadgeWithDot
                                color={statusConfig.color}
                                type="pill-color"
                                size="sm"
                            >
                                {statusConfig.label}
                            </BadgeWithDot>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-tertiary">
                            {application.unitName} · {application.propertyName}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-secondary">
                            <span className="flex items-center gap-1">
                                <DollarSign className="size-4" />
                                {formatCurrency(application.income)}/mo
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                {formatDate(application.desiredMoveIn)}
                            </span>
                            {application.creditScore && (
                                <span>Credit: {application.creditScore}</span>
                            )}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="text-right text-sm text-tertiary">
                        {formatDate(application.submittedAt)}
                    </div>
                </div>
            </Link>
        );
    }

    // Grid view
    return (
        <Link
            href={`/owner/applications/${application.id}`}
            className="group rounded-2xl border border-secondary bg-primary p-4 transition-shadow hover:shadow-lg"
        >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-brand-primary font-semibold">
                        {getInitials(application.applicant.firstName, application.applicant.lastName)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary">
                            {application.applicant.firstName} {application.applicant.lastName}
                        </h3>
                        <p className="text-sm text-tertiary">{formatDate(application.submittedAt)}</p>
                    </div>
                </div>
                <BadgeWithDot
                    color={statusConfig.color}
                    type="pill-color"
                    size="sm"
                >
                    {statusConfig.label}
                </BadgeWithDot>
            </div>

            {/* Property Info */}
            <div className="mb-4 rounded-xl bg-secondary/50 p-3">
                <div className="flex items-center gap-2 text-sm">
                    <Building07 className="size-4 text-tertiary" />
                    <span className="font-medium text-primary">{application.unitName}</span>
                </div>
                <p className="mt-1 text-sm text-tertiary">{application.propertyName}</p>
                <p className="mt-1 text-sm font-medium text-primary">{formatCurrency(application.rentAmount)}/mo</p>
            </div>

            {/* Stats */}
            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-tertiary">Income</span>
                    <span className="font-medium text-primary">{formatCurrency(application.income)}/mo</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-tertiary">Income-to-Rent</span>
                    <span className={`font-medium ${parseFloat(incomeToRent) >= 3 ? "text-success-primary" : "text-warning-primary"}`}>
                        {incomeToRent}x
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-tertiary">Move-in</span>
                    <span className="font-medium text-primary">{formatDate(application.desiredMoveIn)}</span>
                </div>
                {application.creditScore && (
                    <div className="flex items-center justify-between">
                        <span className="text-tertiary">Credit Score</span>
                        <span className={`font-medium ${application.creditScore >= 700 ? "text-success-primary" : application.creditScore >= 650 ? "text-warning-primary" : "text-error-primary"}`}>
                            {application.creditScore}
                        </span>
                    </div>
                )}
            </div>

            {/* Screening Status */}
            {application.screeningStatus !== "pending" && (
                <div className="mt-4 border-t border-secondary pt-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-tertiary">Screening:</span>
                        <span className={`font-medium ${
                            application.screeningStatus === "completed" 
                                ? "text-success-primary" 
                                : application.screeningStatus === "in_progress"
                                ? "text-warning-primary"
                                : "text-error-primary"
                        }`}>
                            {application.screeningStatus === "completed" ? "Complete" : 
                             application.screeningStatus === "in_progress" ? "In Progress" : "Failed"}
                        </span>
                    </div>
                </div>
            )}
        </Link>
    );
}
