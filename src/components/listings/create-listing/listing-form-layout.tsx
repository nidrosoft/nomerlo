"use client";

import { ReactNode } from "react";
import { ArrowLeft, Home02, Edit05, Image01, CurrencyDollar, MessageChatCircle, Check } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Progress } from "@/components/application/progress-steps/progress-steps";
import type { ProgressFeaturedIconType } from "@/components/application/progress-steps/progress-types";

interface ListingFormLayoutProps {
    children: ReactNode;
    currentStep: number;
    onBack: () => void;
    onNext: () => void;
    onCancel: () => void;
    isNextDisabled?: boolean;
    isSubmitting?: boolean;
    nextLabel?: string;
}

const getStepStatus = (stepNumber: number, currentStep: number): "complete" | "current" | "incomplete" => {
    if (stepNumber < currentStep) return "complete";
    if (stepNumber === currentStep) return "current";
    return "incomplete";
};

export function ListingFormLayout({
    children,
    currentStep,
    onBack,
    onNext,
    onCancel,
    isNextDisabled = false,
    isSubmitting = false,
    nextLabel,
}: ListingFormLayoutProps) {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === 6;

    const steps: ProgressFeaturedIconType[] = [
        {
            title: "Select Unit",
            description: "Choose property",
            status: getStepStatus(1, currentStep),
            icon: Home02,
        },
        {
            title: "Details",
            description: "Title & description",
            status: getStepStatus(2, currentStep),
            connector: false,
            icon: Edit05,
        },
        {
            title: "Photos",
            description: "Upload images",
            status: getStepStatus(3, currentStep),
            icon: Image01,
        },
        {
            title: "Pricing",
            description: "Rent & availability",
            status: getStepStatus(4, currentStep),
            icon: CurrencyDollar,
        },
        {
            title: "AI Support",
            description: "Knowledge base",
            status: getStepStatus(5, currentStep),
            icon: MessageChatCircle,
        },
        {
            title: "Review",
            description: "Publish listing",
            status: getStepStatus(6, currentStep),
            icon: Check,
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 text-sm font-medium text-tertiary hover:text-secondary transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to Listings
                </button>
            </div>

            {/* Title */}
            <div>
                <h1 className="text-2xl font-semibold text-primary">Create New Listing</h1>
                <p className="mt-1 text-sm text-tertiary">
                    Complete the steps below to publish your listing
                </p>
            </div>

            {/* Progress Steps */}
            <div className="rounded-2xl border border-secondary bg-primary p-6">
                <Progress.IconsWithText
                    type="number"
                    items={steps}
                    size="sm"
                    orientation="horizontal"
                    className="max-md:hidden"
                />
                <Progress.IconsWithText
                    type="number"
                    items={steps}
                    size="sm"
                    orientation="vertical"
                    className="md:hidden"
                />
            </div>

            {/* Content */}
            <div className="rounded-2xl border border-secondary bg-primary p-6 shadow-sm">
                {children}
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-4">
                <Button
                    color="secondary"
                    size="lg"
                    onPress={isFirstStep ? onCancel : onBack}
                    className="min-w-[120px]"
                >
                    {isFirstStep ? "Cancel" : "Back"}
                </Button>
                <Button
                    color="primary"
                    size="lg"
                    onPress={onNext}
                    isDisabled={isNextDisabled || isSubmitting}
                    className="min-w-[160px]"
                >
                    {isSubmitting ? "Publishing..." : nextLabel || (isLastStep ? "Publish Listing" : "Continue")}
                </Button>
            </div>
        </div>
    );
}
