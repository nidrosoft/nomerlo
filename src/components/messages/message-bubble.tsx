"use client";

import { useState, useMemo, useCallback } from "react";
import { cx } from "@/utils/cx";
import { FaceSmile, MessageTextSquare02, DotsHorizontal, Copy01 } from "@untitledui/icons";

interface Reaction {
    emoji: string;
    userId: string;
    userName?: string;
    createdAt: number;
}

interface ReplyTo {
    _id: string;
    content: string;
    senderName: string;
}

interface MessageBubbleProps {
    content: string;
    timestamp: string;
    isOwn: boolean;
    senderName?: string;
    senderInitials?: string;
    attachments?: Array<{
        name: string;
        url: string;
        mimeType: string;
    }>;
    reactions?: Reaction[];
    replyTo?: ReplyTo | null;
    isEdited?: boolean;
    isDeleted?: boolean;
    onReact?: (emoji: string) => void;
    onReply?: () => void;
    messageId?: string;
}

// Quick reaction emojis
const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export function MessageBubble({
    content,
    timestamp,
    isOwn,
    senderName,
    senderInitials,
    attachments,
    reactions = [],
    replyTo,
    isEdited,
    isDeleted,
    onReact,
    onReply,
    messageId,
}: MessageBubbleProps) {
    const [showActions, setShowActions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Group reactions by emoji - memoized to prevent recalculation on every render
    const groupedReactions = useMemo(() => 
        reactions.reduce((acc, reaction) => {
            if (!acc[reaction.emoji]) {
                acc[reaction.emoji] = { count: 0, users: [] };
            }
            acc[reaction.emoji].count++;
            if (reaction.userName) {
                acc[reaction.emoji].users.push(reaction.userName);
            }
            return acc;
        }, {} as Record<string, { count: number; users: string[] }>),
        [reactions]
    );

    // Memoized handlers to prevent unnecessary re-renders
    const handleReaction = useCallback((emoji: string) => {
        onReact?.(emoji);
        setShowEmojiPicker(false);
        setShowActions(false);
    }, [onReact]);

    const handleCopyText = useCallback(() => {
        navigator.clipboard.writeText(content);
        setShowActions(false);
    }, [content]);

    return (
        <div
            className={cx(
                "group relative flex gap-3",
                isOwn ? "flex-row-reverse" : "flex-row"
            )}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => {
                setShowActions(false);
                setShowEmojiPicker(false);
            }}
        >
            {/* Avatar */}
            {!isOwn && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-tertiary text-xs font-medium text-primary">
                    {senderInitials || "?"}
                </div>
            )}

            {/* Message content */}
            <div className={cx("relative max-w-[70%]", isOwn ? "items-end" : "items-start")}>
                {!isOwn && senderName && (
                    <p className="mb-1 text-xs font-medium text-tertiary">{senderName}</p>
                )}

                {/* Reply preview with thread line (Slack-style) */}
                {replyTo && (
                    <div className={cx(
                        "mb-2 flex",
                        isOwn ? "justify-end" : "justify-start"
                    )}>
                        <div className={cx(
                            "flex overflow-hidden rounded-lg border",
                            isOwn
                                ? "border-brand-solid/20 bg-brand-secondary/30"
                                : "border-secondary bg-tertiary/10"
                        )}>
                            {/* Thread line - prominent vertical bar on the left */}
                            <div className={cx(
                                "w-1.5 shrink-0",
                                "bg-brand-solid"
                            )} />
                            
                            {/* Reply content */}
                            <div className="px-3 py-2 text-xs max-w-[250px]">
                                <p className="mb-0.5 text-[11px] font-semibold text-brand-solid">
                                    Replying to {replyTo.senderName}
                                </p>
                                <p className="truncate text-tertiary">{replyTo.content}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className={cx(
                        "relative rounded-2xl px-4 py-2.5",
                        isOwn
                            ? "rounded-br-md bg-brand-solid text-white"
                            : "rounded-bl-md bg-secondary text-primary",
                        isDeleted && "italic opacity-60"
                    )}
                >
                    <p className="whitespace-pre-wrap text-sm">
                        {isDeleted ? "This message was deleted" : content}
                    </p>
                </div>

                {/* Reactions display */}
                {Object.keys(groupedReactions).length > 0 && (
                    <div
                        className={cx(
                            "mt-1 flex flex-wrap gap-1",
                            isOwn ? "justify-end" : "justify-start"
                        )}
                    >
                        {Object.entries(groupedReactions).map(([emoji, data]) => (
                            <button
                                key={emoji}
                                onClick={() => handleReaction(emoji)}
                                title={data.users.join(", ")}
                                className={cx(
                                    "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all hover:scale-110",
                                    isOwn
                                        ? "border-brand-solid/30 bg-brand-secondary"
                                        : "border-secondary bg-primary"
                                )}
                            >
                                <span>{emoji}</span>
                                {data.count > 1 && (
                                    <span className="text-tertiary">{data.count}</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Attachments */}
                {attachments && attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {attachments.map((attachment, index) => (
                            <a
                                key={index}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx(
                                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                                    isOwn
                                        ? "border-brand-solid/30 bg-brand-secondary text-brand-primary hover:bg-brand-secondary/80"
                                        : "border-secondary bg-primary text-primary hover:bg-secondary"
                                )}
                            >
                                <span className="truncate">{attachment.name}</span>
                            </a>
                        ))}
                    </div>
                )}

                <p
                    className={cx(
                        "mt-1 text-xs text-tertiary",
                        isOwn ? "text-right" : "text-left"
                    )}
                >
                    {timestamp}
                    {isEdited && <span className="ml-1 opacity-60">(edited)</span>}
                    {isOwn && <span className="ml-2">You</span>}
                </p>

                {/* Message actions - shown on hover */}
                {showActions && !isDeleted && (
                    <div
                        className={cx(
                            "absolute -top-8 z-10 flex items-center gap-0.5 rounded-lg border border-secondary bg-primary p-1 shadow-lg",
                            isOwn ? "right-0" : "left-0"
                        )}
                    >
                        {/* Quick reactions */}
                        {QUICK_REACTIONS.slice(0, 3).map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleReaction(emoji)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-sm transition-all hover:scale-125 hover:bg-secondary"
                            >
                                {emoji}
                            </button>
                        ))}

                        {/* More reactions button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                            >
                                <FaceSmile className="size-4" />
                            </button>

                            {/* Emoji picker dropdown */}
                            {showEmojiPicker && (
                                <div
                                    className={cx(
                                        "absolute top-full z-20 mt-1 flex flex-wrap gap-1 rounded-lg border border-secondary bg-primary p-2 shadow-lg",
                                        isOwn ? "right-0" : "left-0"
                                    )}
                                    style={{ width: "200px" }}
                                >
                                    {QUICK_REACTIONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleReaction(emoji)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-all hover:scale-125 hover:bg-secondary"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleReaction("🎉")}
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-all hover:scale-125 hover:bg-secondary"
                                    >
                                        🎉
                                    </button>
                                    <button
                                        onClick={() => handleReaction("👏")}
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-all hover:scale-125 hover:bg-secondary"
                                    >
                                        👏
                                    </button>
                                    <button
                                        onClick={() => handleReaction("🔥")}
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-all hover:scale-125 hover:bg-secondary"
                                    >
                                        🔥
                                    </button>
                                    <button
                                        onClick={() => handleReaction("✅")}
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-all hover:scale-125 hover:bg-secondary"
                                    >
                                        ✅
                                    </button>
                                    <button
                                        onClick={() => handleReaction("💯")}
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-all hover:scale-125 hover:bg-secondary"
                                    >
                                        💯
                                    </button>
                                    <button
                                        onClick={() => handleReaction("👀")}
                                        className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-all hover:scale-125 hover:bg-secondary"
                                    >
                                        👀
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Reply button */}
                        {onReply && (
                            <button
                                onClick={onReply}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                                title="Reply"
                            >
                                <MessageTextSquare02 className="size-4" />
                            </button>
                        )}

                        {/* Copy button */}
                        <button
                            onClick={handleCopyText}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                            title="Copy text"
                        >
                            <Copy01 className="size-4" />
                        </button>

                        {/* More options */}
                        <button
                            className="flex h-7 w-7 items-center justify-center rounded-md text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                            title="More options"
                        >
                            <DotsHorizontal className="size-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
