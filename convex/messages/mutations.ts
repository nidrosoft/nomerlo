import { v } from "convex/values";
import { mutation } from "../_generated/server";

// Create a new conversation
export const createConversation = mutation({
    args: {
        organizationId: v.id("organizations"),
        participants: v.array(v.object({
            userId: v.id("users"),
            role: v.string(),
            name: v.string(),
        })),
        tenantId: v.optional(v.id("tenants")),
        propertyId: v.optional(v.id("properties")),
        unitId: v.optional(v.id("units")),
        initialMessage: v.string(),
        senderId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Create the conversation
        const conversationId = await ctx.db.insert("conversations", {
            organizationId: args.organizationId,
            participants: args.participants,
            tenantId: args.tenantId,
            propertyId: args.propertyId,
            unitId: args.unitId,
            lastMessageAt: now,
            lastMessagePreview: args.initialMessage.substring(0, 100),
            unreadCounts: {},
            status: "active",
            createdAt: now,
            updatedAt: now,
        });

        // Create the initial message
        await ctx.db.insert("messages", {
            conversationId,
            senderId: args.senderId,
            content: args.initialMessage,
            attachments: [],
            readBy: [{ userId: args.senderId, readAt: now }],
            createdAt: now,
        });

        return conversationId;
    },
});

// Send a message in an existing conversation
export const sendMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        senderId: v.id("users"),
        content: v.string(),
        attachments: v.optional(v.array(v.object({
            name: v.string(),
            url: v.string(),
            storageId: v.id("_storage"),
            mimeType: v.string(),
        }))),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Create the message
        const messageId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            senderId: args.senderId,
            content: args.content,
            attachments: args.attachments || [],
            readBy: [{ userId: args.senderId, readAt: now }],
            createdAt: now,
        });

        // Update conversation with last message info
        const conversation = await ctx.db.get(args.conversationId);
        if (conversation) {
            // Increment unread count for all participants except sender
            const unreadCounts = { ...(conversation.unreadCounts as Record<string, number>) };
            conversation.participants.forEach((p) => {
                if (p.userId !== args.senderId) {
                    unreadCounts[p.userId] = (unreadCounts[p.userId] || 0) + 1;
                }
            });

            await ctx.db.patch(args.conversationId, {
                lastMessageAt: now,
                lastMessagePreview: args.content.substring(0, 100),
                unreadCounts,
                updatedAt: now,
            });
        }

        return messageId;
    },
});

// Mark conversation as read for a user
export const markAsRead = mutation({
    args: {
        conversationId: v.id("conversations"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Update unread count for this user
        const conversation = await ctx.db.get(args.conversationId);
        if (conversation) {
            const unreadCounts = { ...(conversation.unreadCounts as Record<string, number>) };
            unreadCounts[args.userId] = 0;

            await ctx.db.patch(args.conversationId, {
                unreadCounts,
                updatedAt: now,
            });
        }

        // Mark all messages as read by this user
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .collect();

        for (const message of messages) {
            const alreadyRead = message.readBy.some((r) => r.userId === args.userId);
            if (!alreadyRead) {
                await ctx.db.patch(message._id, {
                    readBy: [...message.readBy, { userId: args.userId, readAt: now }],
                });
            }
        }

        return { success: true };
    },
});

// Archive a conversation
export const archiveConversation = mutation({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.conversationId, {
            status: "archived",
            updatedAt: Date.now(),
        });
        return { success: true };
    },
});

