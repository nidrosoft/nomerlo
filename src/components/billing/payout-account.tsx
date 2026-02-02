"use client";

import { Bank, CheckCircle, Edit01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

interface PayoutAccountProps {
    bankName?: string;
    accountLast4?: string;
    isVerified?: boolean;
    nextPayoutAmount?: number;
    nextPayoutDate?: number;
    payoutSchedule?: string;
    className?: string;
    onChangeAccount?: () => void;
    onViewHistory?: () => void;
}

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

export function PayoutAccount({
    bankName = "Chase Bank",
    accountLast4 = "4521",
    isVerified = true,
    nextPayoutAmount = 0,
    nextPayoutDate,
    payoutSchedule = "Daily (next business day)",
    className,
    onChangeAccount,
    onViewHistory,
}: PayoutAccountProps) {
    return (
        <div className={cx("rounded-2xl border border-secondary bg-primary", className)}>
            <div className="border-b border-secondary px-5 py-4">
                <h3 className="text-sm font-semibold text-primary">Payout Account</h3>
            </div>
            <div className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-secondary">
                        <Bank className="size-6 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-primary">
                                {bankName} ****{accountLast4}
                            </p>
                            {isVerified && (
                                <span className="inline-flex items-center gap-1 text-xs text-success-primary">
                                    <CheckCircle className="size-3.5" />
                                    Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-tertiary">Checking Account</p>
                    </div>
                </div>

                <div className="rounded-xl bg-secondary/50 p-4 space-y-2">
                    {nextPayoutAmount > 0 && nextPayoutDate && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-tertiary">Next Payout</span>
                            <span className="text-sm font-medium text-primary">
                                {formatCurrency(nextPayoutAmount)} on {formatDate(nextPayoutDate)}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-tertiary">Payout Schedule</span>
                        <span className="text-sm text-primary">{payoutSchedule}</span>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        color="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={onChangeAccount}
                    >
                        Change Account
                    </Button>
                    <Button
                        color="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={onViewHistory}
                    >
                        View History
                    </Button>
                </div>
            </div>
        </div>
    );
}
