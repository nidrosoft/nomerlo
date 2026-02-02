"use client";

import { PartyPopper, Check, FileText, Users, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { OnboardingCard, OnboardingHeader } from "../onboarding-layout";

interface PropertySummary {
    name: string;
    address: string;
    units: Array<{
        name: string;
        bedrooms: string;
        bathrooms: string;
        rent: string;
    }>;
}

interface StepCompleteProps {
    property: PropertySummary;
    plan: string;
    onGoToDashboard: () => void;
    onCreateListing?: () => void;
    onInviteTenants?: () => void;
    onSetupPayments?: () => void;
}

const NEXT_STEPS = [
    {
        id: "listing",
        icon: FileText,
        title: "Create a Listing",
        description: "List your vacant units",
        action: "Create",
    },
    {
        id: "tenants",
        icon: Users,
        title: "Invite Tenants",
        description: "Add existing tenants to the platform",
        action: "Invite",
    },
    {
        id: "payments",
        icon: CreditCard,
        title: "Set Up Payments",
        description: "Connect your bank account for payouts",
        action: "Connect",
    },
];

const PLAN_LABELS: Record<string, string> = {
    starter: "Starter (Free)",
    growth: "Growth (14-day free trial)",
    professional: "Professional (14-day free trial)",
};

export function StepComplete({
    property,
    plan,
    onGoToDashboard,
    onCreateListing,
    onInviteTenants,
    onSetupPayments,
}: StepCompleteProps) {
    const handleNextStep = (stepId: string) => {
        switch (stepId) {
            case "listing":
                onCreateListing?.();
                break;
            case "tenants":
                onInviteTenants?.();
                break;
            case "payments":
                onSetupPayments?.();
                break;
        }
    };

    return (
        <OnboardingCard>
            <OnboardingHeader
                icon={<PartyPopper className="h-6 w-6" />}
                title="You're All Set!"
                description="Your account is ready. Here's what we set up:"
            />

            <div className="space-y-6">
                {/* Setup summary */}
                <div className="rounded-lg border border-secondary p-4 sm:p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-secondary text-brand-solid">
                            <Check className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary">{property.name}</h3>
                            <p className="text-sm text-tertiary">{property.address}</p>
                        </div>
                    </div>

                    {/* Units grid */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {property.units.map((unit) => (
                            <div
                                key={unit.name}
                                className="rounded-lg bg-secondary p-3 text-center"
                            >
                                <p className="font-semibold text-primary">{unit.name}</p>
                                <p className="text-xs text-tertiary">
                                    {unit.bedrooms}bd/{unit.bathrooms}ba
                                </p>
                                <p className="text-sm font-medium text-brand-solid">${unit.rent}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Plan info */}
                <div className="flex items-center gap-3 rounded-lg bg-brand-secondary p-4">
                    <CreditCard className="h-5 w-5 flex-shrink-0 text-brand-solid" />
                    <p className="text-sm text-brand-solid">
                        <strong>Plan:</strong> {PLAN_LABELS[plan] || plan}
                    </p>
                </div>

                {/* What's next */}
                <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-tertiary">
                        What's Next?
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {NEXT_STEPS.map((step) => (
                            <button
                                key={step.id}
                                onClick={() => handleNextStep(step.id)}
                                className="group flex flex-col items-center rounded-2xl border border-secondary p-4 text-center transition-all hover:border-brand-solid hover:bg-brand-secondary"
                            >
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-tertiary transition-colors group-hover:bg-brand-solid group-hover:text-white">
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <h4 className="font-semibold text-primary">{step.title}</h4>
                                <p className="mt-1 text-xs text-tertiary">{step.description}</p>
                                <span className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-solid">
                                    {step.action}
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Go to Dashboard */}
                <div className="pt-4">
                    <Button color="primary" size="xl" onClick={onGoToDashboard} className="w-full">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </OnboardingCard>
    );
}
