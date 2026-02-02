import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // ════════════════════════════════════════════════════════════════════
    // USER & AUTHENTICATION
    // ════════════════════════════════════════════════════════════════════

    users: defineTable({
        // Clerk integration
        clerkId: v.string(),
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        phone: v.optional(v.string()),

        // Platform role
        role: v.union(
            v.literal("super_admin"),
            v.literal("owner"),
            v.literal("tenant"),
            v.literal("maintenance"),
            v.literal("staff")
        ),

        // Status
        status: v.union(
            v.literal("active"),
            v.literal("inactive"),
            v.literal("suspended")
        ),

        // Metadata
        lastLoginAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clerk_id", ["clerkId"])
        .index("by_email", ["email"])
        .index("by_role", ["role"]),

    // ════════════════════════════════════════════════════════════════════
    // ORGANIZATION (Owner/Landlord Accounts)
    // ════════════════════════════════════════════════════════════════════

    organizations: defineTable({
        // Basic info
        name: v.string(),
        slug: v.string(), // URL-friendly identifier
        type: v.union(
            v.literal("individual"),    // Solo landlord
            v.literal("business"),      // Business entity
            v.literal("property_manager") // PM company
        ),

        // Contact
        email: v.string(),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),

        // Address
        address: v.optional(v.object({
            street: v.string(),
            unit: v.optional(v.string()),
            city: v.string(),
            state: v.string(),
            zip: v.string(),
            country: v.string(),
        })),

        // Branding
        logoUrl: v.optional(v.string()),
        brandColor: v.optional(v.string()),

        // Settings
        settings: v.object({
            timezone: v.string(),
            currency: v.string(),
            locale: v.string(),
            lateFeeDays: v.number(),
            lateFeeAmount: v.number(),
            lateFeeType: v.union(v.literal("fixed"), v.literal("percentage")),
        }),

        // Subscription
        subscriptionId: v.optional(v.id("subscriptions")),
        stripeCustomerId: v.optional(v.string()),

        // Status
        status: v.union(
            v.literal("onboarding"),
            v.literal("active"),
            v.literal("suspended"),
            v.literal("cancelled")
        ),

        onboardingStep: v.optional(v.string()),
        verifiedAt: v.optional(v.number()),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_slug", ["slug"])
        .index("by_status", ["status"])
        .index("by_stripe_customer", ["stripeCustomerId"]),

    organizationMembers: defineTable({
        organizationId: v.id("organizations"),
        userId: v.id("users"),
        role: v.union(
            v.literal("owner"),
            v.literal("property_manager"),
            v.literal("staff")
        ),

        // For property managers - which properties they can access
        propertyIds: v.optional(v.array(v.id("properties"))),

        status: v.union(
            v.literal("active"),
            v.literal("invited"),
            v.literal("inactive")
        ),
        invitedAt: v.optional(v.number()),
        joinedAt: v.optional(v.number()),
        createdAt: v.number(),
    })
        .index("by_user_org", ["userId", "organizationId"])
        .index("by_org", ["organizationId"])
        .index("by_user", ["userId"]),

    // ════════════════════════════════════════════════════════════════════
    // PROPERTIES & UNITS
    // ════════════════════════════════════════════════════════════════════

    properties: defineTable({
        organizationId: v.id("organizations"),

        // Basic info
        name: v.string(),
        type: v.union(
            v.literal("single_family"),
            v.literal("multi_family"),
            v.literal("apartment"),
            v.literal("condo"),
            v.literal("townhouse"),
            v.literal("commercial"),
            v.literal("mixed_use")
        ),

        // Address
        address: v.object({
            street: v.string(),
            unit: v.optional(v.string()),
            city: v.string(),
            state: v.string(),
            zip: v.string(),
            country: v.string(),
            latitude: v.optional(v.number()),
            longitude: v.optional(v.number()),
        }),

        // Details
        yearBuilt: v.optional(v.number()),
        totalUnits: v.number(),
        totalSqft: v.optional(v.number()),
        lotSize: v.optional(v.number()),
        parkingSpaces: v.optional(v.number()),

        // Images
        images: v.array(v.object({
            url: v.string(),
            storageId: v.optional(v.id("_storage")),
            caption: v.optional(v.string()),
            isPrimary: v.boolean(),
        })),

        // Features
        amenities: v.array(v.string()),

        // Status
        status: v.union(
            v.literal("active"),
            v.literal("inactive"),
            v.literal("archived")
        ),

        // Financials (aggregated)
        purchasePrice: v.optional(v.number()),
        purchaseDate: v.optional(v.number()),
        currentValue: v.optional(v.number()),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_org_status", ["organizationId", "status"])
        .searchIndex("search_address", {
            searchField: "address.city",
            filterFields: ["organizationId", "status"],
        }),

    units: defineTable({
        organizationId: v.id("organizations"),
        propertyId: v.id("properties"),

        // Basic info
        unitNumber: v.string(),
        name: v.optional(v.string()), // e.g., "Unit 4B" or "The Garden Suite"

        // Details
        bedrooms: v.number(),
        bathrooms: v.number(),
        sqft: v.optional(v.number()),
        floor: v.optional(v.number()),

        // Features
        features: v.array(v.string()), // ["In-unit laundry", "Balcony", "Fireplace"]

        // Rental info
        marketRent: v.number(),
        depositAmount: v.optional(v.number()),

        // Images
        images: v.array(v.object({
            url: v.string(),
            storageId: v.optional(v.id("_storage")),
            caption: v.optional(v.string()),
            isPrimary: v.boolean(),
        })),

        // Status
        status: v.union(
            v.literal("vacant"),
            v.literal("occupied"),
            v.literal("maintenance"),
            v.literal("offline")
        ),

        // Current occupancy
        currentLeaseId: v.optional(v.id("leases")),
        currentTenantId: v.optional(v.id("tenants")),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_property", ["propertyId"])
        .index("by_status", ["organizationId", "status"]),

    // ════════════════════════════════════════════════════════════════════
    // LISTINGS (Marketplace)
    // ════════════════════════════════════════════════════════════════════

    listings: defineTable({
        organizationId: v.id("organizations"),
        propertyId: v.id("properties"),
        unitId: v.id("units"),

        // Listing details
        title: v.string(),
        description: v.string(),
        rentAmount: v.number(),
        depositAmount: v.number(),

        // Availability
        availableDate: v.number(),
        leaseTerm: v.union(
            v.literal("month_to_month"),
            v.literal("6_months"),
            v.literal("12_months"),
            v.literal("24_months"),
            v.literal("flexible")
        ),

        // Requirements
        requirements: v.object({
            minCreditScore: v.optional(v.number()),
            minIncome: v.optional(v.number()), // Multiple of rent
            petsAllowed: v.boolean(),
            petTypes: v.optional(v.array(v.string())),
            petDeposit: v.optional(v.number()),
            smokingAllowed: v.boolean(),
            maxOccupants: v.optional(v.number()),
        }),

        // Utilities
        utilities: v.object({
            included: v.array(v.string()), // ["water", "trash"]
            tenantPays: v.array(v.string()), // ["electric", "gas", "internet"]
        }),

        // SEO/Search
        slug: v.string(),
        keywords: v.array(v.string()),

        // Status
        status: v.union(
            v.literal("draft"),
            v.literal("active"),
            v.literal("paused"),
            v.literal("rented"),
            v.literal("expired")
        ),

        // Analytics
        viewCount: v.number(),
        inquiryCount: v.number(),
        applicationCount: v.number(),

        // Syndication
        syndicateTo: v.array(v.string()), // ["zillow", "apartments.com"]

        // Verification (fraud prevention)
        verificationStatus: v.union(
            v.literal("pending"),
            v.literal("verified"),
            v.literal("rejected")
        ),
        verifiedAt: v.optional(v.number()),

        publishedAt: v.optional(v.number()),
        expiresAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_unit", ["unitId"])
        .index("by_status", ["status"])
        .index("by_slug", ["slug"])
        .searchIndex("search_listings", {
            searchField: "title",
            filterFields: ["status"],
        }),

    // ════════════════════════════════════════════════════════════════════
    // APPLICATIONS
    // ════════════════════════════════════════════════════════════════════

    applications: defineTable({
        organizationId: v.id("organizations"),
        listingId: v.id("listings"),
        unitId: v.id("units"),

        // Applicant info (may not have account yet)
        applicantUserId: v.optional(v.id("users")),
        applicant: v.object({
            firstName: v.string(),
            lastName: v.string(),
            email: v.string(),
            phone: v.string(),
            dateOfBirth: v.number(),
            ssn: v.optional(v.string()), // Encrypted
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

        // Screening
        screeningStatus: v.union(
            v.literal("pending"),
            v.literal("in_progress"),
            v.literal("completed"),
            v.literal("failed")
        ),
        screeningReportId: v.optional(v.string()),
        creditScore: v.optional(v.number()),
        backgroundCheckPassed: v.optional(v.boolean()),
        evictionCheckPassed: v.optional(v.boolean()),

        // Status
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

        // Notes
        internalNotes: v.optional(v.string()),
        decisionReason: v.optional(v.string()),

        // Fee
        applicationFee: v.number(),
        applicationFeePaid: v.boolean(),
        stripePaymentIntentId: v.optional(v.string()),

        submittedAt: v.number(),
        reviewedAt: v.optional(v.number()),
        decidedAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_listing", ["listingId"])
        .index("by_status", ["organizationId", "status"])
        .index("by_applicant_email", ["applicant.email"]),

    // ════════════════════════════════════════════════════════════════════
    // TENANTS
    // ════════════════════════════════════════════════════════════════════

    tenants: defineTable({
        organizationId: v.id("organizations"),
        userId: v.optional(v.id("users")), // Linked when tenant creates account

        // Personal info
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        phone: v.string(),
        dateOfBirth: v.optional(v.number()),

        // Current residence
        unitId: v.id("units"),
        propertyId: v.id("properties"),
        leaseId: v.optional(v.id("leases")),

        // Emergency contacts
        emergencyContacts: v.array(v.object({
            name: v.string(),
            relationship: v.string(),
            phone: v.string(),
            email: v.optional(v.string()),
        })),

        // Vehicles
        vehicles: v.array(v.object({
            make: v.string(),
            model: v.string(),
            year: v.number(),
            color: v.string(),
            licensePlate: v.string(),
            state: v.string(),
        })),

        // Portal access
        portalStatus: v.union(
            v.literal("invited"),
            v.literal("active"),
            v.literal("disabled")
        ),
        inviteCode: v.optional(v.string()),
        invitedAt: v.optional(v.number()),
        activatedAt: v.optional(v.number()),
        lastLoginAt: v.optional(v.number()),

        // Payment
        preferredPaymentMethodId: v.optional(v.string()),
        autopayEnabled: v.boolean(),

        // Status
        status: v.union(
            v.literal("applicant"),
            v.literal("current"),
            v.literal("past"),
            v.literal("evicted")
        ),

        moveInDate: v.optional(v.number()),
        moveOutDate: v.optional(v.number()),

        // Balance
        currentBalance: v.number(), // Positive = owes money, negative = credit

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_user", ["userId"])
        .index("by_unit", ["unitId"])
        .index("by_email", ["organizationId", "email"])
        .index("by_invite_code", ["inviteCode"])
        .index("by_status", ["organizationId", "status"]),

    // ════════════════════════════════════════════════════════════════════
    // LEASES
    // ════════════════════════════════════════════════════════════════════

    leases: defineTable({
        organizationId: v.id("organizations"),
        propertyId: v.id("properties"),
        unitId: v.id("units"),
        tenantId: v.id("tenants"),

        // Lease terms
        type: v.union(
            v.literal("fixed"),
            v.literal("month_to_month")
        ),
        startDate: v.number(),
        endDate: v.number(),

        // Rent
        rentAmount: v.number(),
        rentDueDay: v.number(), // 1-28

        // Deposits
        securityDeposit: v.number(),
        petDeposit: v.optional(v.number()),
        otherDeposits: v.optional(v.array(v.object({
            name: v.string(),
            amount: v.number(),
        }))),

        // Late fees
        lateFeeGraceDays: v.number(),
        lateFeeAmount: v.number(),
        lateFeeType: v.union(v.literal("fixed"), v.literal("percentage")),

        // Document
        documentStorageId: v.optional(v.id("_storage")),
        documentUrl: v.optional(v.string()),

        // Signatures
        signatures: v.object({
            landlord: v.optional(v.object({
                signedAt: v.number(),
                signedBy: v.string(),
                ipAddress: v.optional(v.string()),
            })),
            tenant: v.optional(v.object({
                signedAt: v.number(),
                signedBy: v.string(),
                ipAddress: v.optional(v.string()),
            })),
        }),

        // Status
        status: v.union(
            v.literal("draft"),
            v.literal("pending_signatures"),
            v.literal("active"),
            v.literal("expired"),
            v.literal("terminated"),
            v.literal("renewed")
        ),

        // Renewal
        renewalStatus: v.optional(v.union(
            v.literal("pending"),
            v.literal("offered"),
            v.literal("accepted"),
            v.literal("declined")
        )),
        renewalLeaseId: v.optional(v.id("leases")),

        // Terms and conditions
        specialTerms: v.optional(v.string()),

        terminatedAt: v.optional(v.number()),
        terminationReason: v.optional(v.string()),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_unit", ["unitId"])
        .index("by_tenant", ["tenantId"])
        .index("by_status", ["organizationId", "status"]),

    // ════════════════════════════════════════════════════════════════════
    // PAYMENTS & BILLING
    // ════════════════════════════════════════════════════════════════════

    payments: defineTable({
        organizationId: v.id("organizations"),
        tenantId: v.id("tenants"),
        leaseId: v.id("leases"),
        unitId: v.id("units"),

        // Payment details
        type: v.union(
            v.literal("rent"),
            v.literal("deposit"),
            v.literal("late_fee"),
            v.literal("utility"),
            v.literal("maintenance"),
            v.literal("other")
        ),

        amount: v.number(),
        description: v.string(),

        // Due date tracking
        dueDate: v.number(),

        // Status
        status: v.union(
            v.literal("pending"),
            v.literal("processing"),
            v.literal("completed"),
            v.literal("failed"),
            v.literal("refunded"),
            v.literal("cancelled")
        ),

        // Stripe
        stripePaymentIntentId: v.optional(v.string()),
        stripeChargeId: v.optional(v.string()),
        paymentMethodType: v.optional(v.string()), // "ach", "card"
        paymentMethodLast4: v.optional(v.string()),

        // Processing
        processingFee: v.optional(v.number()),
        netAmount: v.optional(v.number()),

        // Timestamps
        paidAt: v.optional(v.number()),
        failedAt: v.optional(v.number()),
        failureReason: v.optional(v.string()),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_tenant", ["tenantId"])
        .index("by_lease", ["leaseId"])
        .index("by_due_date", ["organizationId", "dueDate"]),

    invoices: defineTable({
        organizationId: v.id("organizations"),
        tenantId: v.id("tenants"),
        leaseId: v.id("leases"),

        // Invoice details
        invoiceNumber: v.string(),

        // Line items
        lineItems: v.array(v.object({
            description: v.string(),
            amount: v.number(),
            type: v.string(),
        })),

        subtotal: v.number(),
        tax: v.optional(v.number()),
        total: v.number(),
        amountPaid: v.number(),
        amountDue: v.number(),

        // Dates
        issueDate: v.number(),
        dueDate: v.number(),

        // Status
        status: v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("viewed"),
            v.literal("paid"),
            v.literal("partial"),
            v.literal("overdue"),
            v.literal("cancelled")
        ),

        // Payment link
        paymentLink: v.optional(v.string()),

        // Notifications
        lastReminderAt: v.optional(v.number()),
        reminderCount: v.number(),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_tenant", ["tenantId"])
        .index("by_status", ["organizationId", "status"])
        .index("by_invoice_number", ["organizationId", "invoiceNumber"]),

    // ════════════════════════════════════════════════════════════════════
    // MAINTENANCE
    // ════════════════════════════════════════════════════════════════════

    maintenanceRequests: defineTable({
        organizationId: v.id("organizations"),
        propertyId: v.id("properties"),
        unitId: v.id("units"),
        tenantId: v.optional(v.id("tenants")),

        // Request details
        title: v.string(),
        description: v.string(),
        category: v.union(
            v.literal("plumbing"),
            v.literal("electrical"),
            v.literal("hvac"),
            v.literal("appliance"),
            v.literal("structural"),
            v.literal("pest"),
            v.literal("general"),
            v.literal("emergency")
        ),

        priority: v.union(
            v.literal("low"),
            v.literal("medium"),
            v.literal("high"),
            v.literal("emergency")
        ),

        // Location
        location: v.optional(v.string()), // "Kitchen", "Master bathroom"

        // Images/attachments
        images: v.array(v.object({
            url: v.string(),
            storageId: v.id("_storage"),
        })),

        // Assignment
        assignedTo: v.optional(v.id("users")),
        vendorId: v.optional(v.id("vendors")),

        // Scheduling
        scheduledDate: v.optional(v.number()),
        scheduledTimeStart: v.optional(v.string()),
        scheduledTimeEnd: v.optional(v.string()),
        entryPermission: v.boolean(),

        // Status
        status: v.union(
            v.literal("open"),
            v.literal("assigned"),
            v.literal("scheduled"),
            v.literal("in_progress"),
            v.literal("pending_approval"),
            v.literal("completed"),
            v.literal("cancelled")
        ),

        // Resolution
        resolution: v.optional(v.string()),
        laborCost: v.optional(v.number()),
        materialsCost: v.optional(v.number()),
        totalCost: v.optional(v.number()),
        billToTenant: v.boolean(),

        // Timestamps
        submittedAt: v.number(),
        assignedAt: v.optional(v.number()),
        scheduledAt: v.optional(v.number()),
        startedAt: v.optional(v.number()),
        completedAt: v.optional(v.number()),

        // Rating (by tenant)
        rating: v.optional(v.number()),
        ratingComment: v.optional(v.string()),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_property", ["propertyId"])
        .index("by_unit", ["unitId"])
        .index("by_tenant", ["tenantId"])
        .index("by_status", ["organizationId", "status"])
        .index("by_priority", ["organizationId", "priority", "status"]),

    maintenanceNotes: defineTable({
        requestId: v.id("maintenanceRequests"),
        authorId: v.id("users"),

        content: v.string(),
        isInternal: v.boolean(), // If true, not visible to tenant

        images: v.array(v.object({
            url: v.string(),
            storageId: v.id("_storage"),
        })),

        createdAt: v.number(),
    })
        .index("by_request", ["requestId"]),

    vendors: defineTable({
        organizationId: v.id("organizations"),

        name: v.string(),
        contactName: v.string(),
        email: v.string(),
        phone: v.string(),

        // Services
        categories: v.array(v.string()), // ["plumbing", "electrical"]

        // Address
        address: v.optional(v.object({
            street: v.string(),
            city: v.string(),
            state: v.string(),
            zip: v.string(),
        })),

        // Payment
        paymentTerms: v.optional(v.string()),
        w9OnFile: v.boolean(),

        // Rating
        rating: v.optional(v.number()),
        completedJobs: v.number(),

        status: v.union(v.literal("active"), v.literal("inactive")),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"]),

    // ════════════════════════════════════════════════════════════════════
    // EXPENSES
    // ════════════════════════════════════════════════════════════════════

    expenses: defineTable({
        organizationId: v.id("organizations"),
        propertyId: v.optional(v.id("properties")), // null = All Properties
        unitId: v.optional(v.id("units")),

        // Expense details
        category: v.string(), // maintenance, utilities, insurance, taxes, landscaping, cleaning, legal, advertising, office, other
        description: v.string(),
        amount: v.number(),
        date: v.number(), // Unix timestamp

        // Vendor
        vendorId: v.optional(v.id("vendors")),
        vendorName: v.optional(v.string()), // For display when vendor not in system

        // Receipt
        receiptUrl: v.optional(v.string()),
        receiptStorageId: v.optional(v.id("_storage")),

        // Tax settings
        isTaxDeductible: v.boolean(),
        taxCategory: v.optional(v.string()), // Schedule E category

        // Status
        status: v.union(
            v.literal("pending"),
            v.literal("paid"),
            v.literal("cancelled")
        ),

        // Notes
        notes: v.optional(v.string()),

        // Metadata
        createdBy: v.optional(v.id("users")),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_org_date", ["organizationId", "date"])
        .index("by_org_category", ["organizationId", "category"])
        .index("by_property", ["propertyId"])
        .index("by_vendor", ["vendorId"]),

    // Time entries for maintenance work orders
    timeEntries: defineTable({
        organizationId: v.id("organizations"),
        maintenanceRequestId: v.id("maintenanceRequests"),
        userId: v.id("users"), // Technician or vendor user

        // Time tracking
        entryType: v.union(
            v.literal("work"),
            v.literal("travel"),
            v.literal("break"),
            v.literal("admin")
        ),

        startedAt: v.number(),
        endedAt: v.optional(v.number()),
        durationMinutes: v.optional(v.number()),

        // Rate info
        hourlyRate: v.optional(v.number()),
        totalCost: v.optional(v.number()),

        // Notes
        notes: v.optional(v.string()),

        // Status
        status: v.union(
            v.literal("in_progress"),
            v.literal("completed"),
            v.literal("approved"),
            v.literal("rejected")
        ),

        approvedBy: v.optional(v.id("users")),
        approvedAt: v.optional(v.number()),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_request", ["maintenanceRequestId"])
        .index("by_user", ["userId"])
        .index("by_date", ["organizationId", "startedAt"]),

    // Inventory items for maintenance
    inventoryItems: defineTable({
        organizationId: v.id("organizations"),

        // Item details
        name: v.string(),
        sku: v.optional(v.string()),
        description: v.optional(v.string()),
        category: v.string(), // "plumbing", "electrical", "hvac", etc.

        // Stock levels
        quantityOnHand: v.number(),
        minimumStockLevel: v.number(),
        reorderPoint: v.optional(v.number()),

        // Pricing
        unitOfMeasure: v.string(), // "each", "box", "pack"
        unitCost: v.number(),

        // Supplier info
        supplierId: v.optional(v.id("vendors")),
        supplierPartNumber: v.optional(v.string()),
        reorderUrl: v.optional(v.string()),

        // Storage
        storageLocation: v.optional(v.string()), // "Warehouse A, Shelf 3"

        // Alerts
        lowStockAlert: v.boolean(),
        outOfStockAlert: v.boolean(),

        // Status
        status: v.union(
            v.literal("active"),
            v.literal("discontinued"),
            v.literal("out_of_stock")
        ),

        lastRestockedAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_category", ["organizationId", "category"])
        .index("by_sku", ["organizationId", "sku"])
        .index("by_low_stock", ["organizationId", "lowStockAlert", "quantityOnHand"]),

    // Parts usage tracking for maintenance requests
    partsUsage: defineTable({
        organizationId: v.id("organizations"),
        maintenanceRequestId: v.id("maintenanceRequests"),
        inventoryItemId: v.id("inventoryItems"),

        // Usage details
        quantity: v.number(),
        unitCost: v.number(),
        totalCost: v.number(),

        // Who used it
        usedBy: v.id("users"),
        usedAt: v.number(),

        // Notes
        notes: v.optional(v.string()),

        // For returns
        returnedQuantity: v.optional(v.number()),
        returnedAt: v.optional(v.number()),

        createdAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_request", ["maintenanceRequestId"])
        .index("by_item", ["inventoryItemId"])
        .index("by_date", ["organizationId", "usedAt"]),

    // Vendor invoices for maintenance work
    vendorInvoices: defineTable({
        organizationId: v.id("organizations"),
        vendorId: v.id("vendors"),
        maintenanceRequestId: v.optional(v.id("maintenanceRequests")),

        // Invoice details
        invoiceNumber: v.string(),
        externalInvoiceNumber: v.optional(v.string()), // Vendor's invoice number

        // Service details
        serviceDate: v.number(),
        description: v.string(),

        // Line items
        lineItems: v.array(v.object({
            description: v.string(),
            type: v.union(
                v.literal("labor"),
                v.literal("parts"),
                v.literal("materials"),
                v.literal("travel"),
                v.literal("other")
            ),
            quantity: v.number(),
            unitPrice: v.number(),
            total: v.number(),
        })),

        // Totals
        laborTotal: v.optional(v.number()),
        partsTotal: v.optional(v.number()),
        otherCharges: v.optional(v.number()),
        subtotal: v.number(),
        tax: v.optional(v.number()),
        total: v.number(),

        // Dates
        invoiceDate: v.number(),
        dueDate: v.number(),

        // Status
        status: v.union(
            v.literal("submitted"),
            v.literal("under_review"),
            v.literal("approved"),
            v.literal("rejected"),
            v.literal("paid"),
            v.literal("disputed")
        ),

        // Approval workflow
        submittedAt: v.number(),
        reviewedBy: v.optional(v.id("users")),
        reviewedAt: v.optional(v.number()),
        approvedBy: v.optional(v.id("users")),
        approvedAt: v.optional(v.number()),
        rejectionReason: v.optional(v.string()),

        // Payment
        paidAt: v.optional(v.number()),
        paymentMethod: v.optional(v.string()),
        paymentReference: v.optional(v.string()),

        // Attachments (invoice PDF, receipts)
        attachments: v.array(v.object({
            name: v.string(),
            url: v.string(),
            storageId: v.id("_storage"),
            mimeType: v.string(),
        })),

        notes: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_vendor", ["vendorId"])
        .index("by_request", ["maintenanceRequestId"])
        .index("by_status", ["organizationId", "status"])
        .index("by_invoice_number", ["organizationId", "invoiceNumber"]),

    // ════════════════════════════════════════════════════════════════════
    // DOCUMENTS
    // ════════════════════════════════════════════════════════════════════

    documents: defineTable({
        organizationId: v.id("organizations"),

        // Linkage
        propertyId: v.optional(v.id("properties")),
        unitId: v.optional(v.id("units")),
        tenantId: v.optional(v.id("tenants")),
        leaseId: v.optional(v.id("leases")),

        // Document details
        name: v.string(),
        type: v.union(
            v.literal("lease"),
            v.literal("addendum"),
            v.literal("notice"),
            v.literal("receipt"),
            v.literal("inspection"),
            v.literal("tax"),
            v.literal("insurance"),
            v.literal("other")
        ),

        // File
        storageId: v.id("_storage"),
        url: v.string(),
        mimeType: v.string(),
        fileSize: v.number(),

        // Access control
        sharedWithTenant: v.boolean(),

        // Metadata
        tags: v.array(v.string()),

        uploadedBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_property", ["propertyId"])
        .index("by_tenant", ["tenantId"])
        .index("by_lease", ["leaseId"]),

    // ════════════════════════════════════════════════════════════════════
    // MESSAGES & NOTIFICATIONS
    // ════════════════════════════════════════════════════════════════════

    conversations: defineTable({
        organizationId: v.id("organizations"),

        // Participants
        participants: v.array(v.object({
            userId: v.id("users"),
            role: v.string(),
            name: v.string(),
        })),

        // Context
        propertyId: v.optional(v.id("properties")),
        unitId: v.optional(v.id("units")),
        tenantId: v.optional(v.id("tenants")),

        // Latest message preview
        lastMessageAt: v.number(),
        lastMessagePreview: v.string(),

        // Unread tracking per participant - dynamic keys for userId: count
        unreadCounts: v.any(), // { [userId]: number }

        status: v.union(v.literal("active"), v.literal("archived")),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_last_message", ["organizationId", "lastMessageAt"]),

    messages: defineTable({
        conversationId: v.id("conversations"),
        senderId: v.id("users"),

        content: v.string(),

        // Attachments
        attachments: v.array(v.object({
            name: v.string(),
            url: v.string(),
            storageId: v.id("_storage"),
            mimeType: v.string(),
        })),

        // Reactions (emoji reactions from users)
        reactions: v.optional(v.array(v.object({
            emoji: v.string(),
            userId: v.id("users"),
            createdAt: v.number(),
        }))),

        // Read receipts
        readBy: v.array(v.object({
            userId: v.id("users"),
            readAt: v.number(),
        })),

        // Message status
        isEdited: v.optional(v.boolean()),
        editedAt: v.optional(v.number()),
        isDeleted: v.optional(v.boolean()),
        deletedAt: v.optional(v.number()),

        // Reply to another message
        replyToId: v.optional(v.id("messages")),

        createdAt: v.number(),
    })
        .index("by_conversation", ["conversationId"]),

    notifications: defineTable({
        userId: v.id("users"),
        organizationId: v.optional(v.id("organizations")),

        type: v.union(
            v.literal("payment_received"),
            v.literal("payment_due"),
            v.literal("payment_late"),
            v.literal("maintenance_submitted"),
            v.literal("maintenance_updated"),
            v.literal("maintenance_completed"),
            v.literal("lease_expiring"),
            v.literal("application_received"),
            v.literal("application_approved"),
            v.literal("message_received"),
            v.literal("announcement"),
            v.literal("system")
        ),

        title: v.string(),
        message: v.string(),

        // Link to related entity
        entityType: v.optional(v.string()),
        entityId: v.optional(v.string()),

        // Status
        read: v.boolean(),
        readAt: v.optional(v.number()),

        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_unread", ["userId", "read"]),

    announcements: defineTable({
        organizationId: v.id("organizations"),

        // Target
        propertyIds: v.optional(v.array(v.id("properties"))), // If empty, all properties

        title: v.string(),
        content: v.string(),

        // Type
        type: v.union(
            v.literal("general"),
            v.literal("emergency"),
            v.literal("maintenance"),
            v.literal("event")
        ),

        // Scheduling
        publishAt: v.number(),
        expiresAt: v.optional(v.number()),

        status: v.union(
            v.literal("draft"),
            v.literal("scheduled"),
            v.literal("published"),
            v.literal("expired")
        ),

        authorId: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_status", ["organizationId", "status"]),

    // ════════════════════════════════════════════════════════════════════
    // SUBSCRIPTIONS (SaaS Billing)
    // ════════════════════════════════════════════════════════════════════

    subscriptions: defineTable({
        organizationId: v.id("organizations"),

        // Plan
        plan: v.union(
            v.literal("free"),
            v.literal("starter"),
            v.literal("growth"),
            v.literal("professional"),
            v.literal("enterprise")
        ),
        billingPeriod: v.optional(v.union(v.literal("monthly"), v.literal("yearly"))),

        // Stripe
        stripeSubscriptionId: v.optional(v.string()),
        stripePriceId: v.optional(v.string()),
        stripeCurrentPeriodEnd: v.optional(v.number()),
        stripeCustomerId: v.optional(v.string()),

        // Pricing
        pricePerMonth: v.optional(v.number()),
        pricePerYear: v.optional(v.number()),

        // Dates
        startDate: v.optional(v.number()),
        currentPeriodStart: v.optional(v.number()),
        currentPeriodEnd: v.optional(v.number()),
        nextBillingDate: v.optional(v.number()),

        // Limits
        unitLimit: v.number(),
        userLimit: v.number(),
        aiInteractionsAllowed: v.optional(v.number()),
        aiInteractionsUsed: v.optional(v.number()),

        // Payment method on file
        paymentMethodType: v.optional(v.string()), // visa, mastercard, amex
        paymentMethodLast4: v.optional(v.string()),

        // Status
        status: v.union(
            v.literal("trialing"),
            v.literal("active"),
            v.literal("past_due"),
            v.literal("cancelled"),
            v.literal("unpaid")
        ),

        trialEndsAt: v.optional(v.number()),
        cancelledAt: v.optional(v.number()),
        cancellationReason: v.optional(v.string()),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_status", ["status"]),

    // ════════════════════════════════════════════════════════════════════
    // AUDIT LOG
    // ════════════════════════════════════════════════════════════════════

    auditLogs: defineTable({
        organizationId: v.id("organizations"),
        userId: v.id("users"),

        action: v.string(), // "property.created", "lease.signed", etc.
        entityType: v.string(),
        entityId: v.string(),

        details: v.optional(v.any()), // Additional context

        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),

        createdAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_user", ["userId"])
        .index("by_entity", ["organizationId", "entityType", "entityId"]),

    // ════════════════════════════════════════════════════════════════════
    // AI KNOWLEDGE BASE & SUPPORT
    // ════════════════════════════════════════════════════════════════════

    // Knowledge Base Documents (for RAG)
    knowledgeBaseDocuments: defineTable({
        organizationId: v.id("organizations"),
        propertyId: v.optional(v.id("properties")), // null = company-level
        listingId: v.optional(v.id("listings")),

        // File info
        fileName: v.string(),
        fileUrl: v.string(),
        storageId: v.id("_storage"),
        fileType: v.string(), // pdf, docx, txt
        fileSize: v.number(),
        mimeType: v.string(),

        // Categorization
        category: v.union(
            v.literal("policies"),
            v.literal("amenities"),
            v.literal("move_in"),
            v.literal("move_out"),
            v.literal("faq"),
            v.literal("rules"),
            v.literal("lease_terms"),
            v.literal("neighborhood"),
            v.literal("utilities"),
            v.literal("parking"),
            v.literal("pets"),
            v.literal("other")
        ),

        // Processing status for RAG
        processingStatus: v.union(
            v.literal("pending"),
            v.literal("processing"),
            v.literal("ready"),
            v.literal("failed")
        ),

        // RAG metadata
        chunkCount: v.optional(v.number()),
        embeddingStatus: v.optional(v.union(
            v.literal("pending"),
            v.literal("complete"),
            v.literal("failed")
        )),
        lastProcessedAt: v.optional(v.number()),
        processingError: v.optional(v.string()),

        uploadedBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_property", ["propertyId"])
        .index("by_listing", ["listingId"])
        .index("by_category", ["organizationId", "category"])
        .index("by_processing_status", ["organizationId", "processingStatus"]),

    // Quick Facts / FAQ (structured Q&A pairs)
    knowledgeBaseFAQ: defineTable({
        organizationId: v.id("organizations"),
        propertyId: v.optional(v.id("properties")), // null = company-level
        listingId: v.optional(v.id("listings")),

        question: v.string(),
        answer: v.string(),

        // Organization
        category: v.optional(v.string()), // "rent", "policies", "amenities", etc.
        order: v.number(),
        isActive: v.boolean(),

        // Analytics
        timesAsked: v.optional(v.number()),
        helpfulCount: v.optional(v.number()),
        notHelpfulCount: v.optional(v.number()),

        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_property", ["propertyId"])
        .index("by_listing", ["listingId"])
        .index("by_org_active", ["organizationId", "isActive"]),

    // AI Widget Configuration
    aiWidgetConfig: defineTable({
        organizationId: v.id("organizations"),
        propertyId: v.optional(v.id("properties")), // null = company default
        listingId: v.optional(v.id("listings")),

        // Knowledge base source
        knowledgeBaseSource: v.union(
            v.literal("company"),
            v.literal("property"),
            v.literal("both")
        ),

        // Channels enabled
        chatEnabled: v.boolean(),
        phoneEnabled: v.boolean(),
        whatsappEnabled: v.boolean(),
        smsEnabled: v.boolean(),

        // Phone settings
        supportPhoneNumber: v.optional(v.string()),
        escalationPhoneNumber: v.optional(v.string()),

        // WhatsApp settings
        whatsappBusinessNumber: v.optional(v.string()),

        // Widget display settings
        showOnListing: v.boolean(),
        showOnTenantPortal: v.boolean(),
        embedEnabled: v.boolean(),
        embedCode: v.optional(v.string()),

        // Appearance
        widgetPosition: v.union(
            v.literal("bottom-right"),
            v.literal("bottom-left")
        ),
        widgetColor: v.string(),
        welcomeMessage: v.string(),

        // AI Persona
        aiName: v.optional(v.string()), // "Nomo", "Property Assistant", etc.
        aiTone: v.optional(v.union(
            v.literal("professional"),
            v.literal("friendly"),
            v.literal("casual")
        )),

        // Escalation rules
        escalateOnEmergency: v.boolean(),
        escalateOnHumanRequest: v.boolean(),
        escalateOnUnknown: v.boolean(),

        // Capabilities
        canScheduleTours: v.boolean(),
        canCreateMaintenanceRequests: v.boolean(),
        canProvidePaymentInfo: v.boolean(),

        // Business hours (when to show widget)
        alwaysAvailable: v.boolean(),
        businessHours: v.optional(v.object({
            monday: v.optional(v.object({ start: v.string(), end: v.string() })),
            tuesday: v.optional(v.object({ start: v.string(), end: v.string() })),
            wednesday: v.optional(v.object({ start: v.string(), end: v.string() })),
            thursday: v.optional(v.object({ start: v.string(), end: v.string() })),
            friday: v.optional(v.object({ start: v.string(), end: v.string() })),
            saturday: v.optional(v.object({ start: v.string(), end: v.string() })),
            sunday: v.optional(v.object({ start: v.string(), end: v.string() })),
        })),

        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_property", ["propertyId"])
        .index("by_listing", ["listingId"]),

    // AI Conversations (for analytics and history)
    aiConversations: defineTable({
        organizationId: v.id("organizations"),
        propertyId: v.optional(v.id("properties")),
        listingId: v.optional(v.id("listings")),

        // Channel
        channel: v.union(
            v.literal("chat"),
            v.literal("phone"),
            v.literal("whatsapp"),
            v.literal("sms")
        ),

        // Session
        sessionId: v.string(),

        // Participant
        userId: v.optional(v.id("users")), // if logged-in tenant
        tenantId: v.optional(v.id("tenants")),
        visitorId: v.optional(v.string()), // if anonymous prospect
        visitorName: v.optional(v.string()),
        visitorEmail: v.optional(v.string()),
        visitorPhone: v.optional(v.string()),

        // Messages
        messages: v.array(v.object({
            id: v.string(),
            role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
            content: v.string(),
            timestamp: v.number(),
            metadata: v.optional(v.object({
                sourceDocs: v.optional(v.array(v.string())), // Knowledge base docs referenced
                intent: v.optional(v.string()), // Detected intent
                confidence: v.optional(v.number()),
            })),
        })),

        // Summary
        messageCount: v.number(),
        durationSeconds: v.optional(v.number()),

        // Outcome
        wasEscalated: v.boolean(),
        escalationReason: v.optional(v.string()),
        escalatedTo: v.optional(v.string()), // phone number or user

        // Topics discussed
        topics: v.optional(v.array(v.string())), // ["rent", "maintenance", "tour"]

        // Satisfaction
        satisfaction: v.optional(v.number()), // 1-5 rating
        feedbackComment: v.optional(v.string()),
        resolved: v.boolean(),

        // Timestamps
        startedAt: v.number(),
        endedAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_property", ["propertyId"])
        .index("by_listing", ["listingId"])
        .index("by_session", ["sessionId"])
        .index("by_channel", ["organizationId", "channel"])
        .index("by_date", ["organizationId", "startedAt"]),

    // Listing Photos (separate table for better management)
    listingPhotos: defineTable({
        organizationId: v.id("organizations"),
        listingId: v.id("listings"),

        // File info
        storageId: v.id("_storage"),
        url: v.string(),
        fileName: v.optional(v.string()),

        // Image metadata
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        fileSize: v.optional(v.number()),
        mimeType: v.string(),

        // Display
        caption: v.optional(v.string()),
        altText: v.optional(v.string()),
        order: v.number(),
        isPrimary: v.boolean(),

        // Room/category tagging
        roomType: v.optional(v.union(
            v.literal("exterior"),
            v.literal("living_room"),
            v.literal("bedroom"),
            v.literal("bathroom"),
            v.literal("kitchen"),
            v.literal("dining"),
            v.literal("office"),
            v.literal("balcony"),
            v.literal("garage"),
            v.literal("yard"),
            v.literal("pool"),
            v.literal("gym"),
            v.literal("common_area"),
            v.literal("other")
        )),

        uploadedBy: v.id("users"),
        createdAt: v.number(),
    })
        .index("by_listing", ["listingId"])
        .index("by_org", ["organizationId"])
        .index("by_listing_order", ["listingId", "order"]),

    // ════════════════════════════════════════════════════════════════════
    // APPLICATION INVITES
    // ════════════════════════════════════════════════════════════════════

    applicationInvites: defineTable({
        organizationId: v.id("organizations"),
        
        // Invite details
        inviteCode: v.string(), // Unique code for the invite link
        email: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        message: v.optional(v.string()),
        
        // Optional: Link to a specific listing
        listingId: v.optional(v.id("listings")),
        
        // Expiration
        expiresAt: v.number(),
        
        // Status
        status: v.union(
            v.literal("pending"),   // Invite sent, awaiting response
            v.literal("opened"),    // Invite link was clicked
            v.literal("completed"), // Application was submitted
            v.literal("expired")    // Invite expired
        ),
        
        // Tracking
        resultingApplicationId: v.optional(v.id("applications")),
        openedAt: v.optional(v.number()),
        completedAt: v.optional(v.number()),
        
        // Metadata
        createdBy: v.optional(v.id("users")),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_email", ["email"])
        .index("by_code", ["inviteCode"])
        .index("by_status", ["organizationId", "status"]),

    // ════════════════════════════════════════════════════════════════════
    // CALENDAR & EVENTS
    // ════════════════════════════════════════════════════════════════════

    calendarEvents: defineTable({
        organizationId: v.id("organizations"),

        // Event details
        title: v.string(),
        description: v.optional(v.string()),
        type: v.union(
            v.literal("showing"),
            v.literal("maintenance"),
            v.literal("lease"),
            v.literal("rent"),
            v.literal("inspection"),
            v.literal("moveIn"),
            v.literal("moveOut"),
            v.literal("reminder"),
            v.literal("custom")
        ),

        // Timing
        startTime: v.number(),
        endTime: v.number(),
        allDay: v.boolean(),

        // Color for display
        color: v.optional(v.union(
            v.literal("brand"),
            v.literal("orange"),
            v.literal("rose"),
            v.literal("green"),
            v.literal("blue"),
            v.literal("purple"),
            v.literal("gray")
        )),

        // Related entities (optional)
        propertyId: v.optional(v.id("properties")),
        unitId: v.optional(v.id("units")),
        tenantId: v.optional(v.id("tenants")),
        maintenanceRequestId: v.optional(v.id("maintenanceRequests")),
        leaseId: v.optional(v.id("leases")),
        listingId: v.optional(v.id("listings")),

        // For showings
        prospectName: v.optional(v.string()),
        prospectEmail: v.optional(v.string()),
        prospectPhone: v.optional(v.string()),

        // Status
        status: v.union(
            v.literal("scheduled"),
            v.literal("confirmed"),
            v.literal("completed"),
            v.literal("cancelled"),
            v.literal("rescheduled")
        ),

        // Notes
        notes: v.optional(v.string()),

        // Creator
        createdBy: v.optional(v.id("users")),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_org_date", ["organizationId", "startTime"])
        .index("by_type", ["organizationId", "type"])
        .index("by_status", ["organizationId", "status"])
        .index("by_property", ["propertyId"]),

    // ════════════════════════════════════════════════════════════════════
    // BILLING SETTINGS
    // ════════════════════════════════════════════════════════════════════

    billingSettings: defineTable({
        organizationId: v.id("organizations"),

        // Payout Settings
        payoutSchedule: v.union(
            v.literal("daily"),
            v.literal("weekly"),
            v.literal("monthly")
        ),
        bankAccountId: v.optional(v.string()), // Stripe bank account ID

        // Payment Methods
        achEnabled: v.boolean(),
        cardEnabled: v.boolean(),
        paypalEnabled: v.boolean(),
        checkEnabled: v.boolean(),

        // Late Fee Settings
        lateFeeEnabled: v.boolean(),
        lateFeeType: v.union(v.literal("fixed"), v.literal("percentage")),
        lateFeeAmount: v.number(),
        gracePeriodDays: v.number(),
        autoApplyLateFee: v.boolean(),

        // Reminder Settings
        remindersEnabled: v.boolean(),
        beforeDueDays: v.array(v.number()), // e.g., [3, 1] for 3 days and 1 day before
        afterDueDays: v.array(v.number()),  // e.g., [1, 3, 7] for overdue reminders
        emailRemindersEnabled: v.boolean(),
        smsRemindersEnabled: v.boolean(),

        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"]),

    // ════════════════════════════════════════════════════════════════════
    // SUBSCRIPTION PAYMENTS
    // ════════════════════════════════════════════════════════════════════

    subscriptionPayments: defineTable({
        organizationId: v.id("organizations"),
        subscriptionId: v.id("subscriptions"),

        // Payment details
        amount: v.number(),
        currency: v.string(), // USD
        description: v.string(), // "Growth Plan - Monthly"

        // Status
        status: v.union(
            v.literal("succeeded"),
            v.literal("pending"),
            v.literal("failed"),
            v.literal("refunded")
        ),

        // Dates
        paymentDate: v.number(),
        periodStart: v.number(),
        periodEnd: v.number(),

        // Payment method used
        paymentMethod: v.optional(v.string()), // "Visa ****4521"

        // Stripe reference
        stripePaymentIntentId: v.optional(v.string()),
        stripeInvoiceId: v.optional(v.string()),

        // Invoice
        invoiceUrl: v.optional(v.string()),
        invoicePdfUrl: v.optional(v.string()),

        // Failure reason if failed
        failureReason: v.optional(v.string()),

        createdAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_subscription", ["subscriptionId"])
        .index("by_date", ["organizationId", "paymentDate"]),
});
