"use client";

import { useState } from "react";
import { Building, Lightbulb } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { OnboardingCard, OnboardingHeader, SelectionCard } from "../onboarding-layout";

interface StepPortfolioProps {
    onContinue: (data: { propertyCount: string; unitCount: string }) => void;
    onBack: () => void;
    initialData?: { propertyCount: string; unitCount: string };
}

const PROPERTY_OPTIONS = [
    { value: "1", label: "1", description: "Property" },
    { value: "2-5", label: "2-5", description: "Properties" },
    { value: "6-20", label: "6-20", description: "Properties", badge: "Popular" },
    { value: "20+", label: "20+", description: "Properties" },
];

const UNIT_OPTIONS = [
    { value: "1-3", label: "1-3", description: "Units", plan: "Starter (Free)" },
    { value: "4-25", label: "4-25", description: "Units", plan: "Growth" },
    { value: "26-100", label: "26-100", description: "Units", plan: "Professional" },
    { value: "100+", label: "100+", description: "Units", plan: "Enterprise" },
];

const PLAN_RECOMMENDATIONS: Record<string, string> = {
    "1-3": "Starter plan (FREE)",
    "4-25": "Growth plan ($29/month)",
    "26-100": "Professional plan ($79/month)",
    "100+": "Enterprise plan (Contact Sales)",
};

export function StepPortfolio({ onContinue, onBack, initialData }: StepPortfolioProps) {
    const [propertyCount, setPropertyCount] = useState(initialData?.propertyCount || "");
    const [unitCount, setUnitCount] = useState(initialData?.unitCount || "");

    const canContinue = propertyCount && unitCount;

    const handleContinue = () => {
        if (canContinue) {
            onContinue({ propertyCount, unitCount });
        }
    };

    return (
        <OnboardingCard>
            <OnboardingHeader
                icon={<Building className="h-6 w-6" />}
                title="Tell Us About Your Portfolio"
                description="This helps us recommend the right plan for you."
            />

            <div className="space-y-8">
                {/* Property count */}
                <div>
                    <label className="mb-4 block text-sm font-medium text-primary">
                        How many properties do you manage?
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {PROPERTY_OPTIONS.map((option) => (
                            <SelectionCard
                                key={option.value}
                                selected={propertyCount === option.value}
                                onClick={() => setPropertyCount(option.value)}
                                title={option.label}
                                description={option.description}
                                badge={option.badge}
                            />
                        ))}
                    </div>
                </div>

                {/* Unit count */}
                <div>
                    <label className="mb-4 block text-sm font-medium text-primary">
                        How many total units (including all properties)?
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {UNIT_OPTIONS.map((option) => (
                            <SelectionCard
                                key={option.value}
                                selected={unitCount === option.value}
                                onClick={() => setUnitCount(option.value)}
                                title={option.label}
                                description={option.description}
                            />
                        ))}
                    </div>
                </div>

                {/* Plan recommendation */}
                {unitCount && (
                    <div className="flex items-start gap-3 rounded-lg bg-brand-secondary p-4">
                        <Lightbulb className="h-5 w-5 flex-shrink-0 text-brand-solid" />
                        <p className="text-sm text-brand-solid">
                            Based on your selection, we recommend the{" "}
                            <strong>{PLAN_RECOMMENDATIONS[unitCount]}</strong>
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-4 pt-4">
                    <Button color="secondary" size="lg" onClick={onBack}>
                        Back
                    </Button>
                    <Button
                        color="primary"
                        size="lg"
                        onClick={handleContinue}
                        disabled={!canContinue}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </OnboardingCard>
    );
}
