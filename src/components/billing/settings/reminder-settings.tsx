"use client";

import { Bell01, Mail01 } from "@untitledui/icons";
import { Toggle } from "@/components/base/toggle/toggle";
import { Checkbox } from "@/components/base/checkbox/checkbox";

export interface ReminderData {
    enabled: boolean;
    beforeDueDays: number[];
    afterDueDays: number[];
    emailEnabled: boolean;
    smsEnabled: boolean;
}

interface ReminderSettingsProps extends Partial<ReminderData> {
    onChange?: (data: ReminderData) => void;
}

export function ReminderSettings({
    enabled = true,
    beforeDueDays = [3, 1],
    afterDueDays = [1, 3, 7],
    emailEnabled = true,
    smsEnabled = false,
    onChange,
}: ReminderSettingsProps) {
    const handleChange = (updates: Partial<ReminderData>) => {
        onChange?.({
            enabled,
            beforeDueDays,
            afterDueDays,
            emailEnabled,
            smsEnabled,
            ...updates,
        });
    };

    const toggleBeforeDay = (day: number) => {
        const newDays = beforeDueDays.includes(day)
            ? beforeDueDays.filter((d) => d !== day)
            : [...beforeDueDays, day].sort((a, b) => b - a);
        handleChange({ beforeDueDays: newDays });
    };

    const toggleAfterDay = (day: number) => {
        const newDays = afterDueDays.includes(day)
            ? afterDueDays.filter((d) => d !== day)
            : [...afterDueDays, day].sort((a, b) => a - b);
        handleChange({ afterDueDays: newDays });
    };

    return (
        <div className="rounded-2xl border border-secondary bg-primary">
            <div className="flex items-center justify-between border-b border-secondary px-6 py-4">
                <div>
                    <h3 className="text-lg font-semibold text-primary">Payment Reminders</h3>
                    <p className="text-sm text-tertiary">Automated reminders to tenants about payments</p>
                </div>
                <Toggle isSelected={enabled} onChange={(v) => handleChange({ enabled: v })} />
            </div>

            {enabled && (
                <div className="p-6 space-y-6">
                    {/* Before Due Date */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Bell01 className="size-4 text-brand-primary" />
                            <p className="text-sm font-medium text-primary">Before Due Date</p>
                        </div>
                        <div className="ml-6 space-y-2">
                            <Checkbox isSelected={beforeDueDays.includes(3)} onChange={() => toggleBeforeDay(3)}>
                                <span className="text-sm text-secondary">3 days before</span>
                            </Checkbox>
                            <Checkbox isSelected={beforeDueDays.includes(1)} onChange={() => toggleBeforeDay(1)}>
                                <span className="text-sm text-secondary">1 day before</span>
                            </Checkbox>
                        </div>
                    </div>

                    {/* After Due Date */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Bell01 className="size-4 text-error-primary" />
                            <p className="text-sm font-medium text-primary">After Due Date (Overdue)</p>
                        </div>
                        <div className="ml-6 space-y-2">
                            <Checkbox isSelected={afterDueDays.includes(1)} onChange={() => toggleAfterDay(1)}>
                                <span className="text-sm text-secondary">1 day after</span>
                            </Checkbox>
                            <Checkbox isSelected={afterDueDays.includes(3)} onChange={() => toggleAfterDay(3)}>
                                <span className="text-sm text-secondary">3 days after</span>
                            </Checkbox>
                            <Checkbox isSelected={afterDueDays.includes(7)} onChange={() => toggleAfterDay(7)}>
                                <span className="text-sm text-secondary">7 days after</span>
                            </Checkbox>
                        </div>
                    </div>

                    {/* Notification Channels */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-primary">Notification Channels</p>
                        <div className="flex flex-col gap-3 md:flex-row md:gap-6">
                            <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <Mail01 className="size-5 text-tertiary" />
                                    <div>
                                        <p className="text-sm font-medium text-primary">Email</p>
                                        <p className="text-xs text-tertiary">Send reminders via email</p>
                                    </div>
                                </div>
                                <Toggle isSelected={emailEnabled} onChange={(v) => handleChange({ emailEnabled: v })} />
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <Bell01 className="size-5 text-tertiary" />
                                    <div>
                                        <p className="text-sm font-medium text-primary">SMS</p>
                                        <p className="text-xs text-tertiary">Send text reminders</p>
                                    </div>
                                </div>
                                <Toggle isSelected={smsEnabled} onChange={(v) => handleChange({ smsEnabled: v })} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
