"use client";

import { AlertCircle } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { Toggle } from "@/components/base/toggle/toggle";

export interface LateFeeData {
    enabled: boolean;
    feeType: "fixed" | "percentage";
    feeAmount: number;
    gracePeriodDays: number;
    autoApply: boolean;
}

interface LateFeeSettingsProps extends Partial<LateFeeData> {
    onChange?: (data: LateFeeData) => void;
}

const feeTypeOptions = [
    { id: "fixed", label: "Fixed Amount ($)" },
    { id: "percentage", label: "Percentage of Rent (%)" },
];

const gracePeriodOptions = [
    { id: "0", label: "No grace period" },
    { id: "3", label: "3 days" },
    { id: "5", label: "5 days" },
    { id: "7", label: "7 days" },
    { id: "10", label: "10 days" },
    { id: "15", label: "15 days" },
];

export function LateFeeSettings({
    enabled = true,
    feeType = "fixed",
    feeAmount = 50,
    gracePeriodDays = 5,
    autoApply = true,
    onChange,
}: LateFeeSettingsProps) {
    const handleChange = (updates: Partial<LateFeeData>) => {
        onChange?.({
            enabled,
            feeType,
            feeAmount,
            gracePeriodDays,
            autoApply,
            ...updates,
        });
    };

    return (
        <div className="rounded-2xl border border-secondary bg-primary">
            <div className="flex items-center justify-between border-b border-secondary px-6 py-4">
                <div>
                    <h3 className="text-lg font-semibold text-primary">Late Fees</h3>
                    <p className="text-sm text-tertiary">Configure automatic late fee charges</p>
                </div>
                <Toggle isSelected={enabled} onChange={(v) => handleChange({ enabled: v })} />
            </div>

            {enabled && (
                <div className="p-6 space-y-6">
                    {/* Fee Type & Amount */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Fee Type</label>
                            <Select
                                selectedKey={feeType}
                                onSelectionChange={(key) => handleChange({ feeType: key as "fixed" | "percentage" })}
                                items={feeTypeOptions}
                            >
                                {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">
                                {feeType === "fixed" ? "Fee Amount ($)" : "Fee Percentage (%)"}
                            </label>
                            <Input
                                type="number"
                                value={feeAmount.toString()}
                                onChange={(v) => handleChange({ feeAmount: parseFloat(v) || 0 })}
                                placeholder={feeType === "fixed" ? "50" : "5"}
                                size="sm"
                            />
                        </div>
                    </div>

                    {/* Grace Period */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Grace Period</label>
                        <Select
                            selectedKey={gracePeriodDays.toString()}
                            onSelectionChange={(key) => handleChange({ gracePeriodDays: parseInt(key as string) })}
                            items={gracePeriodOptions}
                        >
                            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                        </Select>
                        <p className="text-xs text-tertiary">
                            Number of days after the due date before a late fee is applied.
                        </p>
                    </div>

                    {/* Auto Apply Toggle */}
                    <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-4">
                        <div>
                            <p className="text-sm font-medium text-primary">Auto-apply Late Fees</p>
                            <p className="text-xs text-tertiary">
                                Automatically add late fees to overdue invoices
                            </p>
                        </div>
                        <Toggle isSelected={autoApply} onChange={(v) => handleChange({ autoApply: v })} />
                    </div>

                    {/* Preview */}
                    <div className="flex items-start gap-3 rounded-xl border border-warning-secondary bg-warning-secondary/30 p-4">
                        <AlertCircle className="size-5 text-warning-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-primary">Late Fee Preview</p>
                            <p className="text-sm text-tertiary">
                                {feeType === "fixed"
                                    ? `A $${feeAmount || 0} late fee will be applied ${gracePeriodDays === 0 ? "immediately" : `after ${gracePeriodDays} days`} past the due date.`
                                    : `A ${feeAmount || 0}% late fee will be applied ${gracePeriodDays === 0 ? "immediately" : `after ${gracePeriodDays} days`} past the due date.`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
