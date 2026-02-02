"use client";

import type { FC } from "react";
import { Check } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import type { ProgressFeaturedIconType, ProgressNumberType, StepStatus } from "./progress-types";

interface IconsWithTextProps {
    items: ProgressFeaturedIconType[] | ProgressNumberType[];
    type?: "icon" | "number";
    size?: "sm" | "md";
    orientation?: "horizontal" | "vertical";
    className?: string;
}

const sizes = {
    sm: {
        iconWrapper: "size-8",
        icon: "size-4",
        checkIcon: "size-4",
        title: "text-sm",
        description: "text-xs",
        connector: "h-px",
        connectorVertical: "w-0.5 h-8",
    },
    md: {
        iconWrapper: "size-10",
        icon: "size-5",
        checkIcon: "size-5",
        title: "text-sm",
        description: "text-sm",
        connector: "h-px",
        connectorVertical: "w-0.5 h-10",
    },
};

const getStatusStyles = (status: StepStatus) => {
    switch (status) {
        case "complete":
            return {
                wrapper: "bg-brand-solid text-white",
                title: "text-primary",
                description: "text-tertiary",
            };
        case "current":
            return {
                wrapper: "bg-primary text-brand-solid ring-2 ring-brand-solid",
                title: "text-brand-primary",
                description: "text-brand-tertiary",
            };
        case "incomplete":
        default:
            return {
                wrapper: "bg-primary text-tertiary ring-1 ring-secondary",
                title: "text-tertiary",
                description: "text-quaternary",
            };
    }
};

function IconsWithText({ items, type = "icon", size = "sm", orientation = "horizontal", className }: IconsWithTextProps) {
    const sizeStyles = sizes[size];

    if (orientation === "vertical") {
        return (
            <div className={cx("flex flex-col gap-4", className)}>
                {items.map((item, index) => {
                    const statusStyles = getStatusStyles(item.status);
                    const showConnector = item.connector !== false && index < items.length - 1;
                    const Icon = "icon" in item ? item.icon : null;
                    const stepNumber = "number" in item ? item.number : index + 1;

                    return (
                        <div key={index} className="flex gap-3">
                            {/* Icon column with connector */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={cx(
                                        "flex shrink-0 items-center justify-center rounded-full transition-colors",
                                        sizeStyles.iconWrapper,
                                        statusStyles.wrapper
                                    )}
                                >
                                    {item.status === "complete" ? (
                                        <Check className={sizeStyles.checkIcon} />
                                    ) : type === "icon" && Icon ? (
                                        <Icon className={sizeStyles.icon} />
                                    ) : (
                                        <span className={cx("font-semibold", size === "sm" ? "text-sm" : "text-base")}>
                                            {stepNumber}
                                        </span>
                                    )}
                                </div>
                                {showConnector && (
                                    <div
                                        className={cx(
                                            "mt-2 flex-1",
                                            sizeStyles.connectorVertical,
                                            item.status === "complete" ? "bg-brand-solid" : "bg-secondary"
                                        )}
                                    />
                                )}
                            </div>

                            {/* Text */}
                            <div className="pt-1.5">
                                <p className={cx("font-semibold", sizeStyles.title, statusStyles.title)}>
                                    {item.title}
                                </p>
                                {item.description && (
                                    <p className={cx("mt-0.5", sizeStyles.description, statusStyles.description)}>
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Horizontal layout
    return (
        <div className={cx("flex w-full items-start", className)}>
            {items.map((item, index) => {
                const statusStyles = getStatusStyles(item.status);
                const showConnector = item.connector !== false && index < items.length - 1;
                const Icon = "icon" in item ? item.icon : null;
                const stepNumber = "number" in item ? item.number : index + 1;
                const isFirst = index === 0;
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex flex-1 flex-col items-center">
                        {/* Icon Row with Connectors */}
                        <div className="flex w-full items-center">
                            {/* Left connector or spacer */}
                            <div
                                className={cx(
                                    "flex-1",
                                    sizeStyles.connector,
                                    isFirst
                                        ? "bg-transparent"
                                        : items[index - 1].status === "complete"
                                            ? "border-t-2 border-dashed border-brand-solid"
                                            : "border-t-2 border-dashed border-secondary"
                                )}
                            />

                            {/* Icon/Number */}
                            <div
                                className={cx(
                                    "flex shrink-0 items-center justify-center rounded-full transition-colors",
                                    sizeStyles.iconWrapper,
                                    statusStyles.wrapper
                                )}
                            >
                                {item.status === "complete" ? (
                                    <Check className={sizeStyles.checkIcon} />
                                ) : type === "icon" && Icon ? (
                                    <Icon className={sizeStyles.icon} />
                                ) : (
                                    <span className={cx("font-semibold", size === "sm" ? "text-sm" : "text-base")}>
                                        {stepNumber}
                                    </span>
                                )}
                            </div>

                            {/* Right connector or spacer */}
                            <div
                                className={cx(
                                    "flex-1",
                                    sizeStyles.connector,
                                    isLast
                                        ? "bg-transparent"
                                        : item.status === "complete"
                                            ? "border-t-2 border-dashed border-brand-solid"
                                            : "border-t-2 border-dashed border-secondary"
                                )}
                            />
                        </div>

                        {/* Text */}
                        <div className="mt-3 text-center">
                            <p className={cx("font-semibold", sizeStyles.title, statusStyles.title)}>
                                {item.title}
                            </p>
                            {item.description && (
                                <p className={cx("mt-0.5", sizeStyles.description, statusStyles.description)}>
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export const Progress = {
    IconsWithText,
};
