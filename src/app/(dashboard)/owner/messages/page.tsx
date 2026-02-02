"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ConversationList } from "@/components/messages/conversation-list";
import { ConversationThread } from "@/components/messages/conversation-thread";
import { NewMessageModal } from "@/components/messages/new-message-modal";
import { EmptyState } from "@/components/messages/empty-state";

export default function MessagesPage() {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [filter, setFilter] = useState("all");
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

    // Fetch conversations
    const conversations = useQuery(api.messages.queries.listConversations, {
        filter: filter as "all" | "unread" | "tenants" | "applicants" | "vendors",
    });

    // Fetch stats
    const stats = useQuery(api.messages.queries.getMessageStats, {});

    // Fetch active conversation details
    const activeConversation = useQuery(
        api.messages.queries.getConversation,
        activeConversationId
            ? { conversationId: activeConversationId as Id<"conversations"> }
            : "skip"
    );

    // Fetch messages for active conversation
    const messages = useQuery(
        api.messages.queries.getConversationMessages,
        activeConversationId
            ? { conversationId: activeConversationId as Id<"conversations"> }
            : "skip"
    );

    // Send message mutation
    const sendMessage = useMutation(api.messages.mutations.sendMessage);

    const handleSendMessage = async (content: string) => {
        if (!activeConversationId) return;

        // For now, we'll use a placeholder user ID
        // In production, this should come from the authenticated user
        const currentUserId = activeConversation?.participants[0]?.userId;
        if (!currentUserId) return;

        await sendMessage({
            conversationId: activeConversationId as Id<"conversations">,
            senderId: currentUserId as Id<"users">,
            content,
        });
    };

    const handleConversationCreated = (conversationId: string) => {
        setActiveConversationId(conversationId);
        setIsNewMessageOpen(false);
    };

    // Get recipient info for active conversation
    const recipientName = activeConversation?.tenant
        ? `${activeConversation.tenant.firstName} ${activeConversation.tenant.lastName}`
        : activeConversation?.participants[0]?.name || "Unknown";

    const recipientSubtitle = activeConversation?.unit
        ? `${activeConversation.unit.unitNumber}${activeConversation.property ? ` - ${activeConversation.property.name}` : ""}`
        : activeConversation?.property?.name;

    const currentUserId = activeConversation?.participants[0]?.userId;

    return (
        <div className="flex h-[calc(100vh-120px)] flex-col">
            {/* Page Header */}
            <div className="flex items-center justify-between pb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Communication</h1>
                    <p className="text-sm text-tertiary">
                        Manage all your conversations with tenants, applicants, and vendors
                    </p>
                </div>
                <Button
                    color="primary"
                    iconLeading={Plus}
                    onClick={() => setIsNewMessageOpen(true)}
                >
                    New Message
                </Button>
            </div>

            {/* Main Content - Split View */}
            <div className="flex flex-1 overflow-hidden rounded-xl border border-secondary bg-primary shadow-xs">
                {/* Left Panel - Conversation List */}
                <div className="w-96 flex-shrink-0">
                    <ConversationList
                        conversations={conversations || []}
                        activeConversationId={activeConversationId || undefined}
                        onSelectConversation={setActiveConversationId}
                        filter={filter}
                        onFilterChange={setFilter}
                        stats={stats || undefined}
                    />
                </div>

                {/* Right Panel - Conversation Thread */}
                <div className="flex-1">
                    {activeConversationId && activeConversation ? (
                        <ConversationThread
                            conversationId={activeConversationId}
                            messages={messages || []}
                            currentUserId={currentUserId}
                            recipientName={recipientName}
                            recipientSubtitle={recipientSubtitle}
                            onSendMessage={handleSendMessage}
                            isLoading={!messages}
                        />
                    ) : (
                        <EmptyState
                            title="No conversation selected"
                            description="Select a conversation from the list to view messages, or start a new one."
                            actionLabel="New Message"
                            onAction={() => setIsNewMessageOpen(true)}
                        />
                    )}
                </div>
            </div>

            {/* New Message Modal */}
            <NewMessageModal
                isOpen={isNewMessageOpen}
                onClose={() => setIsNewMessageOpen(false)}
                onConversationCreated={handleConversationCreated}
            />
        </div>
    );
}
