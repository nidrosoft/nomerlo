"use client";

import { useState } from "react";
import { SearchSm } from "@untitledui/icons";
import { ConversationItem } from "./conversation-item";
import { MessageFilters } from "./message-filters";
import { cx } from "@/utils/cx";

interface Conversation {
    _id: string;
    participants: Array<{ userId: string; role: string; name: string }>;
    lastMessageAt: number;
    lastMessagePreview: string;
    unreadCounts: Record<string, number>;
    tenant?: { firstName: string; lastName: string } | null;
    property?: { name: string } | null;
    unit?: { unitNumber: string } | null;
}

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId?: string;
    onSelectConversation: (id: string) => void;
    filter: string;
    onFilterChange: (filter: string) => void;
    stats?: {
        total: number;
        unread: number;
        tenants: number;
        applicants: number;
        vendors: number;
    };
}

export function ConversationList({
    conversations,
    activeConversationId,
    onSelectConversation,
    filter,
    onFilterChange,
    stats,
}: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter conversations by search
    const filteredConversations = conversations.filter((conv) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const name = conv.tenant
            ? `${conv.tenant.firstName} ${conv.tenant.lastName}`
            : conv.participants[0]?.name || "";
        return (
            name.toLowerCase().includes(query) ||
            conv.lastMessagePreview.toLowerCase().includes(query)
        );
    });

    // Format timestamp
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return date.toLocaleDateString("en-US", { weekday: "short" });
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    };

    return (
        <div className="flex h-full flex-col border-r border-secondary">
            {/* Search */}
            <div className="border-b border-secondary p-4">
                <div className="relative">
                    <SearchSm className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-secondary bg-primary py-2 pl-9 pr-3 text-sm text-primary placeholder:text-tertiary focus:border-brand-solid focus:outline-none focus:ring-1 focus:ring-brand-solid"
                    />
                </div>
            </div>

            {/* Filters */}
            <MessageFilters
                activeFilter={filter}
                onFilterChange={onFilterChange}
                stats={stats}
            />

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto p-2">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm text-tertiary">No conversations found</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredConversations.map((conv) => {
                            const name = conv.tenant
                                ? `${conv.tenant.firstName} ${conv.tenant.lastName}`
                                : conv.participants[0]?.name || "Unknown";
                            const subtitle = conv.unit
                                ? `${conv.unit.unitNumber}${conv.property ? ` - ${conv.property.name}` : ""}`
                                : conv.property?.name;
                            const hasUnread = Object.values(conv.unreadCounts).some(
                                (c) => c > 0
                            );

                            return (
                                <ConversationItem
                                    key={conv._id}
                                    id={conv._id}
                                    name={name}
                                    subtitle={subtitle}
                                    preview={conv.lastMessagePreview || "No messages yet"}
                                    timestamp={formatTime(conv.lastMessageAt)}
                                    isUnread={hasUnread}
                                    isActive={conv._id === activeConversationId}
                                    onClick={() => onSelectConversation(conv._id)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
