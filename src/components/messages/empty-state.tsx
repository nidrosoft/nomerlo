"use client";

import { MessageChatCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    title = "No conversation selected",
    description = "Select a conversation from the list to view messages",
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <MessageChatCircle className="size-8 text-tertiary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-primary">{title}</h3>
            <p className="mb-6 max-w-sm text-sm text-tertiary">{description}</p>
            {actionLabel && onAction && (
                <Button color="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
