"use client";

import { ReactNode } from "react";
import { ArrowLeft, User01, Home01, Briefcase01, Users01, Phone01, Check } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Progress } from "@/components/application/progress-steps/progress-steps";
import type { ProgressFeaturedIconType } from "@/components/application/progress-steps/progress-types";

interface ApplyFormLayoutProps {
    listingTitle: string;
    propertyName: string;
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
    onCancel: () => void;
    isNextDisabled?: boolean;
    isSubmitting?: boolean;
    children: ReactNode;
}

const getStepStatus = (stepNumber: number, currentStep: number): "complete" | "current" | "incomplete" => {
    if (stepNumber < currentStep) return "complete";
    if (stepNumber === currentStep) return "current";
    return "incomplete";
};

export function ApplyFormLayout({
    listingTitle,
    propertyName,
    currentStep,
    totalSteps,
    onBack,
    onNext,
    onCancel,
    isNextDisabled = false,
    isSubmitting = false,
    children,
}: ApplyFormLayoutProps) {
    const isLastStep = currentStep === totalSteps;
    const isFirstStep = currentStep === 1;

    const steps: ProgressFeaturedIconType[] = [
        { 
            title: "Personal Info", 
            description: "Contact details", 
            status: getStepStatus(1, currentStep), 
            icon: User01 
        },
        { 
            title: "Current Residence", 
            description: "Where you live now", 
            status: getStepStatus(2, currentStep), 
            icon: Home01 
        },
        { 
            title: "Employment", 
            description: "Income & job", 
            status: getStepStatus(3, currentStep), 
            icon: Briefcase01 
        },
        { 
            title: "Additional Info", 
            description: "Occupants & pets", 
            status: getStepStatus(4, currentStep), 
            icon: Users01 
        },
        { 
            title: "Emergency", 
            description: "Emergency contact", 
            status: getStepStatus(5, currentStep), 
            icon: Phone01 
        },
        { 
            title: "Review", 
            description: "Submit application", 
            status: getStepStatus(6, currentStep), 
            icon: Check 
        },
    ];

    return (
        <div className="min-h-screen bg-secondary/30 pb-24">
            {/* Main Content Container */}
            <div className="mx-auto max-w-4xl px-4 py-6">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onCancel}
                            className="flex items-center gap-2 text-sm font-medium text-tertiary hover:text-secondary transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Listing
                        </button>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-semibold text-primary">Apply for {listingTitle}</h1>
                        <p className="mt-1 text-sm text-tertiary">
                            {propertyName} • Complete the steps below to submit your application
                        </p>
                    </div>

                    {/* Progress Steps - Same style as Add Property */}
                    <div className="rounded-2xl border border-secondary bg-primary p-6">
                        <Progress.IconsWithText 
                            type="number" 
                            items={steps} 
                            size="sm" 
                            orientation="horizontal" 
                            className="max-lg:hidden" 
                        />
                        <Progress.IconsWithText 
                            type="number" 
                            items={steps} 
                            size="sm" 
                            orientation="vertical" 
                            className="lg:hidden" 
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
                            isDisabled={isSubmitting}
                            className="min-w-[120px]"
                        >
                            {isFirstStep ? "Cancel" : "Back"}
                        </Button>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-tertiary">
                                Step {currentStep} of {totalSteps}
                            </span>
                            <Button
                                color="primary"
                                size="lg"
                                onPress={onNext}
                                isDisabled={isNextDisabled || isSubmitting}
                                className="min-w-[160px]"
                            >
                                {isSubmitting ? "Submitting..." : isLastStep ? "Submit Application" : "Continue"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
