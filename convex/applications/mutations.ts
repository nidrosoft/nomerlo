import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create a new application (public - from listing apply page)
export const createApplication = mutation({
    args: {
        listingId: v.id("listings"),
        // Applicant info
        applicant: v.object({
            firstName: v.string(),
            lastName: v.string(),
            email: v.string(),
            phone: v.string(),
            dateOfBirth: v.number(),
        }),
        // Current residence
        currentAddress: v.object({
            street: v.string(),
            city: v.string(),
            state: v.string(),
            zip: v.string(),
            moveInDate: v.number(),
            rent: v.number(),
            landlordName: v.optional(v.string()),
            landlordPhone: v.optional(v.string()),
        }),
        // Employment
        employment: v.object({
            status: v.union(
                v.literal("employed"),
                v.literal("self_employed"),
                v.literal("unemployed"),
                v.literal("retired"),
                v.literal("student")
            ),
            employer: v.optional(v.string()),
            position: v.optional(v.string()),
            income: v.number(),
            startDate: v.optional(v.number()),
            supervisorName: v.optional(v.string()),
            supervisorPhone: v.optional(v.string()),
        }),
        // Additional info
        occupants: v.array(v.object({
            name: v.string(),
            relationship: v.string(),
            age: v.number(),
        })),
        pets: v.array(v.object({
            type: v.string(),
            breed: v.string(),
            weight: v.number(),
        })),
        vehicles: v.array(v.object({
            make: v.string(),
            model: v.string(),
            year: v.number(),
            licensePlate: v.string(),
        })),
        // Emergency contact
        emergencyContact: v.object({
            name: v.string(),
            relationship: v.string(),
            phone: v.string(),
        }),
        // Move-in details
        desiredMoveIn: v.number(),
        desiredLeaseTerm: v.string(),
        // Application fee
        applicationFee: v.number(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Get the listing to get organizationId and unitId
        const listing = await ctx.db.get(args.listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        // Create the application
        const applicationId = await ctx.db.insert("applications", {
            organizationId: listing.organizationId,
            listingId: args.listingId,
            unitId: listing.unitId,
            applicantUserId: undefined,
            applicant: {
                ...args.applicant,
                ssn: undefined, // Not collecting SSN in initial form
            },
            currentAddress: args.currentAddress,
            employment: args.employment,
            occupants: args.occupants,
            pets: args.pets,
            vehicles: args.vehicles,
            emergencyContact: args.emergencyContact,
            desiredMoveIn: args.desiredMoveIn,
            desiredLeaseTerm: args.desiredLeaseTerm,
            screeningStatus: "pending",
            screeningReportId: undefined,
            creditScore: undefined,
            backgroundCheckPassed: undefined,
            evictionCheckPassed: undefined,
            status: "submitted",
            internalNotes: undefined,
            decisionReason: undefined,
            applicationFee: args.applicationFee,
            applicationFeePaid: false, // Will be updated after payment
            stripePaymentIntentId: undefined,
            submittedAt: now,
            reviewedAt: undefined,
            decidedAt: undefined,
            createdAt: now,
            updatedAt: now,
        });

        // Update listing application count
        await ctx.db.patch(args.listingId, {
            applicationCount: (listing.applicationCount || 0) + 1,
            updatedAt: now,
        });

        return { applicationId };
    },
});

// Update application status
export const updateStatus = mutation({
    args: {
        applicationId: v.id("applications"),
        status: v.union(
            v.literal("submitted"),
            v.literal("under_review"),
            v.literal("screening"),
            v.literal("approved"),
            v.literal("conditionally_approved"),
            v.literal("denied"),
            v.literal("withdrawn"),
            v.literal("expired")
        ),
        reason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const application = await ctx.db.get(args.applicationId);
        if (!application) {
            throw new Error("Application not found");
        }

        const now = Date.now();
        const updateData: Record<string, unknown> = {
            status: args.status,
            updatedAt: now,
        };

        // Track review and decision times
        if (args.status === "under_review" && !application.reviewedAt) {
            updateData.reviewedAt = now;
        }

        if (["approved", "conditionally_approved", "denied"].includes(args.status)) {
            updateData.decidedAt = now;
            if (args.reason) {
                updateData.decisionReason = args.reason;
            }
        }

        await ctx.db.patch(args.applicationId, updateData);

        return { success: true };
    },
});

// Approve application
export const approveApplication = mutation({
    args: {
        applicationId: v.id("applications"),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const application = await ctx.db.get(args.applicationId);
        if (!application) {
            throw new Error("Application not found");
        }

        const now = Date.now();

        await ctx.db.patch(args.applicationId, {
            status: "approved",
            decidedAt: now,
            decisionReason: args.notes || "Application approved",
            updatedAt: now,
        });

        // TODO: Trigger lease creation workflow
        // TODO: Send approval notification to applicant

        return { success: true };
    },
});

// Deny application
export const denyApplication = mutation({
    args: {
        applicationId: v.id("applications"),
        reason: v.string(),
    },
    handler: async (ctx, args) => {
        const application = await ctx.db.get(args.applicationId);
        if (!application) {
            throw new Error("Application not found");
        }

        const now = Date.now();

        await ctx.db.patch(args.applicationId, {
            status: "denied",
            decidedAt: now,
            decisionReason: args.reason,
            updatedAt: now,
        });

        // TODO: Send denial notification to applicant

        return { success: true };
    },
});

// Add internal note
export const addInternalNote = mutation({
    args: {
        applicationId: v.id("applications"),
        note: v.string(),
    },
    handler: async (ctx, args) => {
        const application = await ctx.db.get(args.applicationId);
        if (!application) {
            throw new Error("Application not found");
        }

        const existingNotes = application.internalNotes || "";
        const timestamp = new Date().toISOString();
        const newNote = `[${timestamp}] ${args.note}`;
        const updatedNotes = existingNotes ? `${existingNotes}\n\n${newNote}` : newNote;

        await ctx.db.patch(args.applicationId, {
            internalNotes: updatedNotes,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Run screening (mock for now)
export const runScreening = mutation({
    args: {
        applicationId: v.id("applications"),
        packageType: v.union(
            v.literal("comprehensive"),
            v.literal("basic"),
            v.literal("credit_only")
        ),
    },
    handler: async (ctx, args) => {
        const application = await ctx.db.get(args.applicationId);
        if (!application) {
            throw new Error("Application not found");
        }

        const now = Date.now();

        // Update to screening status
        await ctx.db.patch(args.applicationId, {
            status: "screening",
            screeningStatus: "in_progress",
            updatedAt: now,
        });

        // TODO: Integrate with TransUnion SmartMove / Plaid
        // For now, we'll simulate screening results after a delay
        // In production, this would be handled by a webhook

        // Mock: Auto-complete screening with random results
        const mockCreditScore = Math.floor(Math.random() * 200) + 600; // 600-800
        const mockBackgroundPassed = Math.random() > 0.1; // 90% pass
        const mockEvictionPassed = Math.random() > 0.05; // 95% pass

        await ctx.db.patch(args.applicationId, {
            screeningStatus: "completed",
            creditScore: mockCreditScore,
            backgroundCheckPassed: mockBackgroundPassed,
            evictionCheckPassed: mockEvictionPassed,
            status: "under_review",
            updatedAt: Date.now(),
        });

        return { 
            success: true,
            creditScore: mockCreditScore,
            backgroundCheckPassed: mockBackgroundPassed,
            evictionCheckPassed: mockEvictionPassed,
        };
    },
});

// Mark application fee as paid
export const markFeePaid = mutation({
    args: {
        applicationId: v.id("applications"),
        stripePaymentIntentId: v.string(),
    },
    handler: async (ctx, args) => {
        const application = await ctx.db.get(args.applicationId);
        if (!application) {
            throw new Error("Application not found");
        }

        await ctx.db.patch(args.applicationId, {
            applicationFeePaid: true,
            stripePaymentIntentId: args.stripePaymentIntentId,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Withdraw application (by applicant)
export const withdrawApplication = mutation({
    args: { applicationId: v.id("applications") },
    handler: async (ctx, args) => {
        const application = await ctx.db.get(args.applicationId);
        if (!application) {
            throw new Error("Application not found");
        }

        await ctx.db.patch(args.applicationId, {
            status: "withdrawn",
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// ════════════════════════════════════════════════════════════════════
// INVITE MUTATIONS
// ════════════════════════════════════════════════════════════════════

// Create an application invite
export const createInvite = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        message: v.optional(v.string()),
        expiresInDays: v.number(),
        listingId: v.optional(v.id("listings")),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Generate a unique invite code
        const inviteCode = `INV-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();

        // Calculate expiration
        const expiresAt = now + (args.expiresInDays * 24 * 60 * 60 * 1000);

        // Get listing to get organization ID if provided
        let organizationId: any;
        if (args.listingId) {
            const listing = await ctx.db.get(args.listingId);
            if (listing) {
                organizationId = listing.organizationId;
            }
        }

        // If no organizationId from listing, get from current user's org
        if (!organizationId) {
            // For now, get the first org (in production, get from auth context)
            const orgs = await ctx.db.query("organizations").take(1);
            if (orgs.length > 0) {
                organizationId = orgs[0]._id;
            } else {
                throw new Error("No organization found");
            }
        }

        // Create the invite
        const inviteId = await ctx.db.insert("applicationInvites", {
            organizationId,
            inviteCode,
            email: args.email,
            firstName: args.firstName,
            lastName: args.lastName,
            message: args.message,
            listingId: args.listingId,
            expiresAt,
            status: "pending",
            resultingApplicationId: undefined,
            openedAt: undefined,
            completedAt: undefined,
            createdBy: undefined, // Would be set from auth context
            createdAt: now,
            updatedAt: now,
        });

        return { 
            inviteId, 
            inviteCode,
            inviteLink: `/apply/invite/${inviteCode}`,
        };
    },
});

// Mark invite as opened
export const markInviteOpened = mutation({
    args: { inviteCode: v.string() },
    handler: async (ctx, args) => {
        const invite = await ctx.db
            .query("applicationInvites")
            .withIndex("by_code", (q) => q.eq("inviteCode", args.inviteCode))
            .first();

        if (!invite) {
            throw new Error("Invite not found");
        }

        if (invite.status === "expired" || Date.now() > invite.expiresAt) {
            await ctx.db.patch(invite._id, { status: "expired", updatedAt: Date.now() });
            throw new Error("Invite has expired");
        }

        if (invite.status === "pending") {
            await ctx.db.patch(invite._id, {
                status: "opened",
                openedAt: Date.now(),
                updatedAt: Date.now(),
            });
        }

        return { success: true, invite };
    },
});

// Mark invite as completed (when application is submitted)
export const markInviteCompleted = mutation({
    args: { 
        inviteCode: v.string(),
        applicationId: v.id("applications"),
    },
    handler: async (ctx, args) => {
        const invite = await ctx.db
            .query("applicationInvites")
            .withIndex("by_code", (q) => q.eq("inviteCode", args.inviteCode))
            .first();

        if (!invite) {
            throw new Error("Invite not found");
        }

        await ctx.db.patch(invite._id, {
            status: "completed",
            resultingApplicationId: args.applicationId,
            completedAt: Date.now(),
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// ════════════════════════════════════════════════════════════════════
// MANUAL APPLICATION CREATION (Owner adding applicant)
// ════════════════════════════════════════════════════════════════════

// Manually add an applicant from the dashboard
export const addApplicantManually = mutation({
    args: {
        // Applicant info
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        phone: v.string(),
        dateOfBirth: v.optional(v.string()),
        // Property/Unit
        listingId: v.id("listings"),
        // Application details
        income: v.number(),
        employer: v.optional(v.string()),
        desiredMoveIn: v.number(),
        leaseTerm: v.string(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Get the listing
        const listing = await ctx.db.get(args.listingId);
        if (!listing) {
            throw new Error("Listing not found");
        }

        // Create minimal application record
        const applicationId = await ctx.db.insert("applications", {
            organizationId: listing.organizationId,
            listingId: args.listingId,
            unitId: listing.unitId,
            applicantUserId: undefined,
            applicant: {
                firstName: args.firstName,
                lastName: args.lastName,
                email: args.email,
                phone: args.phone,
                dateOfBirth: args.dateOfBirth ? new Date(args.dateOfBirth).getTime() : now,
                ssn: undefined,
            },
            // Minimal current address (manually added = no prior address)
            currentAddress: {
                street: "Not provided (manual entry)",
                city: "N/A",
                state: "N/A",
                zip: "00000",
                moveInDate: now,
                rent: 0,
                landlordName: undefined,
                landlordPhone: undefined,
            },
            // Employment
            employment: {
                status: "employed",
                employer: args.employer,
                position: undefined,
                income: args.income,
                startDate: undefined,
                supervisorName: undefined,
                supervisorPhone: undefined,
            },
            // Empty additional info
            occupants: [],
            pets: [],
            vehicles: [],
            // Empty emergency contact
            emergencyContact: {
                name: "Not provided",
                relationship: "N/A",
                phone: "N/A",
            },
            // Move-in details
            desiredMoveIn: args.desiredMoveIn,
            desiredLeaseTerm: args.leaseTerm,
            // Screening
            screeningStatus: "pending",
            screeningReportId: undefined,
            creditScore: undefined,
            backgroundCheckPassed: undefined,
            evictionCheckPassed: undefined,
            // Status - mark as under_review since manually added
            status: "under_review",
            internalNotes: args.notes ? `[${new Date().toISOString()}] Added manually by owner:\n${args.notes}` : `[${new Date().toISOString()}] Added manually by owner`,
            decisionReason: undefined,
            // Payment - waived for manual entries
            applicationFee: 0,
            applicationFeePaid: true,
            stripePaymentIntentId: undefined,
            // Timestamps
            submittedAt: now,
            reviewedAt: now,
            decidedAt: undefined,
            createdAt: now,
            updatedAt: now,
        });

        // Update listing application count
        await ctx.db.patch(args.listingId, {
            applicationCount: (listing.applicationCount || 0) + 1,
            updatedAt: now,
        });

        return { applicationId };
    },
});
