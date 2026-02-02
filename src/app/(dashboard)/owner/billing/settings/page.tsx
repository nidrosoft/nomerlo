"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { ArrowLeft, Save03, CheckCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import {
    PayoutSettings,
    LateFeeSettings,
    ReminderSettings,
    PaymentMethodSettings,
} from "@/components/billing/settings";
import type { LateFeeData } from "@/components/billing/settings/late-fee-settings";
import type { ReminderData } from "@/components/billing/settings/reminder-settings";

// Default settings
const defaultSettings = {
    payoutSchedule: "daily" as const,
    achEnabled: true,
    cardEnabled: true,
    paypalEnabled: false,
    checkEnabled: false,
    lateFeeEnabled: true,
    lateFeeType: "fixed" as const,
    lateFeeAmount: 50,
    gracePeriodDays: 5,
    autoApplyLateFee: true,
    remindersEnabled: true,
    beforeDueDays: [3, 1],
    afterDueDays: [1, 3, 7],
    emailRemindersEnabled: true,
    smsRemindersEnabled: false,
};

export default function BillingSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [settings, setSettings] = useState(defaultSettings);

    // Fetch settings from database
    const dbSettings = useQuery(api.billingSettings.queries.getBillingSettings, {});
    const saveBillingSettings = useMutation(api.billingSettings.mutations.saveBillingSettings);

    const isLoading = dbSettings === undefined;

    // Load settings from database when available
    useEffect(() => {
        if (dbSettings) {
            setSettings({
                payoutSchedule: dbSettings.payoutSchedule || "daily",
                achEnabled: dbSettings.achEnabled ?? true,
                cardEnabled: dbSettings.cardEnabled ?? true,
                paypalEnabled: dbSettings.paypalEnabled ?? false,
                checkEnabled: dbSettings.checkEnabled ?? false,
                lateFeeEnabled: dbSettings.lateFeeEnabled ?? true,
                lateFeeType: dbSettings.lateFeeType || "fixed",
                lateFeeAmount: dbSettings.lateFeeAmount ?? 50,
                gracePeriodDays: dbSettings.gracePeriodDays ?? 5,
                autoApplyLateFee: dbSettings.autoApplyLateFee ?? true,
                remindersEnabled: dbSettings.remindersEnabled ?? true,
                beforeDueDays: dbSettings.beforeDueDays || [3, 1],
                afterDueDays: dbSettings.afterDueDays || [1, 3, 7],
                emailRemindersEnabled: dbSettings.emailRemindersEnabled ?? true,
                smsRemindersEnabled: dbSettings.smsRemindersEnabled ?? false,
            });
        }
    }, [dbSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveBillingSettings({
                payoutSchedule: settings.payoutSchedule,
                achEnabled: settings.achEnabled,
                cardEnabled: settings.cardEnabled,
                paypalEnabled: settings.paypalEnabled,
                checkEnabled: settings.checkEnabled,
                lateFeeEnabled: settings.lateFeeEnabled,
                lateFeeType: settings.lateFeeType,
                lateFeeAmount: settings.lateFeeAmount,
                gracePeriodDays: settings.gracePeriodDays,
                autoApplyLateFee: settings.autoApplyLateFee,
                remindersEnabled: settings.remindersEnabled,
                beforeDueDays: settings.beforeDueDays,
                afterDueDays: settings.afterDueDays,
                emailRemindersEnabled: settings.emailRemindersEnabled,
                smsRemindersEnabled: settings.smsRemindersEnabled,
            });
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Update handlers
    const handlePayoutChange = (data: { payoutSchedule: string }) => {
        setSettings((s) => ({ ...s, payoutSchedule: data.payoutSchedule as typeof s.payoutSchedule }));
    };

    const handlePaymentMethodChange = (data: { achEnabled: boolean; cardEnabled: boolean; paypalEnabled: boolean; checkEnabled: boolean }) => {
        setSettings((s) => ({ ...s, ...data }));
    };

    const handleLateFeeChange = (data: LateFeeData) => {
        setSettings((s) => ({
            ...s,
            lateFeeEnabled: data.enabled,
            lateFeeType: data.feeType,
            lateFeeAmount: data.feeAmount,
            gracePeriodDays: data.gracePeriodDays,
            autoApplyLateFee: data.autoApply,
        }));
    };

    const handleReminderChange = (data: ReminderData) => {
        setSettings((s) => ({
            ...s,
            remindersEnabled: data.enabled,
            beforeDueDays: data.beforeDueDays,
            afterDueDays: data.afterDueDays,
            emailRemindersEnabled: data.emailEnabled,
            smsRemindersEnabled: data.smsEnabled,
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingIndicator type="line-simple" size="md" label="Loading settings..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/owner/billing">
                        <Button color="tertiary" size="sm" iconLeading={ArrowLeft}>Back</Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-primary">Billing Settings</h1>
                        <p className="text-md text-tertiary">Configure payment methods, late fees, and payout preferences</p>
                    </div>
                </div>
                <Button color="primary" size="md" iconLeading={showSaved ? CheckCircle : Save03} onClick={handleSave} isDisabled={isSaving}>
                    {isSaving ? "Saving..." : showSaved ? "Saved!" : "Save Changes"}
                </Button>
            </div>

            {/* Settings Sections */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                    <PayoutSettings
                        bankName="Chase Bank"
                        accountLast4="4521"
                        routingNumber="****6789"
                        accountType="checking"
                        isVerified={true}
                        payoutSchedule={settings.payoutSchedule}
                        onChange={handlePayoutChange}
                    />
                    <PaymentMethodSettings
                        achEnabled={settings.achEnabled}
                        cardEnabled={settings.cardEnabled}
                        paypalEnabled={settings.paypalEnabled}
                        checkEnabled={settings.checkEnabled}
                        achFeePercent={0}
                        cardFeePercent={2.9}
                        paypalFeePercent={2.9}
                        onChange={handlePaymentMethodChange}
                    />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <LateFeeSettings
                        enabled={settings.lateFeeEnabled}
                        feeType={settings.lateFeeType}
                        feeAmount={settings.lateFeeAmount}
                        gracePeriodDays={settings.gracePeriodDays}
                        autoApply={settings.autoApplyLateFee}
                        onChange={handleLateFeeChange}
                    />
                    <ReminderSettings
                        enabled={settings.remindersEnabled}
                        beforeDueDays={settings.beforeDueDays}
                        afterDueDays={settings.afterDueDays}
                        emailEnabled={settings.emailRemindersEnabled}
                        smsEnabled={settings.smsRemindersEnabled}
                        onChange={handleReminderChange}
                    />
                </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="border-t border-secondary bg-primary px-6 py-4 mt-8">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-tertiary">Changes will apply to all new invoices and reminders.</p>
                    <div className="flex gap-3">
                        <Link href="/owner/billing">
                            <Button color="secondary" size="md">Cancel</Button>
                        </Link>
                        <Button color="primary" size="md" iconLeading={showSaved ? CheckCircle : Save03} onClick={handleSave} isDisabled={isSaving}>
                            {isSaving ? "Saving..." : showSaved ? "Saved!" : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
