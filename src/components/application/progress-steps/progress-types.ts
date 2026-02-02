import type { FC } from "react";

export type StepStatus = "complete" | "current" | "incomplete";

export interface ProgressStepBase {
    title: string;
    description?: string;
    status: StepStatus;
    connector?: boolean;
}

export interface ProgressFeaturedIconType extends ProgressStepBase {
    icon: FC<{ className?: string }>;
}

export interface ProgressNumberType extends ProgressStepBase {
    number?: number;
}
