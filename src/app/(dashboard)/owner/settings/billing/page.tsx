"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import {
    CreditCard02,
    CheckCircle,
    Download01,
    Star01,
    Zap,
    Building07,
    AlertCircle,
    ArrowRight,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Table, TableCard } from "@/components/application/table/table";

// Demo payment history
const demoPayments = [
    { _id: "pay-1", description: "Growth Plan - Monthly", amount: 29, status: "succeeded", paymentDate: Date.now() - 1 * 24 * 60 * 60 * 1000, paymentMethod: "Visa ****4521" },
    { _id: "pay-2", description: "Growth Plan - Monthly", amount: 29, status: "succeeded", paymentDate: Date.now() - 31 * 24 * 60 * 60 * 1000, paymentMethod: "Visa ****4521" },
    { _id: "pay-3", description: "Growth Plan - Monthly", amount: 29, status: "succeeded", paymentDate: Date.now() - 61 * 24 * 60 * 60 * 1000, paymentMethod: "Visa ****4521" },
    { _id: "pay-4", description: "Growth Plan - Monthly", amount: 29, status: "succeeded", paymentDate: Date.now() - 91 * 24 * 60 * 60 * 1000, paymentMethod: "Visa ****4521" },
    { _id: "pay-5", description: "Upgrade to Growth Plan", amount: 14.5, status: "succeeded", paymentDate: Date.now() - 106 * 24 * 60 * 60 * 1000, paymentMethod: "Visa ****4521" },
    { _id: "pay-6", description: "Starter Plan - Free", amount: 0, status: "succeeded", paymentDate: Date.now() - 120 * 24 * 60 * 60 * 1000, paymentMethod: null },
];

// Demo subscription
const demoSubscription = {
    plan: "growth" as const,
    status: "active" as const,
    billingPeriod: "monthly" as const,
    pricePerMonth: 29,
    unitLimit: 25,
    aiInteractionsAllowed: 100,
    aiInteractionsUsed: 55,
    paymentMethodType: "Visa",
    paymentMethodLast4: "4521",
    nextBillingDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
    currentPeriodEnd: Date.now() + 15 * 24 * 60 * 60 * 1000,
    planDetails: {
        name: "Growth",
        price: 29,
        features: [
            "Up to 25 units",
            "ACH + Card payments",
            "Tenant screening",
            "E-signatures",
            "Full reports & analytics",
            "AI assistant (100 interactions/month)",
            "Phone support",
            "Listing syndication to all major sites",
        ],
    },
};

// Helper functions
const formatDate = (timestamp: number): string => 
    new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const formatCurrency = (amount: number): string => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const getStatusColor = (status: string): "success" | "warning" | "error" | "gray" => {
    const colors: Record<string, "success" | "warning" | "error" | "gray"> = {
        active: "success",
        trialing: "warning",
        succeeded: "success",
        past_due: "error",
        cancelled: "gray",
        failed: "error",
    };
    return colors[status] || "gray";
};

const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        active: "Active",
        trialing: "Trial",
        succeeded: "Paid",
        past_due: "Past Due",
        cancelled: "Cancelled",
        failed: "Failed",
    };
    return labels[status] || status;
};

