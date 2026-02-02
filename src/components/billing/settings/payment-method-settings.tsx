"use client";

import { Bank, CreditCard02, Wallet02, CheckCircle, Globe02 } from "@untitledui/icons";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";

interface PaymentMethodSettingsProps {
    achEnabled?: boolean;
    cardEnabled?: boolean;
    paypalEnabled?: boolean;
    checkEnabled?: boolean;
    achFeePercent?: number;
    cardFeePercent?: number;
    paypalFeePercent?: number;
    onChange?: (data: {
        achEnabled: boolean;
        cardEnabled: boolean;
        paypalEnabled: boolean;
        checkEnabled: boolean;
    }) => void;
}

export function PaymentMethodSettings({
    achEnabled = true,
    cardEnabled = true,
    paypalEnabled = false,
    checkEnabled = false,
    achFeePercent = 0,
    cardFeePercent = 2.9,
    paypalFeePercent = 2.9,
    onChange,
}: PaymentMethodSettingsProps) {
    const handleToggle = (method: string, value: boolean) => {
        const newState = {
            achEnabled: method === "ach" ? value : achEnabled,
            cardEnabled: method === "card" ? value : cardEnabled,
            paypalEnabled: method === "paypal" ? value : paypalEnabled,
            checkEnabled: method === "check" ? value : checkEnabled,
        };
        onChange?.(newState);
    };

    const methods = [
        {
            id: "ach",
            name: "ACH / Bank Transfer",
            description: "Direct bank-to-bank transfers",
            icon: Bank,
            enabled: achEnabled,
            fee: achFeePercent > 0 ? `${achFeePercent}% fee` : "No fee",
            recommended: true,
        },
        {
            id: "card",
            name: "Credit / Debit Card",
            description: "Visa, Mastercard, Amex, Discover",
            icon: CreditCard02,
            enabled: cardEnabled,
            fee: `${cardFeePercent}% + $0.30 fee`,
            recommended: false,
        },
        {
            id: "paypal",
            name: "PayPal",
            description: "Pay with PayPal balance or linked accounts",
            icon: Globe02,
            enabled: paypalEnabled,
            fee: `${paypalFeePercent}% + $0.30 fee`,
            recommended: false,
        },
        {
            id: "check",
            name: "Check / Money Order",
            description: "Manual payment recording",
            icon: Wallet02,
            enabled: checkEnabled,
            fee: "No fee",
            recommended: false,
        },
    ];

    return (
        <div className="rounded-2xl border border-secondary bg-primary">
            <div className="border-b border-secondary px-6 py-4">
                <h3 className="text-lg font-semibold text-primary">Accepted Payment Methods</h3>
                <p className="text-sm text-tertiary">Choose which payment methods tenants can use</p>
            </div>

            <div className="p-6 space-y-4">
                {methods.map((method) => {
                    const Icon = method.icon;
                    return (
                        <div
                            key={method.id}
                            className={cx(
                                "flex items-center justify-between rounded-xl border p-4 transition-colors",
                                method.enabled
                                    ? "border-brand-primary bg-brand-secondary/20"
                                    : "border-secondary bg-secondary/30"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={cx(
                                        "flex h-10 w-10 items-center justify-center rounded-lg",
                                        method.enabled ? "bg-brand-secondary" : "bg-secondary"
                                    )}
                                >
                                    <Icon
                                        className={cx(
                                            "size-5",
                                            method.enabled ? "text-brand-primary" : "text-tertiary"
                                        )}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-primary">{method.name}</p>
                                        {method.recommended && (
                                            <span className="rounded-full bg-success-secondary px-2 py-0.5 text-xs text-success-primary">
                                                Recommended
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-tertiary">{method.description}</p>
                                    <p className="text-xs text-tertiary mt-0.5">{method.fee}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {method.enabled && (
                                    <CheckCircle className="size-5 text-success-primary" />
                                )}
                                <Toggle
                                    isSelected={method.enabled}
                                    onChange={(value) => handleToggle(method.id, value)}
                                />
                            </div>
                        </div>
                    );
                })}

                <p className="text-xs text-tertiary pt-2">
                    Processing fees are passed to tenants or absorbed by you based on your preferences.
                </p>
            </div>
        </div>
    );
}
