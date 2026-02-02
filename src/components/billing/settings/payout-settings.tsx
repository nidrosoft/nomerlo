"use client";

import { useState } from "react";
import { Bank, CheckCircle, Edit01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";

interface PayoutSettingsProps {
    bankName?: string;
    accountLast4?: string;
    routingNumber?: string;
    accountType?: string;
    isVerified?: boolean;
    payoutSchedule?: string;
    onChange?: (data: { payoutSchedule: string }) => void;
    onUpdateBank?: (data: {
        accountHolderName: string;
        accountType: string;
        routingNumber: string;
        accountNumber: string;
    }) => void;
}

const scheduleOptions = [
    { id: "daily", label: "Daily (next business day)" },
    { id: "weekly", label: "Weekly (every Friday)" },
    { id: "monthly", label: "Monthly (1st of month)" },
];

const accountTypeOptions = [
    { id: "checking", label: "Checking" },
    { id: "savings", label: "Savings" },
];

export function PayoutSettings({
    bankName = "Chase Bank",
    accountLast4 = "4521",
    routingNumber = "****6789",
    accountType = "checking",
    isVerified = true,
    payoutSchedule = "daily",
    onChange,
    onUpdateBank,
}: PayoutSettingsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        accountHolderName: "",
        accountType: accountType,
        routingNumber: "",
        accountNumber: "",
    });

    const handleSaveBank = () => {
        onUpdateBank?.(formData);
        setIsEditing(false);
        setFormData({ accountHolderName: "", accountType: "checking", routingNumber: "", accountNumber: "" });
    };

    return (
        <div className="rounded-2xl border border-secondary bg-primary">
            <div className="border-b border-secondary px-6 py-4">
                <h3 className="text-lg font-semibold text-primary">Payout Account</h3>
                <p className="text-sm text-tertiary">Where your rental income is deposited</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Current Bank Account */}
                <div className="flex items-start gap-4 rounded-xl bg-secondary/30 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-secondary">
                        <Bank className="size-6 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-primary">{bankName}</p>
                            {isVerified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-success-secondary px-2 py-0.5 text-xs text-success-primary">
                                    <CheckCircle className="size-3" />
                                    Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-tertiary">
                            {accountType === "checking" ? "Checking" : "Savings"} ****{accountLast4}
                        </p>
                        <p className="text-sm text-tertiary">Routing: {routingNumber}</p>
                    </div>
                    <Button
                        color="secondary"
                        size="sm"
                        iconLeading={Edit01}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Cancel" : "Change"}
                    </Button>
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <div className="space-y-4 rounded-xl border border-secondary p-4">
                        <p className="text-sm font-medium text-primary">Update Bank Account</p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="Account Holder Name"
                                placeholder="John Doe"
                                size="sm"
                                value={formData.accountHolderName}
                                onChange={(v) => setFormData({ ...formData, accountHolderName: v })}
                            />
                            <Select
                                label="Account Type"
                                selectedKey={formData.accountType}
                                onSelectionChange={(key) => setFormData({ ...formData, accountType: key as string })}
                                items={accountTypeOptions}
                            >
                                {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                            </Select>
                            <Input
                                label="Routing Number"
                                placeholder="123456789"
                                size="sm"
                                value={formData.routingNumber}
                                onChange={(v) => setFormData({ ...formData, routingNumber: v })}
                            />
                            <Input
                                label="Account Number"
                                placeholder="Enter account number"
                                size="sm"
                                value={formData.accountNumber}
                                onChange={(v) => setFormData({ ...formData, accountNumber: v })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button color="secondary" size="sm" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button color="primary" size="sm" onClick={handleSaveBank}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}

                {/* Payout Schedule */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-primary">Payout Schedule</label>
                    <Select
                        selectedKey={payoutSchedule}
                        onSelectionChange={(key) => onChange?.({ payoutSchedule: key as string })}
                        items={scheduleOptions}
                    >
                        {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                    </Select>
                    <p className="text-xs text-tertiary">
                        Funds are transferred to your bank account according to this schedule.
                    </p>
                </div>
            </div>
        </div>
    );
}
