import { v } from "convex/values";
import { query } from "../_generated/server";

// List all conversations for the organization
export const listConversations = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        filter: v.optional(v.union(
            v.literal("all"),
            v.literal("unread"),
            v.literal("tenants"),
            v.literal("applicants"),
            v.literal("vendors")
        )),
        searchQuery: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let conversations;

        if (args.organizationId) {
            const orgId = args.organizationId;
            conversations = await ctx.db
                .query("conversations")
                .withIndex("by_org", (q) => q.eq("organizationId", orgId))
                .order("desc")
                .collect();
        } else {
            conversations = await ctx.db.query("conversations").order("desc").collect();
        }

        // Filter by type based on participant roles
        if (args.filter && args.filter !== "all") {
            conversations = conversations.filter((conv) => {
                if (args.filter === "unread") {
                    // Check if any unread count > 0
                    const counts = conv.unreadCounts as Record<string, number>;
                    return Object.values(counts).some((c) => c > 0);
                }
                // Filter by participant role
                return conv.participants.some((p) => {
                    if (args.filter === "tenants") return p.role === "tenant";
                    if (args.filter === "applicants") return p.role === "applicant";
                    if (args.filter === "vendors") return p.role === "vendor";
                    return true;
                });
            });
        }

        // Search by participant name or message preview
        if (args.searchQuery && args.searchQuery.trim()) {
            const query = args.searchQuery.toLowerCase();
            conversations = conversations.filter((conv) =>
                conv.participants.some((p) => p.name.toLowerCase().includes(query)) ||
                conv.lastMessagePreview.toLowerCase().includes(query)
            );
        }

        // Get additional details for each conversation
        const conversationsWithDetails = await Promise.all(
            conversations.map(async (conv) => {
                const tenant = conv.tenantId ? await ctx.db.get(conv.tenantId) : null;
                const property = conv.propertyId ? await ctx.db.get(conv.propertyId) : null;
                const unit = conv.unitId ? await ctx.db.get(conv.unitId) : null;

                return {
                    ...conv,
                    tenant: tenant ? {
                        firstName: tenant.firstName,
                        lastName: tenant.lastName,
                    } : null,
                    property: property ? { name: property.name } : null,
                    unit: unit ? { unitNumber: unit.unitNumber } : null,
                };
            })
        );

        return conversationsWithDetails;
    },
});

// Get a single conversation with its messages
export const getConversation = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) return null;

        const tenant = conversation.tenantId
            ? await ctx.db.get(conversation.tenantId)
            : null;
        const property = conversation.propertyId
            ? await ctx.db.get(conversation.propertyId)
            : null;
        const unit = conversation.unitId
            ? await ctx.db.get(conversation.unitId)
            : null;

        return {
            ...conversation,
            tenant,
            property,
            unit,
        };
    },
});

// Get messages for a conversation
export const getConversationMessages = query({
    args: {
        conversationId: v.id("conversations"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 50;

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .order("asc")
            .take(limit);

        // Get sender details and reply target for each message
        const messagesWithDetails = await Promise.all(
            messages.map(async (msg) => {
                const sender = await ctx.db.get(msg.senderId);
                
                // Get reply target if exists
                let replyTo = null;
                if (msg.replyToId) {
                    const replyMsg = await ctx.db.get(msg.replyToId);
                    if (replyMsg) {
                        const replySender = await ctx.db.get(replyMsg.senderId);
                        replyTo = {
                            _id: replyMsg._id,
                            content: replyMsg.isDeleted ? "This message was deleted" : replyMsg.content.substring(0, 100),
                            senderName: replySender 
                                ? `${replySender.firstName || ""} ${replySender.lastName || ""}`.trim() 
                                : "Unknown",
                        };
                    }
                }

                // Get user details for reactions
                const reactionsWithUsers = msg.reactions 
                    ? await Promise.all(msg.reactions.map(async (r) => {
                        const user = await ctx.db.get(r.userId);
                        return {
                            ...r,
                            userName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown",
                        };
                    }))
                    : [];

                return {
                    ...msg,
                    sender: sender ? {
                        _id: sender._id,
                        firstName: sender.firstName,
                        lastName: sender.lastName,
                        imageUrl: sender.imageUrl,
                    } : null,
                    replyTo,
                    reactions: reactionsWithUsers,
                };
            })
        );

        return messagesWithDetails;
    },
});

// Get unread count for the organization
export const getUnreadCount = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        let conversations;

        if (args.organizationId) {
            const orgId = args.organizationId;
            conversations = await ctx.db
                .query("conversations")
                .withIndex("by_org", (q) => q.eq("organizationId", orgId))
                .collect();
        } else {
            conversations = await ctx.db.query("conversations").collect();
        }

        let totalUnread = 0;
        conversations.forEach((conv) => {
            const counts = conv.unreadCounts as Record<string, number>;
            totalUnread += Object.values(counts).reduce((sum, c) => sum + c, 0);
        });

        return totalUnread;
    },
});

// Get message stats
export const getMessageStats = query({
    args: { organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        let conversations;

        if (args.organizationId) {
            const orgId = args.organizationId;
            conversations = await ctx.db
                .query("conversations")
                .withIndex("by_org", (q) => q.eq("organizationId", orgId))
                .collect();
        } else {
            conversations = await ctx.db.query("conversations").collect();
        }

        let totalUnread = 0;
        let tenantConvs = 0;
        let applicantConvs = 0;
        let vendorConvs = 0;

        conversations.forEach((conv) => {
            const counts = conv.unreadCounts as Record<string, number>;
            totalUnread += Object.values(counts).reduce((sum, c) => sum + c, 0);

            conv.participants.forEach((p) => {
                if (p.role === "tenant") tenantConvs++;
                if (p.role === "applicant") applicantConvs++;
                if (p.role === "vendor") vendorConvs++;
            });
        });

        return {
            total: conversations.length,
            unread: totalUnread,
            tenants: tenantConvs,
            applicants: applicantConvs,
            vendors: vendorConvs,
        };
    },
});
