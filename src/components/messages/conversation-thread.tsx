"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { 
    DotsHorizontal, 
    Phone01, 
    Archive, 
    Bell03, 
    UserX01, 
    Flag01, 
    Trash01,
    SearchMd 
} from "@untitledui/icons";

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

interface Message {
    _id: string;
    content: string;
    senderId: string;
    createdAt: number;
    attachments: Array<{ name: string; url: string; mimeType: string }>;
    reactions?: Reaction[];
    replyTo?: ReplyTo | null;
    isEdited?: boolean;
    isDeleted?: boolean;
    sender?: {
        _id?: string;
        firstName?: string;
        lastName?: string;
        imageUrl?: string;
    } | null;
}

interface ConversationThreadProps {
    conversationId: string;
    messages: Message[];
    currentUserId?: string;
    recipientName: string;
    recipientSubtitle?: string;
    onSendMessage: (content: string) => void;
    isLoading?: boolean;
}

export function ConversationThread({
    conversationId,
    messages,
    currentUserId,
    recipientName,
    recipientSubtitle,
    onSendMessage,
    isLoading,
}: ConversationThreadProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const markAsRead = useMutation(api.messages.mutations.markAsRead);
    const toggleReaction = useMutation(api.messages.mutations.toggleReaction);
    const replyToMessage = useMutation(api.messages.mutations.replyToMessage);
    
    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle reaction
    const handleReaction = async (messageId: string, emoji: string) => {
        if (!currentUserId) return;
        try {
            await toggleReaction({
                messageId: messageId as Id<"messages">,
                userId: currentUserId as Id<"users">,
                emoji,
            });
        } catch (error) {
            console.error("Failed to toggle reaction:", error);
        }
    };

    // Handle reply
    const handleStartReply = (message: Message) => {
        setReplyingTo(message);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
    };

    const handleSendWithReply = async (content: string) => {
        if (replyingTo && currentUserId) {
            try {
                await replyToMessage({
                    conversationId: conversationId as Id<"conversations">,
                    senderId: currentUserId as Id<"users">,
                    content,
                    replyToId: replyingTo._id as Id<"messages">,
                });
                setReplyingTo(null);
            } catch (error) {
                console.error("Failed to send reply:", error);
                // Fallback to regular send
                onSendMessage(content);
            }
        } else {
            onSendMessage(content);
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Mark as read when viewing
    useEffect(() => {
        if (conversationId && currentUserId) {
            markAsRead({
                conversationId: conversationId as Id<"conversations">,
                userId: currentUserId as Id<"users">,
            });
        }
    }, [conversationId, currentUserId, markAsRead]);

    // Format timestamp
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Format date for date separators
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    // Get initials
    const getInitials = (firstName?: string, lastName?: string) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
    };

    // Group messages by date
    const groupedMessages: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    messages.forEach((msg) => {
        const msgDate = formatDate(msg.createdAt);
        if (msgDate !== currentDate) {
            currentDate = msgDate;
            groupedMessages.push({ date: msgDate, messages: [msg] });
        } else {
            groupedMessages[groupedMessages.length - 1].messages.push(msg);
        }
    });

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-secondary px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary text-sm font-medium text-primary">
                        {recipientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                    </div>
                    <div>
                        <h2 className="font-semibold text-primary">{recipientName}</h2>
                        {recipientSubtitle && (
                            <p className="text-sm text-tertiary">{recipientSubtitle}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                        title="Call"
                    >
                        <Phone01 className="size-5" />
                    </button>
                    <button 
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                        title="Search in conversation"
                    >
                        <SearchMd className="size-5" />
                    </button>
                    
                    {/* Three-dot menu with dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                        >
                            <DotsHorizontal className="size-5" />
                        </button>
                        
                        {/* Dropdown menu */}
                        {showMenu && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-secondary bg-primary py-1 shadow-lg">
                                <button 
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-primary transition-colors hover:bg-secondary"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <Archive className="size-4 text-tertiary" />
                                    Archive conversation
                                </button>
                                <button 
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-primary transition-colors hover:bg-secondary"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <Bell03 className="size-4 text-tertiary" />
                                    Mute notifications
                                </button>
                                <button 
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-primary transition-colors hover:bg-secondary"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <UserX01 className="size-4 text-tertiary" />
                                    Block user
                                </button>
                                <div className="my-1 border-t border-secondary" />
                                <button 
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-primary transition-colors hover:bg-secondary"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <Flag01 className="size-4 text-tertiary" />
                                    Report conversation
                                </button>
                                <button 
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-error-primary transition-colors hover:bg-error-secondary"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <Trash01 className="size-4" />
                                    Delete conversation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-solid border-t-transparent" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-tertiary">No messages yet</p>
                        <p className="mt-1 text-sm text-quaternary">
                            Send a message to start the conversation
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupedMessages.map((group) => (
                            <div key={group.date}>
                                {/* Date separator */}
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex-1 border-t border-secondary" />
                                    <span className="text-xs font-medium text-tertiary">
                                        {group.date}
                                    </span>
                                    <div className="flex-1 border-t border-secondary" />
                                </div>

                                {/* Messages for this date */}
                                <div className="space-y-4">
                                    {group.messages.map((msg) => {
                                        const isOwn = msg.senderId === currentUserId;
                                        const senderName = msg.sender
                                            ? `${msg.sender.firstName || ""} ${msg.sender.lastName || ""}`.trim()
                                            : undefined;

                                            return (
                                                <MessageBubble
                                                    key={msg._id}
                                                    messageId={msg._id}
                                                    content={msg.content}
                                                    timestamp={formatTime(msg.createdAt)}
                                                    isOwn={isOwn}
                                                    senderName={!isOwn ? senderName : undefined}
                                                    senderInitials={
                                                        !isOwn
                                                            ? getInitials(
                                                                  msg.sender?.firstName,
                                                                  msg.sender?.lastName
                                                              )
                                                            : undefined
                                                    }
                                                    attachments={msg.attachments}
                                                    reactions={msg.reactions}
                                                    replyTo={msg.replyTo}
                                                    isEdited={msg.isEdited}
                                                    isDeleted={msg.isDeleted}
                                                    onReact={(emoji) => handleReaction(msg._id, emoji)}
                                                    onReply={() => handleStartReply(msg)}
                                                />
                                            );
                                    })}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Reply preview with thread line */}
            {replyingTo && (
                <div className="flex items-stretch border-t border-secondary bg-tertiary/10 px-6 py-3">
                    {/* Thread line */}
                    <div className="mr-3 w-1 shrink-0 rounded-full bg-brand-solid" />
                    
                    {/* Reply content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-brand-solid">
                            Replying to {replyingTo.sender
                                ? `${replyingTo.sender.firstName || ""} ${replyingTo.sender.lastName || ""}`.trim()
                                : "Unknown"}
                        </p>
                        <p className="truncate text-sm text-tertiary">
                            {replyingTo.content}
                        </p>
                    </div>
                    
                    {/* Cancel button */}
                    <button
                        onClick={handleCancelReply}
                        className="ml-3 shrink-0 rounded-md px-3 py-1 text-sm font-medium text-tertiary transition-colors hover:bg-secondary hover:text-primary"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Message Input */}
            <MessageInput onSend={handleSendWithReply} />
        </div>
    );
}
