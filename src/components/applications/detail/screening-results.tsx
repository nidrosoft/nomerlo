"use client";

import { Check, X, Clock, AlertCircle } from "lucide-react";

interface ScreeningResultsProps {
    screeningStatus: "pending" | "in_progress" | "completed" | "failed";
    creditScore?: number;
    backgroundCheckPassed?: boolean;
    evictionCheckPassed?: boolean;
    onRunScreening?: () => void;
}

const getCreditRating = (score?: number): { rating: string; color: string } => {
    if (!score) return { rating: "Not Run", color: "text-tertiary" };
    if (score >= 750) return { rating: "Excellent", color: "text-success-primary" };
    if (score >= 700) return { rating: "Good", color: "text-success-primary" };
    if (score >= 650) return { rating: "Fair", color: "text-warning-primary" };
    return { rating: "Poor", color: "text-error-primary" };
};

export function ScreeningResults({
    screeningStatus,
    creditScore,
    backgroundCheckPassed,
    evictionCheckPassed,
    onRunScreening,
}: ScreeningResultsProps) {
    const creditRating = getCreditRating(creditScore);
    const isComplete = screeningStatus === "completed";
    const isPending = screeningStatus === "pending";
    const isInProgress = screeningStatus === "in_progress";

    return (
        <div className="rounded-2xl border border-secondary bg-primary p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Screening Results</h3>
                {isPending && onRunScreening && (
                    <button
                        onClick={onRunScreening}
                        className="rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
                    >
                        Run Screening
                    </button>
                )}
                {isInProgress && (
                    <div className="flex items-center gap-2 rounded-full bg-warning-secondary px-3 py-1.5 text-sm font-medium text-warning-primary">
                        <Clock className="size-4 animate-spin" />
                        Processing...
                    </div>
                )}
            </div>

            {isPending ? (
                <div className="flex flex-col items-center justify-center rounded-xl bg-secondary/50 py-8">
                    <AlertCircle className="mb-2 size-8 text-tertiary" />
                    <p className="text-sm text-tertiary">Screening has not been run yet</p>
                    <p className="text-xs text-tertiary">Click "Run Screening" to check credit and background</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Credit Check */}
                    <div className="rounded-xl border border-secondary p-4">
                        <h4 className="mb-3 text-sm font-medium text-tertiary">Credit Check</h4>
                        {creditScore ? (
                            <>
                                <p className="text-3xl font-bold text-primary">{creditScore}</p>
                                <p className={`mt-1 text-sm font-medium ${creditRating.color}`}>
                                    {creditRating.rating} {creditScore >= 650 && "✓"}
                                </p>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-tertiary">
                                <Clock className="size-4" />
                                <span className="text-sm">Pending</span>
                            </div>
                        )}
                    </div>

                    {/* Background Check */}
                    <div className="rounded-xl border border-secondary p-4">
                        <h4 className="mb-3 text-sm font-medium text-tertiary">Background Check</h4>
                        {backgroundCheckPassed !== undefined ? (
                            <div className="flex items-center gap-2">
                                {backgroundCheckPassed ? (
                                    <>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-secondary">
                                            <Check className="size-4 text-success-primary" />
                                        </div>
                                        <span className="font-medium text-success-primary">Clear</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error-secondary">
                                            <X className="size-4 text-error-primary" />
                                        </div>
                                        <span className="font-medium text-error-primary">Issues Found</span>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-tertiary">
                                <Clock className="size-4" />
                                <span className="text-sm">Pending</span>
                            </div>
                        )}
                    </div>

                    {/* Eviction Check */}
                    <div className="rounded-xl border border-secondary p-4">
                        <h4 className="mb-3 text-sm font-medium text-tertiary">Eviction History</h4>
                        {evictionCheckPassed !== undefined ? (
                            <div className="flex items-center gap-2">
                                {evictionCheckPassed ? (
                                    <>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-secondary">
                                            <Check className="size-4 text-success-primary" />
                                        </div>
                                        <span className="font-medium text-success-primary">None Found</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error-secondary">
                                            <X className="size-4 text-error-primary" />
                                        </div>
                                        <span className="font-medium text-error-primary">Found</span>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-tertiary">
                                <Clock className="size-4" />
                                <span className="text-sm">Pending</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
