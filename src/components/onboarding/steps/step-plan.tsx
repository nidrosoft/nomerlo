"use client";

import { useState } from "react";
import { CreditCard, Check, Star, Zap, Building, Headphones } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { OnboardingCard, OnboardingHeader } from "../onboarding-layout";
import { cx } from "@/utils/cx";

interface StepPlanProps {
    unitCount: number;
    onContinue: (data: { plan: string }) => void;
    onBack: () => void;
}

const PLANS = [
    {
        id: "starter",
        name: "Starter",
        price: "Free",
        period: "forever",
        range: "1-3 units",
        description: "Perfect for getting started",
        features: [
            "Rent collection (ACH only)",
            "Basic listings",
            "Maintenance tracking",
            "Tenant portal",
            "Email support",
        ],
        cta: "Get Started Free",
        recommended: false,
    },
    {
        id: "growth",
        name: "Growth",
        price: "$29",
        period: "/month",
        range: "4-25 units",
        description: "For growing landlords",
        features: [
            "Everything in Starter",
            "All payment methods",
            "Tenant screening (5/mo)",
            "E-signature leases",
            "AI assistant (100/mo)",
            "Listing syndication",
            "Phone support",
        ],
        cta: "Start Free Trial",
        recommended: true,
    },
    {
        id: "professional",
        name: "Professional",
        price: "$79",
        period: "/month",
        range: "26-100 units",
        description: "For serious landlords",
        features: [
            "Everything in Growth",
            "Unlimited screening",
            "Advanced reports",
            "API access",
            "Priority support",
            "QuickBooks sync",
            "Custom branding",
        ],
        cta: "Start Free Trial",
        recommended: false,
    },
];

function getRecommendedPlan(unitCount: number): string {
    if (unitCount <= 3) return "starter";
    if (unitCount <= 25) return "growth";
    return "professional";
}

export function StepPlan({ unitCount, onContinue, onBack }: StepPlanProps) {
    const recommendedPlanId = getRecommendedPlan(unitCount);
    const [selectedPlan, setSelectedPlan] = useState(recommendedPlanId);

    const handleContinue = () => {
        onContinue({ plan: selectedPlan });
    };

    return (
        <OnboardingCard className="max-w-4xl">
            <OnboardingHeader
                icon={<CreditCard className="h-6 w-6" />}
                title="Choose Your Plan"
                description={`Based on your portfolio (${unitCount} units), we recommend a plan that fits.`}
            />

            <div className="space-y-6">
                {/* Plan cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    {PLANS.map((plan) => {
                        const isSelected = selectedPlan === plan.id;
                        const isRecommended = plan.id === recommendedPlanId;

                        return (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                className={cx(
                                    "relative cursor-pointer rounded-2xl border-2 p-5 transition-all",
                                    isSelected
                                        ? "border-brand-solid bg-brand-secondary ring-2 ring-brand-solid/20"
                                        : "border-secondary bg-primary hover:border-tertiary"
                                )}
                            >
                                {/* Recommended badge */}
                                {isRecommended && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-solid px-3 py-1 text-xs font-semibold text-white">
                                            <Star className="h-3 w-3" />
                                            Recommended
                                        </span>
                                    </div>
                                )}

                                {/* Plan header */}
                                <div className="mb-4 text-center">
                                    <h3 className="text-lg font-semibold text-primary">{plan.name}</h3>
                                    <div className="mt-2 flex items-baseline justify-center gap-1">
                                        <span className="text-3xl font-bold text-primary">{plan.price}</span>
                                        {plan.period !== "forever" && (
                                            <span className="text-tertiary">{plan.period}</span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-tertiary">{plan.range}</p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-solid" />
                                            <span className="text-secondary">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Selection indicator */}
                                <div
                                    className={cx(
                                        "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                                        isSelected
                                            ? "border-brand-solid bg-brand-solid text-white"
                                            : "border-tertiary bg-primary"
                                    )}
                                >
                                    {isSelected && <Check className="h-3 w-3" />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trial info */}
                <div className="rounded-lg bg-secondary p-4 text-center">
                    <p className="text-sm text-secondary">
                        <strong>14-day free trial</strong> on Growth and Professional plans. 
                        No credit card required to start.
                    </p>
                </div>

                {/* Enterprise callout */}
                <div className="flex items-center justify-between rounded-lg border border-secondary p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                            <Headphones className="h-5 w-5 text-tertiary" />
                        </div>
                        <div>
                            <p className="font-semibold text-primary">Need 100+ units?</p>
                            <p className="text-sm text-tertiary">Contact us for Enterprise pricing</p>
                        </div>
                    </div>
                    <Button color="secondary" size="md">
                        Contact Sales
                    </Button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4 pt-4">
                    <Button color="secondary" size="lg" onClick={onBack}>
                        Back
                    </Button>
                    <Button color="primary" size="lg" onClick={handleContinue}>
                        {selectedPlan === "starter" ? "Get Started Free" : "Start Free Trial"}
                    </Button>
                </div>
            </div>
        </OnboardingCard>
    );
}