export default function SubscriptionBillingPage() {
    const [showChangePlan, setShowChangePlan] = useState(false);

    // Fetch data
    const subscriptionData = useQuery(api.subscriptions.queries.getSubscription, {});
    const usageData = useQuery(api.subscriptions.queries.getUsageStats, {});
    const paymentsData = useQuery(api.subscriptions.queries.getPaymentHistory, { limit: 10 });
    const planOptionsData = useQuery(api.subscriptions.queries.getPlanOptions, {});

    // Mutations
    const changePlan = useMutation(api.subscriptions.mutations.changePlan);

    const isLoading = subscriptionData === undefined;

    // Use demo data if no real data
    const subscription = subscriptionData?.isDemo === false ? subscriptionData : demoSubscription;
    const usage = usageData || { unitsUsed: 4, unitsAllowed: 25, unitsPercentage: 16, aiInteractionsUsed: 55, aiInteractionsAllowed: 100, aiInteractionsRemaining: 45 };
    const payments = paymentsData && paymentsData.length > 0 ? paymentsData : demoPayments;
    const planOptions = planOptionsData || {};

    // Handler for plan change
    const handleChangePlan = async (newPlan: "starter" | "growth" | "professional") => {
        try {
            await changePlan({ newPlan });
            setShowChangePlan(false);
        } catch (error) {
            console.error("Failed to change plan:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-center py-20">
                    <LoadingIndicator type="line-simple" size="md" label="Loading subscription..." />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-primary">Subscription & Billing</h1>
                <p className="text-md text-tertiary">Manage your plan and payment settings</p>
            </div>

            {/* Current Plan Card */}
            <div className="rounded-2xl border border-secondary bg-primary p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-secondary">
                                <Star01 className="size-5 text-brand-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-semibold text-primary">
                                        {subscription.planDetails?.name || "Growth"} Plan
                                    </h2>
                                    <BadgeWithDot color={getStatusColor(subscription.status)} size="sm">
                                        {getStatusLabel(subscription.status)}
                                    </BadgeWithDot>
                                </div>
                                <p className="text-2xl font-bold text-primary">
                                    {formatCurrency(subscription.pricePerMonth || 29)}
                                    <span className="text-sm font-normal text-tertiary">/month</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-tertiary">Billing Period</span>
                                <span className="text-primary capitalize">{subscription.billingPeriod || "Monthly"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-tertiary">Next Billing Date</span>
                                <span className="text-primary">
                                    {subscription.nextBillingDate ? formatDate(subscription.nextBillingDate) : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-tertiary">Payment Method</span>
                                <span className="text-primary flex items-center gap-2">
                                    <CreditCard02 className="size-4 text-tertiary" />
                                    {subscription.paymentMethodType && subscription.paymentMethodLast4
                                        ? `${subscription.paymentMethodType} ****${subscription.paymentMethodLast4}`
                                        : "No payment method"}
                                </span>
                            </div>
                        </div>

                        {/* Usage Meter */}
                        <div className="mt-6 pt-6 border-t border-secondary">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-tertiary">Current Usage</span>
                                <span className="text-primary font-medium">
                                    {usage.unitsUsed} of {usage.unitsAllowed} units
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary/50">
                                <div
                                    className="h-2 rounded-full bg-brand-primary transition-all"
                                    style={{ width: `${Math.min(usage.unitsPercentage, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-tertiary mt-1">{usage.unitsPercentage}% used</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 lg:w-48">
                        <Button color="secondary" size="sm" onClick={() => setShowChangePlan(!showChangePlan)}>
                            Change Plan
                        </Button>
                        <Button color="tertiary" size="sm">
                            Update Payment Method
                        </Button>
                        <Button color="tertiary" size="sm" className="text-error-primary">
                            Cancel Subscription
                        </Button>
                    </div>
                </div>
            </div>

            {/* Plan Comparison (shown when Change Plan is clicked) */}
            {showChangePlan && (
                <div className="rounded-2xl border border-secondary bg-primary p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Choose a Plan</h3>
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Starter Plan */}
                        <div className={`rounded-xl border p-5 ${subscription.plan === "starter" ? "border-brand-primary bg-brand-secondary/10" : "border-secondary"}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Building07 className="size-5 text-tertiary" />
                                <h4 className="font-semibold text-primary">Starter</h4>
                                {subscription.plan === "starter" && (
                                    <BadgeWithDot color="brand" size="sm">Current</BadgeWithDot>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-primary mb-1">Free</p>
                            <p className="text-sm text-tertiary mb-4">Up to 3 units</p>
                            <ul className="space-y-2 text-sm text-secondary mb-4">
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> ACH payments only</li>
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> Basic maintenance</li>
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> Email support</li>
                            </ul>
                            <Button
                                color={subscription.plan === "starter" ? "tertiary" : "secondary"}
                                size="sm"
                                className="w-full"
                                isDisabled={subscription.plan === "starter"}
                                onClick={() => handleChangePlan("starter")}
                            >
                                {subscription.plan === "starter" ? "Current Plan" : "Downgrade"}
                            </Button>
                        </div>

                        {/* Growth Plan */}
                        <div className={`rounded-xl border p-5 ${subscription.plan === "growth" ? "border-brand-primary bg-brand-secondary/10" : "border-secondary"}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="size-5 text-brand-primary" />
                                <h4 className="font-semibold text-primary">Growth</h4>
                                {subscription.plan === "growth" && (
                                    <BadgeWithDot color="brand" size="sm">Current</BadgeWithDot>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-primary mb-1">$29<span className="text-sm font-normal text-tertiary">/mo</span></p>
                            <p className="text-sm text-tertiary mb-4">Up to 25 units</p>
                            <ul className="space-y-2 text-sm text-secondary mb-4">
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> ACH + Card payments</li>
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> Tenant screening</li>
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> AI assistant (100/mo)</li>
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> Phone support</li>
                            </ul>
                            <Button
                                color={subscription.plan === "growth" ? "tertiary" : "primary"}
                                size="sm"
                                className="w-full"
                                isDisabled={subscription.plan === "growth"}
                                onClick={() => handleChangePlan("growth")}
                            >
                                {subscription.plan === "growth" ? "Current Plan" : subscription.plan === "starter" ? "Upgrade" : "Downgrade"}
                            </Button>
                        </div>

                        {/* Professional Plan */}
                        <div className={`rounded-xl border p-5 ${subscription.plan === "professional" ? "border-brand-primary bg-brand-secondary/10" : "border-secondary"}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Star01 className="size-5 text-warning-primary" />
                                <h4 className="font-semibold text-primary">Professional</h4>
                                {subscription.plan === "professional" && (
                                    <BadgeWithDot color="brand" size="sm">Current</BadgeWithDot>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-primary mb-1">$79<span className="text-sm font-normal text-tertiary">/mo</span></p>
                            <p className="text-sm text-tertiary mb-4">Up to 100 units</p>
                            <ul className="space-y-2 text-sm text-secondary mb-4">
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> All payment methods</li>
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> Unlimited AI assistant</li>
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> Custom branding</li>
                                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-success-primary" /> Priority support</li>
                            </ul>
                            <Button
                                color={subscription.plan === "professional" ? "tertiary" : "primary"}
                                size="sm"
                                className="w-full"
                                isDisabled={subscription.plan === "professional"}
                                onClick={() => handleChangePlan("professional")}
                            >
                                {subscription.plan === "professional" ? "Current Plan" : "Upgrade"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Plan Features */}
            <div className="rounded-2xl border border-secondary bg-primary p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Plan Features</h3>
                <div className="grid gap-3 lg:grid-cols-2">
                    {subscription.planDetails?.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="size-4 text-success-primary flex-shrink-0" />
                            <span className="text-secondary">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* AI Usage */}
                {usage.aiInteractionsAllowed > 0 && (
                    <div className="mt-6 pt-6 border-t border-secondary">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-tertiary">AI Assistant Usage</span>
                            <span className="text-primary font-medium">
                                {usage.aiInteractionsRemaining ?? 0} remaining this month
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary/50">
                            <div
                                className="h-2 rounded-full bg-brand-primary transition-all"
                                style={{ width: `${Math.min(100 - ((usage.aiInteractionsRemaining ?? 0) / (usage.aiInteractionsAllowed || 1)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Upgrade CTA */}
                {subscription.plan !== "professional" && (
                    <div className="mt-6 p-4 rounded-xl bg-brand-secondary/20 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-primary">Need more features?</p>
                            <p className="text-xs text-tertiary">Upgrade to Professional for unlimited AI and more</p>
                        </div>
                        <Button color="primary" size="sm" iconTrailing={ArrowRight} onClick={() => setShowChangePlan(true)}>
                            Upgrade
                        </Button>
                    </div>
                )}
            </div>

            {/* Billing History */}
            <TableCard.Root className="bg-secondary_subtle shadow-xs rounded-2xl">
                <div className="flex items-center justify-between px-5 pt-3 pb-2.5">
                    <p className="text-sm font-semibold text-primary">Billing History</p>
                    <Button color="tertiary" size="sm" iconLeading={Download01}>
                        Download All
                    </Button>
                </div>

                <Table aria-label="Billing History" className="bg-primary">
                    <Table.Header className="bg-primary">
                        <Table.Head id="date" label="Date" />
                        <Table.Head id="description" label="Description" isRowHeader className="w-full" />
                        <Table.Head id="amount" label="Amount" />
                        <Table.Head id="status" label="Status" />
                        <Table.Head id="method" label="Payment Method" className="max-md:hidden" />
                        <Table.Head id="invoice" label="" />
                    </Table.Header>

                    <Table.Body items={payments as any[]}>
                        {(payment) => (
                            <Table.Row id={payment._id}>
                                <Table.Cell>
                                    <span className="text-sm text-secondary">{formatDate(payment.paymentDate)}</span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm font-medium text-primary">{payment.description}</span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm font-medium text-primary">{formatCurrency(payment.amount)}</span>
                                </Table.Cell>
                                <Table.Cell>
                                    <BadgeWithDot color={getStatusColor(payment.status)} size="sm">
                                        {getStatusLabel(payment.status)}
                                    </BadgeWithDot>
                                </Table.Cell>
                                <Table.Cell className="max-md:hidden">
                                    <span className="text-sm text-secondary">{payment.paymentMethod || "—"}</span>
                                </Table.Cell>
                                <Table.Cell>
                                    <Button color="tertiary" size="sm" iconLeading={Download01}>
                                        PDF
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </TableCard.Root>
        </div>
    );
}
