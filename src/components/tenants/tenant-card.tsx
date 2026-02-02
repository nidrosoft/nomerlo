"use client";

import Link from "next/link";
import { Building07, Mail01, Phone } from "@untitledui/icons";
import { Calendar, CreditCard } from "lucide-react";
import { BadgeWithDot } from "@/components/base/badges/badges";

export interface TenantData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: "applicant" | "current" | "past" | "evicted";
    propertyName: string;
    unitName: string;
    leaseStart?: number;
    leaseEnd?: number;
    monthlyRent: number;
    currentBalance: number;
    lastPaymentDate?: number;
    lastPaymentAmount?: number;
    moveOutDate?: number;
    portalStatus: "invited" | "active" | "disabled";
}

interface TenantCardProps {
    tenant: TenantData;
}

const getStatusConfig = (status: string, moveOutDate?: number): { color: "success" | "warning" | "gray" | "error"; label: string } => {
    // Check if moving out (within 60 days)
    if (status === "current" && moveOutDate) {
        const daysUntil = (moveOutDate - Date.now()) / (1000 * 60 * 60 * 24);
        if (daysUntil > 0 && daysUntil <= 60) {
            return { color: "warning", label: "Moving Out" };
        }
    }

    const config: Record<string, { color: "success" | "warning" | "gray" | "error"; label: string }> = {
        current: { color: "success", label: "Active" },
        applicant: { color: "warning", label: "Applicant" },
        past: { color: "gray", label: "Past" },
        evicted: { color: "error", label: "Evicted" },
    };
    return config[status] || { color: "gray", label: status };
};

const getPaymentStatusConfig = (balance: number): { color: "success" | "warning" | "error"; label: string } => {
    if (balance <= 0) return { color: "success", label: "Current" };
    if (balance > 0 && balance < 500) return { color: "warning", label: "Pending" };
    return { color: "error", label: "Late" };
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

const getDaysRemaining = (endDate: number): string => {
    const days = Math.ceil((endDate - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Ends today";
    if (days === 1) return "1 day remaining";
    return `${days} days remaining`;
};

export function TenantCard({ tenant }: TenantCardProps) {
    const statusConfig = getStatusConfig(tenant.status, tenant.moveOutDate);
    const paymentConfig = getPaymentStatusConfig(tenant.currentBalance);

    return (
        <Link
            href={`/owner/tenants/${tenant.id}`}
            className="group rounded-2xl border border-secondary bg-primary p-5 transition-shadow hover:shadow-lg"
        >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-brand-primary font-semibold">
                        {getInitials(tenant.firstName, tenant.lastName)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary">
                            {tenant.firstName} {tenant.lastName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-tertiary">
                            <Mail01 className="size-3.5" />
                            <span className="truncate max-w-[160px]">{tenant.email}</span>
                        </div>
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
                    <span className="font-medium text-primary">{tenant.unitName}</span>
                    <span className="text-tertiary">·</span>
                    <span className="text-tertiary truncate">{tenant.propertyName}</span>
                </div>
                {tenant.leaseStart && tenant.leaseEnd && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-tertiary">
                        <Calendar className="size-4" />
                        <span>
                            {formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}
                        </span>
                    </div>
                )}
                {tenant.leaseEnd && (
                    <p className="mt-1 text-xs text-secondary">{getDaysRemaining(tenant.leaseEnd)}</p>
                )}
            </div>

            {/* Payment Status */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-tertiary">Payment Status</span>
                    <span className={`font-medium flex items-center gap-1.5 ${
                        paymentConfig.color === "success" ? "text-success-primary" :
                        paymentConfig.color === "warning" ? "text-warning-primary" :
                        "text-error-primary"
                    }`}>
                        {paymentConfig.color === "success" ? "✓" : paymentConfig.color === "warning" ? "⚠" : "✗"}
                        {paymentConfig.label}
                    </span>
                </div>

                {tenant.lastPaymentDate && tenant.lastPaymentAmount && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-tertiary">Last Payment</span>
                        <span className="text-secondary">
                            {formatDate(tenant.lastPaymentDate)} ({formatCurrency(tenant.lastPaymentAmount)})
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <span className="text-tertiary">Monthly Rent</span>
                    <span className="font-medium text-primary">{formatCurrency(tenant.monthlyRent)}</span>
                </div>

                {tenant.currentBalance !== 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-tertiary">Balance</span>
                        <span className={`font-medium ${tenant.currentBalance > 0 ? "text-error-primary" : "text-success-primary"}`}>
                            {tenant.currentBalance > 0 ? formatCurrency(tenant.currentBalance) : `${formatCurrency(Math.abs(tenant.currentBalance))} credit`}
                        </span>
                    </div>
                )}
            </div>

            {/* Portal Status - Always show for consistency */}
            <div className="mt-4 border-t border-secondary pt-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-tertiary">Portal Status</span>
                    <span className={`font-medium ${
                        tenant.portalStatus === "active" ? "text-success-primary" :
                        tenant.portalStatus === "invited" ? "text-warning-primary" : 
                        "text-error-primary"
                    }`}>
                        {tenant.portalStatus === "active" ? "✓ Active" : 
                         tenant.portalStatus === "invited" ? "Invite Pending" : 
                         "Disabled"}
                    </span>
                </div>
            </div>
        </Link>
    );
}
