"use client";

import { cx } from "@/utils/cx";

interface ConversationItemProps {
    id: string;
    name: string;
    subtitle?: string;
    preview: string;
    timestamp: string;
    isUnread?: boolean;
    isActive?: boolean;
    onClick: () => void;
}

export function ConversationItem({
    name,
    subtitle,
    preview,
    timestamp,
    isUnread,
    isActive,
    onClick,
}: ConversationItemProps) {
    // Get initials for avatar
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <button
            onClick={onClick}
            className={cx(
                "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
                isActive
                    ? "bg-brand-secondary"
                    : "hover:bg-secondary",
                isUnread && "bg-secondary/50"
            )}
        >
            {/* Avatar with unread indicator */}
            <div className="relative flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary text-sm font-medium text-primary">
                    {initials}
                </div>
                {isUnread && (
                    <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-primary bg-error-solid" />
                )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className={cx(
                            "truncate text-sm",
                            isUnread ? "font-semibold text-primary" : "font-medium text-primary"
                        )}>
                            {name}
                        </p>
                        {subtitle && (
                            <p className="truncate text-xs text-tertiary">{subtitle}</p>
                        )}
                    </div>
                    <span className="flex-shrink-0 text-xs text-tertiary">{timestamp}</span>
                </div>
                <p className={cx(
                    "mt-1 truncate text-sm",
                    isUnread ? "text-secondary font-medium" : "text-tertiary"
                )}>
                    {preview}
                </p>
            </div>
        </button>
    );
}
