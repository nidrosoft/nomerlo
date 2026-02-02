"use client";

import { CheckCircle, CreditCard02, Bank } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface PaymentData {
    _id: string;
    tenant: { firstName: string; lastName: string } | null;
    amount: number;
    paymentMethod: string;
    paidAt?: number;
    createdAt: number;
}

interface PaymentActivityProps {
    payments: PaymentData[];
    className?: string;
}

const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    }) + ", " + date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
};

const getPaymentMethodLabel = (method: string): string => {
    const labels: Record<string, string> = {
        ach: "ACH",
        card: "Card",
        check: "Check",
        cash: "Cash",
        manual: "Manual",
    };
    return labels[method] || method;
};

const getPaymentMethodIcon = (method: string) => {
    if (method === "ach" || method === "bank") return Bank;
    return CreditCard02;
};

export function PaymentActivity({ payments, className }: PaymentActivityProps) {
    if (payments.length === 0) {
        return (
            <div className={cx("rounded-2xl border border-secondary bg-primary p-6", className)}>
                <p className="text-center text-sm text-tertiary">No recent payments</p>
            </div>
        );
    }

    return (
        <div className={cx("rounded-2xl border border-secondary bg-primary", className)}>
            <div className="border-b border-secondary px-5 py-4">
                <h3 className="text-sm font-semibold text-primary">Recent Payments</h3>
            </div>
            <div className="divide-y divide-secondary">
                {payments.map((payment) => {
                    const Icon = getPaymentMethodIcon(payment.paymentMethod);
                    return (
                        <div
                            key={payment._id}
                            className="flex items-center gap-4 px-5 py-3.5"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-secondary">
                                <CheckCircle className="size-4 text-success-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-primary">
                                    <span className="font-medium">
                                        {payment.tenant
                                            ? `${payment.tenant.firstName} ${payment.tenant.lastName}`
                                            : "Unknown"}
                                    </span>{" "}
                                    paid{" "}
                                    <span className="font-semibold text-success-primary">
                                        {formatCurrency(payment.amount)}
                                    </span>
                                </p>
                                <p className="text-xs text-tertiary">
                                    {formatTime(payment.paidAt || payment.createdAt)}
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-tertiary">
                                <Icon className="size-3.5" />
                                {getPaymentMethodLabel(payment.paymentMethod)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
