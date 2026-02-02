"use client";

import { ReactNode } from "react";
import { Check } from "lucide-react";
import { cx } from "@/utils/cx";

interface OnboardingLayoutProps {
    children: ReactNode;
    currentStep: number;
    totalSteps: number;
    stepTitle?: string;
}

const STEPS = [
    { number: 1, title: "Welcome" },
    { number: 2, title: "Portfolio" },
    { number: 3, title: "Property" },
    { number: 4, title: "Units" },
    { number: 5, title: "Plan" },
    { number: 6, title: "Complete" },
];

export function OnboardingLayout({
    children,
    currentStep,
    totalSteps,
    stepTitle,
}: OnboardingLayoutProps) {
    return (
        <div className="min-h-screen bg-primary">
            {/* Header */}
            <header className="border-b border-secondary bg-primary">
                <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href="/" className="text-2xl font-bold text-primary">
                            nomerlo.
                        </a>
                        
                        {/* Help link */}
                        <a 
                            href="/help" 
                            className="text-sm font-medium text-tertiary hover:text-secondary transition-colors"
                        >
                            Need help?
                        </a>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            {currentStep > 1 && currentStep < totalSteps && (
                <div className="border-b border-secondary bg-primary">
                    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                        {/* Step indicator */}
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-secondary">
                                Step {currentStep} of {totalSteps}
                                {stepTitle && `: ${stepTitle}`}
                            </span>
                            <span className="text-sm text-tertiary">
                                {Math.round((currentStep / totalSteps) * 100)}% complete
                            </span>
                        </div>

                        {/* Progress steps */}
                        <div className="flex items-center gap-2">
                            {STEPS.map((step, index) => {
                                const isCompleted = step.number < currentStep;
                                const isCurrent = step.number === currentStep;
                                
                                return (
                                    <div key={step.number} className="flex flex-1 items-center">
                                        {/* Step circle */}
                                        <div
                                            className={cx(
                                                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                                                isCompleted && "bg-brand-solid text-white",
                                                isCurrent && "bg-brand-solid text-white ring-4 ring-brand-solid/20",
                                                !isCompleted && !isCurrent && "bg-secondary text-tertiary"
                                            )}
                                        >
                                            {isCompleted ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                step.number
                                            )}
                                        </div>

                                        {/* Connector line */}
                                        {index < STEPS.length - 1 && (
                                            <div
                                                className={cx(
                                                    "mx-2 h-0.5 flex-1 transition-colors",
                                                    isCompleted ? "bg-brand-solid" : "bg-secondary"
                                                )}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Step labels (hidden on mobile) */}
                        <div className="mt-2 hidden sm:flex">
                            {STEPS.map((step) => (
                                <div key={step.number} className="flex-1 text-center">
                                    <span
                                        className={cx(
                                            "text-xs font-medium",
                                            step.number <= currentStep ? "text-secondary" : "text-tertiary"
                                        )}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {children}
            </main>
        </div>
    );
}

// Onboarding card wrapper component
interface OnboardingCardProps {
    children: ReactNode;
    className?: string;
}

export function OnboardingCard({ children, className }: OnboardingCardProps) {
    return (
        <div
            className={cx(
                "rounded-2xl border border-secondary bg-primary p-6 shadow-sm sm:p-8",
                className
            )}
        >
            {children}
        </div>
    );
}

// Onboarding header component
interface OnboardingHeaderProps {
    icon?: ReactNode;
    title: string;
    description?: string;
}

export function OnboardingHeader({ icon, title, description }: OnboardingHeaderProps) {
    return (
        <div className="mb-6 text-center sm:mb-8">
            {icon && (
                <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-brand-solid">
                        {icon}
                    </div>
                </div>
            )}
            <h1 className="text-2xl font-semibold text-primary sm:text-3xl">{title}</h1>
            {description && (
                <p className="mt-2 text-base text-tertiary sm:text-lg">{description}</p>
            )}
        </div>
    );
}

// Selection card for options
interface SelectionCardProps {
    selected: boolean;
    onClick: () => void;
    icon?: ReactNode;
    title: string;
    description?: string;
    badge?: string;
    className?: string;
}

export function SelectionCard({
    selected,
    onClick,
    icon,
    title,
    description,
    badge,
    className,
}: SelectionCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "relative flex w-full flex-col items-center rounded-2xl border-2 p-4 text-center transition-all sm:p-6",
                selected
                    ? "border-brand-solid bg-brand-secondary ring-2 ring-brand-solid/20"
                    : "border-secondary bg-primary hover:border-tertiary hover:bg-primary_hover",
                className
            )}
        >
            {badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-solid px-2.5 py-0.5 text-xs font-semibold text-white">
                    {badge}
                </span>
            )}
            {icon && (
                <div
                    className={cx(
                        "mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-xl",
                        selected ? "bg-brand-solid text-white" : "bg-secondary text-tertiary"
                    )}
                >
                    {icon}
                </div>
            )}
            <span className={cx("font-semibold", selected ? "text-brand-solid" : "text-primary")}>
                {title}
            </span>
            {description && (
                <span className="mt-1 text-sm text-tertiary">{description}</span>
            )}
            {/* Selection indicator */}
            <div
                className={cx(
                    "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                    selected
                        ? "border-brand-solid bg-brand-solid text-white"
                        : "border-tertiary bg-primary"
                )}
            >
                {selected && <Check className="h-3 w-3" />}
            </div>
        </button>
    );
}
