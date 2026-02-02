import { query } from "../_generated/server";
import { v } from "convex/values";

// Get an invite by code
export const getInviteByCode = query({
    args: { inviteCode: v.string() },
    handler: async (ctx, args) => {
        const invite = await ctx.db
            .query("applicationInvites")
            .withIndex("by_code", (q) => q.eq("inviteCode", args.inviteCode))
            .first();

        if (!invite) return null;

        // Check if expired
        const isExpired = Date.now() > invite.expiresAt;

        // Get listing info if available
        let listing = null;
        let property = null;
        let unit = null;

        if (invite.listingId) {
            listing = await ctx.db.get(invite.listingId);
            if (listing) {
                unit = await ctx.db.get(listing.unitId);
                property = unit ? await ctx.db.get(unit.propertyId) : null;
            }
        }

        // Get organization info
        const organization = await ctx.db.get(invite.organizationId);

        return {
            ...invite,
            isExpired,
            listing,
            unit,
            property,
            organization,
        };
    },
});

// List invites for an organization
export const listInvites = query({
    args: { 
        organizationId: v.optional(v.id("organizations")),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let invites;

        if (args.organizationId) {
            if (args.status) {
                invites = await ctx.db
                    .query("applicationInvites")
                    .withIndex("by_status", (q) => 
                        q.eq("organizationId", args.organizationId)
                         .eq("status", args.status as any)
                    )
                    .order("desc")
                    .collect();
            } else {
                invites = await ctx.db
                    .query("applicationInvites")
                    .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
                    .order("desc")
                    .collect();
            }
        } else {
            invites = await ctx.db
                .query("applicationInvites")
                .order("desc")
                .collect();
        }

        return invites;
    },
});
