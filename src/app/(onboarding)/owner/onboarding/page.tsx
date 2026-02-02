"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
    OnboardingLayout,
    StepWelcome,
    StepPortfolio,
    StepPlan,
    StepComplete,
} from "@/components/onboarding";
import { StepPropertyFixed } from "@/components/onboarding/steps/step-property-fixed";
import { StepUnitsFixed } from "@/components/onboarding/steps/step-units-fixed";

// Types for onboarding data
interface OnboardingData {
    portfolio: {
        propertyCount: string;
        unitCount: string;
    };
    property: {
        address: string;
        propertyType: string;
        propertyName: string;
        unitCount: string;
    };
    units: {
        allSame: boolean;
        bedrooms: string;
        bathrooms: string;
        sqft: string;
        rent: string;
        deposit: string;
        namingStyle: string;
    };
    plan: {
        plan: string;
    };
}

const TOTAL_STEPS = 6;

export default function OwnerOnboardingPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [currentStep, setCurrentStep] = useState(1);
    const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});

    // Get user's first name for welcome message
    const userName = user?.firstName || "there";

    // Step titles for progress bar
    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return "Welcome";
            case 2:
                return "Tell Us About Your Portfolio";
            case 3:
                return "Add Your First Property";
            case 4:
                return "Set Up Your Units";
            case 5:
                return "Choose Your Plan";
            case 6:
                return "Setup Complete";
            default:
                return "";
        }
    };

    // Navigation handlers
    const handleNext = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Step data handlers
    const handlePortfolioComplete = (data: OnboardingData["portfolio"]) => {
        setOnboardingData((prev) => ({ ...prev, portfolio: data }));
        handleNext();
    };

    const handlePropertyComplete = (data: OnboardingData["property"]) => {
        setOnboardingData((prev) => ({ ...prev, property: data }));
        handleNext();
    };

    const handleUnitsComplete = (data: OnboardingData["units"]) => {
        setOnboardingData((prev) => ({ ...prev, units: data }));
        handleNext();
    };

    const handlePlanComplete = (data: OnboardingData["plan"]) => {
        setOnboardingData((prev) => ({ ...prev, plan: data }));
        // Here you would typically save all data to Convex
        handleNext();
    };

    const handleGoToDashboard = () => {
        router.push("/owner");
    };

    const handleSkipOnboarding = () => {
        router.push("/owner");
    };

    // Calculate unit count for units step
    const getUnitCountNumber = (): number => {
        const unitStr = onboardingData.property?.unitCount || "1";
        if (unitStr.includes("-")) {
            return parseInt(unitStr.split("-")[0]);
        }
        if (unitStr.includes("+")) {
            return parseInt(unitStr.replace("+", ""));
        }
        return parseInt(unitStr) || 1;
    };

    // Generate mock units for completion screen
    const generateUnits = () => {
        const count = getUnitCountNumber();
        const namingStyle = onboardingData.units?.namingStyle || "letters";
        const units = [];

        for (let i = 0; i < Math.min(count, 4); i++) {
            let name = "";
            switch (namingStyle) {
                case "letters":
                    name = `Unit ${String.fromCharCode(65 + i)}`;
                    break;
                case "numbers":
                    name = `Unit ${i + 1}`;
                    break;
                case "floor":
                    name = `Unit ${Math.floor(i / 2) + 1}${i % 2 === 0 ? "A" : "B"}`;
                    break;
                default:
                    name = `Unit ${i + 1}`;
            }

            units.push({
                name,
                bedrooms: onboardingData.units?.bedrooms || "2",
                bathrooms: onboardingData.units?.bathrooms || "1",
                rent: onboardingData.units?.rent || "1,500",
            });
        }

        return units;
    };

    // Show loading while Clerk loads
    if (!isLoaded) {
        return (
            <OnboardingLayout currentStep={1} totalSteps={TOTAL_STEPS}>
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-solid border-t-transparent" />
                </div>
            </OnboardingLayout>
        );
    }

    return (
        <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            stepTitle={getStepTitle()}
        >
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
                <StepWelcome
                    userName={userName}
                    onContinue={handleNext}
                    onSkip={handleSkipOnboarding}
                />
            )}

            {/* Step 2: Portfolio Size */}
            {currentStep === 2 && (
                <StepPortfolio
                    onContinue={handlePortfolioComplete}
                    onBack={handleBack}
                    initialData={onboardingData.portfolio}
                />
            )}

            {/* Step 3: Add Property */}
            {currentStep === 3 && (
                <StepPropertyFixed
                    onContinue={handlePropertyComplete}
                    onBack={handleBack}
                    onSkip={() => {
                        // Skip property and units, go to plan
                        setCurrentStep(5);
                    }}
                    initialData={onboardingData.property}
                />
            )}

            {/* Step 4: Set Up Units */}
            {currentStep === 4 && (
                <StepUnitsFixed
                    propertyName={onboardingData.property?.propertyName || "Your Property"}
                    unitCount={getUnitCountNumber()}
                    onContinue={handleUnitsComplete}
                    onBack={handleBack}
                    initialData={onboardingData.units}
                />
            )}

            {/* Step 5: Choose Plan */}
            {currentStep === 5 && (
                <StepPlan
                    unitCount={getUnitCountNumber()}
                    onContinue={handlePlanComplete}
                    onBack={handleBack}
                />
            )}

            {/* Step 6: Complete */}
            {currentStep === 6 && (
                <StepComplete
                    property={{
                        name: onboardingData.property?.propertyName || "Your Property",
                        address: onboardingData.property?.address || "123 Main St, City, State",
                        units: generateUnits(),
                    }}
                    plan={onboardingData.plan?.plan || "starter"}
                    onGoToDashboard={handleGoToDashboard}
                    onCreateListing={() => router.push("/owner/listings/new")}
                    onInviteTenants={() => router.push("/owner/tenants/invite")}
                    onSetupPayments={() => router.push("/owner/settings/billing")}
                />
            )}
        </OnboardingLayout>
    );
}
