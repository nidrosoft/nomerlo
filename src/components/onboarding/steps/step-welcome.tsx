"use client";

import { Sparkles, Building2, CreditCard, Users, FileText } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { OnboardingCard, OnboardingHeader } from "../onboarding-layout";

interface StepWelcomeProps {
    userName: string;
    onContinue: () => void;
    onSkip?: () => void;
}

const WHAT_WE_WILL_DO = [
    { icon: Building2, text: "Tell us about your portfolio" },
    { icon: Building2, text: "Add your first property" },
    { icon: Building2, text: "Set up your units" },
    { icon: CreditCard, text: "Choose your plan" },
];

const AFTER_SETUP = [
    "Create listings and syndicate to Zillow, Trulia, etc.",
    "Start collecting applications",
    "Set up rent collection",
    "Invite existing tenants",
];

export function StepWelcome({ userName, onContinue, onSkip }: StepWelcomeProps) {
    return (
        <OnboardingCard>
            <OnboardingHeader
                icon={<Sparkles className="h-6 w-6" />}
                title={`Welcome to Nomerlo, ${userName}!`}
                description="Let's get your rental business set up. This will only take about 5 minutes."
            />

            <div className="space-y-6">
                {/* What we'll do */}
                <div className="rounded-lg bg-secondary p-4 sm:p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-tertiary">
                        Here's what we'll do:
                    </h3>
                    <ul className="space-y-3">
                        {WHAT_WE_WILL_DO.map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary text-brand-solid">
                                    <item.icon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-secondary">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* After setup */}
                <div className="rounded-lg border border-secondary p-4 sm:p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-tertiary">
                        After setup, you can:
                    </h3>
                    <ul className="space-y-2">
                        {AFTER_SETUP.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-solid" />
                                <span className="text-secondary">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4">
                    <Button color="primary" size="xl" onClick={onContinue} className="w-full">
                        Let's Get Started
                    </Button>
                    {onSkip && (
                        <Button color="link-gray" size="lg" onClick={onSkip} className="mx-auto">
                            Skip for now - I'll set up later
                        </Button>
                    )}
                </div>
            </div>
        </OnboardingCard>
    );
}