// Add a reaction to a message
export const addReaction = mutation({
    args: {
        messageId: v.id("messages"),
        userId: v.id("users"),
        emoji: v.string(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const message = await ctx.db.get(args.messageId);
        if (!message) throw new Error("Message not found");

        const existingReactions = message.reactions || [];
        
        // Check if user already reacted with this emoji
        const alreadyReacted = existingReactions.some(
            r => r.userId === args.userId && r.emoji === args.emoji
        );
        
        if (alreadyReacted) {
            return { success: false, message: "Already reacted with this emoji" };
        }

        // Add the reaction
        await ctx.db.patch(args.messageId, {
            reactions: [
                ...existingReactions,
                {
                    emoji: args.emoji,
                    userId: args.userId,
                    createdAt: now,
                },
            ],
        });

        return { success: true };
    },
});

// Remove a reaction from a message
export const removeReaction = mutation({
    args: {
        messageId: v.id("messages"),
        userId: v.id("users"),
        emoji: v.string(),
    },
    handler: async (ctx, args) => {
        const message = await ctx.db.get(args.messageId);
        if (!message) throw new Error("Message not found");

        const existingReactions = message.reactions || [];
        
        // Filter out the reaction
        const updatedReactions = existingReactions.filter(
            r => !(r.userId === args.userId && r.emoji === args.emoji)
        );

        await ctx.db.patch(args.messageId, {
            reactions: updatedReactions,
        });

        return { success: true };
    },
});

// Toggle a reaction (add if not exists, remove if exists)
export const toggleReaction = mutation({
    args: {
        messageId: v.id("messages"),
        userId: v.id("users"),
        emoji: v.string(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const message = await ctx.db.get(args.messageId);
        if (!message) throw new Error("Message not found");

        const existingReactions = message.reactions || [];
        
        // Check if user already reacted with this emoji
        const existingIndex = existingReactions.findIndex(
            r => r.userId === args.userId && r.emoji === args.emoji
        );
        
        let updatedReactions;
        let added = false;
        
        if (existingIndex >= 0) {
            // Remove the reaction
            updatedReactions = existingReactions.filter((_, i) => i !== existingIndex);
        } else {
            // Add the reaction
            updatedReactions = [
                ...existingReactions,
                {
                    emoji: args.emoji,
                    userId: args.userId,
                    createdAt: now,
                },
            ];
            added = true;
        }

        await ctx.db.patch(args.messageId, {
            reactions: updatedReactions,
        });

        return { success: true, added };
    },
});

// Edit a message
export const editMessage = mutation({
    args: {
        messageId: v.id("messages"),
        userId: v.id("users"),
        newContent: v.string(),
    },
    handler: async (ctx, args) => {
        const message = await ctx.db.get(args.messageId);
        if (!message) throw new Error("Message not found");
        
        // Only sender can edit their message
        if (message.senderId !== args.userId) {
            throw new Error("You can only edit your own messages");
        }

        await ctx.db.patch(args.messageId, {
            content: args.newContent,
            isEdited: true,
            editedAt: Date.now(),
        });

        // Update conversation preview if this was the last message
        const conversation = await ctx.db.get(message.conversationId);
        if (conversation) {
            const latestMessage = await ctx.db
                .query("messages")
                .withIndex("by_conversation", q => q.eq("conversationId", message.conversationId))
                .order("desc")
                .first();
            
            if (latestMessage && latestMessage._id === args.messageId) {
                await ctx.db.patch(message.conversationId, {
                    lastMessagePreview: args.newContent.substring(0, 100),
                    updatedAt: Date.now(),
                });
            }
        }

        return { success: true };
    },
});

// Delete a message (soft delete)
export const deleteMessage = mutation({
    args: {
        messageId: v.id("messages"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const message = await ctx.db.get(args.messageId);
        if (!message) throw new Error("Message not found");
        
        // Only sender can delete their message
        if (message.senderId !== args.userId) {
            throw new Error("You can only delete your own messages");
        }

        await ctx.db.patch(args.messageId, {
            isDeleted: true,
            deletedAt: Date.now(),
            content: "This message was deleted",
        });

        return { success: true };
    },
});

// Reply to a message
export const replyToMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        senderId: v.id("users"),
        content: v.string(),
        replyToId: v.id("messages"),
        attachments: v.optional(v.array(v.object({
            name: v.string(),
            url: v.string(),
            storageId: v.id("_storage"),
            mimeType: v.string(),
        }))),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Verify the reply target exists
        const replyTarget = await ctx.db.get(args.replyToId);
        if (!replyTarget) throw new Error("Reply target message not found");
        if (replyTarget.conversationId !== args.conversationId) {
            throw new Error("Reply target is not in this conversation");
        }

        // Create the message with reply reference
        const messageId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            senderId: args.senderId,
            content: args.content,
            attachments: args.attachments || [],
            replyToId: args.replyToId,
            readBy: [{ userId: args.senderId, readAt: now }],
            createdAt: now,
        });

        // Update conversation with last message info
        const conversation = await ctx.db.get(args.conversationId);
        if (conversation) {
            const unreadCounts = { ...(conversation.unreadCounts as Record<string, number>) };
            conversation.participants.forEach((p) => {
                if (p.userId !== args.senderId) {
                    unreadCounts[p.userId] = (unreadCounts[p.userId] || 0) + 1;
                }
            });

            await ctx.db.patch(args.conversationId, {
                lastMessageAt: now,
                lastMessagePreview: args.content.substring(0, 100),
                unreadCounts,
                updatedAt: now,
            });
        }

        return messageId;
    },
});

// Find or create a conversation with a tenant
export const findOrCreateConversation = mutation({
    args: {
        organizationId: v.id("organizations"),
        tenantId: v.id("tenants"),
        senderId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Check if conversation already exists with this tenant
        const existingConversations = await ctx.db
            .query("conversations")
            .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
            .collect();

        const existing = existingConversations.find(
            (c) => c.tenantId === args.tenantId && c.status === "active"
        );

        if (existing) {
            return existing._id;
        }

        // Get tenant details
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error("Tenant not found");

        const sender = await ctx.db.get(args.senderId);
        if (!sender) throw new Error("Sender not found");

        const now = Date.now();

        // Create new conversation
        const conversationId = await ctx.db.insert("conversations", {
            organizationId: args.organizationId,
            participants: [
                {
                    userId: args.senderId,
                    role: "owner",
                    name: `${sender.firstName || ""} ${sender.lastName || ""}`.trim() || "Owner",
                },
            ],
            tenantId: args.tenantId,
            propertyId: tenant.propertyId,
            unitId: tenant.unitId,
            lastMessageAt: now,
            lastMessagePreview: "",
            unreadCounts: {},
            status: "active",
            createdAt: now,
            updatedAt: now,
        });

        return conversationId;
    },
});
