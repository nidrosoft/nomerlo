"use server";

import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Seed the database with sample data for testing
 * Run this once to populate the database with properties, units, and listings
 */
export const seedDatabase = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if we already have data
        const existingOrgs = await ctx.db.query("organizations").take(1);
        if (existingOrgs.length > 0) {
            return { success: false, message: "Database already seeded" };
        }

        const now = Date.now();

        // Create a demo organization
        const orgId = await ctx.db.insert("organizations", {
            name: "Nomerlo Demo Properties",
            slug: "nomerlo-demo",
            type: "property_manager",
            email: "demo@nomerlo.com",
            phone: "(555) 123-4567",
            website: "https://nomerlo.com",
            address: {
                street: "100 Property Management Way",
                city: "Austin",
                state: "TX",
                zip: "78701",
                country: "USA",
            },
            settings: {
                timezone: "America/Chicago",
                currency: "USD",
                locale: "en-US",
                lateFeeDays: 5,
                lateFeeAmount: 50,
                lateFeeType: "fixed",
            },
            status: "active",
            createdAt: now,
            updatedAt: now,
        });

        // Create properties with units and listings
        const propertiesData = [
            {
                name: "Cascading Waters Villa",
                type: "single_family" as const,
                address: {
                    street: "3891 Ranchview Dr",
                    city: "Richardson",
                    state: "CA",
                    zip: "90210",
                    country: "USA",
                    latitude: 34.0522,
                    longitude: -118.2437,
                },
                yearBuilt: 2020,
                totalUnits: 1,
                totalSqft: 5320,
                parkingSpaces: 3,
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60",
                        isPrimary: true,
                    },
                ],
                amenities: ["Pool", "Smart Home", "Gated Entry", "Home Theater", "Wine Cellar"],
                unit: {
                    bedrooms: 5,
                    bathrooms: 6,
                    sqft: 5320,
                    marketRent: 4500,
                    depositAmount: 9000,
                    features: ["Master Suite", "Chef's Kitchen", "Home Office", "Outdoor Kitchen"],
                },
                listing: {
                    title: "Cascading Waters Villa of Serenity",
                    description: "Experience luxury living at its finest in this stunning 5-bedroom villa featuring breathtaking architecture, a resort-style pool, and panoramic views. This meticulously designed home offers smart home technology, a gourmet kitchen, and expansive outdoor living spaces perfect for entertaining.",
                    rentAmount: 4500,
                    depositAmount: 9000,
                    leaseTerm: "12_months" as const,
                    slug: "cascading-waters-villa-serenity",
                },
            },
            {
                name: "Starlit Cove Private Villa",
                type: "single_family" as const,
                address: {
                    street: "456 Oceanview Blvd",
                    city: "Richardson",
                    state: "CA",
                    zip: "90211",
                    country: "USA",
                    latitude: 34.0622,
                    longitude: -118.2537,
                },
                yearBuilt: 2019,
                totalUnits: 1,
                totalSqft: 6740,
                parkingSpaces: 4,
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
                        isPrimary: true,
                    },
                ],
                amenities: ["Private Beach", "Infinity Pool", "Guest House", "Gym", "Spa"],
                unit: {
                    bedrooms: 6,
                    bathrooms: 8,
                    sqft: 6740,
                    marketRent: 5200,
                    depositAmount: 10400,
                    features: ["Ocean Views", "Private Dock", "Wine Room", "Elevator"],
                },
                listing: {
                    title: "Starlit Cove Private Villa Retreat",
                    description: "Discover unparalleled elegance in this extraordinary 6-bedroom oceanfront villa. Featuring floor-to-ceiling windows, an infinity pool overlooking the ocean, and a private guest house, this property represents the pinnacle of coastal luxury living.",
                    rentAmount: 5200,
                    depositAmount: 10400,
                    leaseTerm: "12_months" as const,
                    slug: "starlit-cove-private-villa-retreat",
                },
            },
            {
                name: "Modern Downtown Luxury",
                type: "apartment" as const,
                address: {
                    street: "456 Market St",
                    city: "San Francisco",
                    state: "CA",
                    zip: "94102",
                    country: "USA",
                    latitude: 37.7749,
                    longitude: -122.4194,
                },
                yearBuilt: 2022,
                totalUnits: 1,
                totalSqft: 1200,
                parkingSpaces: 1,
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
                        isPrimary: true,
                    },
                ],
                amenities: ["Rooftop Deck", "Concierge", "Fitness Center", "Pet Spa"],
                unit: {
                    bedrooms: 2,
                    bathrooms: 2,
                    sqft: 1200,
                    marketRent: 2400,
                    depositAmount: 4800,
                    features: ["City Views", "In-Unit Laundry", "Walk-in Closet", "Stainless Appliances"],
                },
                listing: {
                    title: "Modern Downtown Luxury Apartment",
                    description: "Live in the heart of San Francisco in this stunning modern apartment. Featuring floor-to-ceiling windows with city views, premium finishes, and access to world-class building amenities including a rooftop terrace and state-of-the-art fitness center.",
                    rentAmount: 2400,
                    depositAmount: 4800,
                    leaseTerm: "12_months" as const,
                    slug: "modern-downtown-luxury-apartment",
                },
            },
            {
                name: "Cozy Tech District Studio",
                type: "apartment" as const,
                address: {
                    street: "789 Innovation Way",
                    city: "Austin",
                    state: "TX",
                    zip: "78701",
                    country: "USA",
                    latitude: 30.2672,
                    longitude: -97.7431,
                },
                yearBuilt: 2021,
                totalUnits: 1,
                totalSqft: 550,
                parkingSpaces: 1,
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
                        isPrimary: true,
                    },
                ],
                amenities: ["Co-Working Space", "Package Lockers", "Bike Storage", "Dog Park"],
                unit: {
                    bedrooms: 1,
                    bathrooms: 1,
                    sqft: 550,
                    marketRent: 1850,
                    depositAmount: 3700,
                    features: ["Murphy Bed", "Built-in Desk", "Smart Thermostat", "High-Speed WiFi"],
                },
                listing: {
                    title: "Cozy Studio in Tech District",
                    description: "Perfect for tech professionals! This thoughtfully designed studio in Austin's innovation hub features smart home technology, a built-in workspace, and is steps away from top tech companies, restaurants, and entertainment.",
                    rentAmount: 1850,
                    depositAmount: 3700,
                    leaseTerm: "12_months" as const,
                    slug: "cozy-studio-tech-district",
                },
            },
        ];

        const createdProperties = [];
        const createdListings = [];

        for (const propData of propertiesData) {
            // Create property
            const propertyId = await ctx.db.insert("properties", {
                organizationId: orgId,
                name: propData.name,
                type: propData.type,
                address: propData.address,
                yearBuilt: propData.yearBuilt,
                totalUnits: propData.totalUnits,
                totalSqft: propData.totalSqft,
                parkingSpaces: propData.parkingSpaces,
                images: propData.images,
                amenities: propData.amenities,
                status: "active",
                createdAt: now,
                updatedAt: now,
            });

            createdProperties.push(propertyId);

            // Create unit
            const unitId = await ctx.db.insert("units", {
                organizationId: orgId,
                propertyId: propertyId,
                unitNumber: "A",
                name: propData.type === "single_family" ? "Main Residence" : "Unit A",
                bedrooms: propData.unit.bedrooms,
                bathrooms: propData.unit.bathrooms,
                sqft: propData.unit.sqft,
                floor: 1,
                features: propData.unit.features,
                marketRent: propData.unit.marketRent,
                depositAmount: propData.unit.depositAmount,
                images: [],
                status: "vacant",
                createdAt: now,
                updatedAt: now,
            });

            // Create listing
            const listingId = await ctx.db.insert("listings", {
                organizationId: orgId,
                propertyId: propertyId,
                unitId: unitId,
                title: propData.listing.title,
                description: propData.listing.description,
                rentAmount: propData.listing.rentAmount,
                depositAmount: propData.listing.depositAmount,
                availableDate: now,
                leaseTerm: propData.listing.leaseTerm,
                requirements: {
                    minCreditScore: 650,
                    minIncome: 3,
                    petsAllowed: true,
                    petTypes: ["dogs", "cats"],
                    petDeposit: 500,
                    smokingAllowed: false,
                    maxOccupants: propData.unit.bedrooms * 2,
                },
                utilities: {
                    included: ["water", "trash"],
                    tenantPays: ["electric", "gas", "internet"],
                },
                slug: propData.listing.slug,
                keywords: [propData.address.city.toLowerCase(), propData.type, "luxury", "modern"],
                status: "active",
                viewCount: Math.floor(Math.random() * 500) + 100,
                inquiryCount: Math.floor(Math.random() * 50) + 10,
                applicationCount: Math.floor(Math.random() * 10) + 2,
                syndicateTo: ["zillow", "apartments.com"],
                verificationStatus: "verified",
                verifiedAt: now,
                publishedAt: now,
                createdAt: now,
                updatedAt: now,
            });

            createdListings.push(listingId);
        }

        return {
            success: true,
            message: "Database seeded successfully",
            data: {
                organizationId: orgId,
                properties: createdProperties.length,
                listings: createdListings.length,
            },
        };
    },
});

/**
 * Seed the database with sample applications for testing
 */
export const seedApplications = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Get existing listings
        const listings = await ctx.db.query("listings").take(4);
        if (listings.length === 0) {
            return { success: false, message: "No listings found. Please seed properties first." };
        }

        // Check if applications already exist
        const existingApps = await ctx.db.query("applications").take(1);
        if (existingApps.length > 0) {
            return { success: false, message: "Applications already seeded" };
        }

        const applicantsData = [
            {
                applicant: {
                    firstName: "John",
                    lastName: "Martinez",
                    email: "john.martinez@email.com",
                    phone: "(512) 555-0199",
                    dateOfBirth: now - 30 * 365 * 24 * 60 * 60 * 1000,
                },
                employment: {
                    status: "employed" as const,
                    employer: "Google Inc.",
                    position: "Software Engineer",
                    income: 8500,
                    startDate: now - 3 * 365 * 24 * 60 * 60 * 1000,
                    supervisorName: "Jane Smith",
                    supervisorPhone: "(512) 555-9001",
                },
                status: "submitted" as const,
                screeningStatus: "pending" as const,
            },
            {
                applicant: {
                    firstName: "Sarah",
                    lastName: "Williams",
                    email: "sarah.w@email.com",
                    phone: "(512) 555-0188",
                    dateOfBirth: now - 32 * 365 * 24 * 60 * 60 * 1000,
                },
                employment: {
                    status: "employed" as const,
                    employer: "TechCorp Inc.",
                    position: "Senior Designer",
                    income: 5800,
                    startDate: now - 4 * 365 * 24 * 60 * 60 * 1000,
                    supervisorName: "Jane Manager",
                    supervisorPhone: "(512) 555-9999",
                },
                status: "under_review" as const,
                screeningStatus: "completed" as const,
                creditScore: 720,
                backgroundCheckPassed: true,
                evictionCheckPassed: true,
            },
            {
                applicant: {
                    firstName: "Mike",
                    lastName: "Chen",
                    email: "mike.chen@email.com",
                    phone: "(512) 555-0177",
                    dateOfBirth: now - 28 * 365 * 24 * 60 * 60 * 1000,
                },
                employment: {
                    status: "employed" as const,
                    employer: "Amazon Web Services",
                    position: "Cloud Architect",
                    income: 9200,
                    startDate: now - 2 * 365 * 24 * 60 * 60 * 1000,
                    supervisorName: "Tom Lead",
                    supervisorPhone: "(512) 555-8888",
                },
                status: "approved" as const,
                screeningStatus: "completed" as const,
                creditScore: 780,
                backgroundCheckPassed: true,
                evictionCheckPassed: true,
            },
            {
                applicant: {
                    firstName: "Emily",
                    lastName: "Johnson",
                    email: "emily.j@email.com",
                    phone: "(512) 555-0166",
                    dateOfBirth: now - 26 * 365 * 24 * 60 * 60 * 1000,
                },
                employment: {
                    status: "employed" as const,
                    employer: "Spotify",
                    position: "Product Manager",
                    income: 7500,
                    startDate: now - 1 * 365 * 24 * 60 * 60 * 1000,
                    supervisorName: "Lisa Director",
                    supervisorPhone: "(512) 555-7777",
                },
                status: "screening" as const,
                screeningStatus: "in_progress" as const,
            },
            {
                applicant: {
                    firstName: "David",
                    lastName: "Brown",
                    email: "david.b@email.com",
                    phone: "(512) 555-0155",
                    dateOfBirth: now - 35 * 365 * 24 * 60 * 60 * 1000,
                },
                employment: {
                    status: "self_employed" as const,
                    employer: "Freelance Consulting",
                    position: "Consultant",
                    income: 4200,
                },
                status: "denied" as const,
                screeningStatus: "completed" as const,
                creditScore: 580,
                backgroundCheckPassed: true,
                evictionCheckPassed: false,
            },
        ];

        const createdApplications = [];

        for (let i = 0; i < applicantsData.length; i++) {
            const appData = applicantsData[i];
            const listing = listings[i % listings.length];

            const applicationId = await ctx.db.insert("applications", {
                organizationId: listing.organizationId,
                listingId: listing._id,
                unitId: listing.unitId,
                applicantUserId: undefined,
                applicant: {
                    ...appData.applicant,
                    ssn: undefined,
                },
                currentAddress: {
                    street: `${100 + i * 100} Current Street, Apt ${i + 1}`,
                    city: "Austin",
                    state: "TX",
                    zip: "78702",
                    moveInDate: now - (2 + i) * 365 * 24 * 60 * 60 * 1000,
                    rent: 1200 + i * 100,
                    landlordName: `Landlord ${i + 1}`,
                    landlordPhone: `(512) 555-${1000 + i}`,
                },
                employment: appData.employment,
                occupants: i % 2 === 0 ? [] : [{ name: "Spouse", relationship: "spouse", age: 30 }],
                pets: i % 3 === 0 ? [{ type: "Dog", breed: "Labrador", weight: 65 }] : [],
                vehicles: [{ make: "Toyota", model: "Camry", year: 2020, licensePlate: `ABC-${1000 + i}` }],
                emergencyContact: {
                    name: `Emergency Contact ${i + 1}`,
                    relationship: "Parent",
                    phone: `(512) 555-${2000 + i}`,
                },
                desiredMoveIn: now + (7 + i * 7) * 24 * 60 * 60 * 1000,
                desiredLeaseTerm: "12_months",
                screeningStatus: appData.screeningStatus,
                screeningReportId: undefined,
                creditScore: appData.creditScore,
                backgroundCheckPassed: appData.backgroundCheckPassed,
                evictionCheckPassed: appData.evictionCheckPassed,
                status: appData.status,
                internalNotes: undefined,
                decisionReason: appData.status === "denied" ? "Credit score below minimum requirement" : undefined,
                applicationFee: 35,
                applicationFeePaid: true,
                stripePaymentIntentId: `pi_demo_${i}`,
                submittedAt: now - (i + 1) * 24 * 60 * 60 * 1000,
                reviewedAt: appData.status !== "submitted" ? now - i * 24 * 60 * 60 * 1000 : undefined,
                decidedAt: ["approved", "denied"].includes(appData.status) ? now : undefined,
                createdAt: now - (i + 1) * 24 * 60 * 60 * 1000,
                updatedAt: now,
            });

            createdApplications.push(applicationId);
        }

        return {
            success: true,
            message: "Applications seeded successfully",
            data: {
                applications: createdApplications.length,
            },
        };
    },
});

/**
 * Seed the database with sample tenants for messaging
 */
export const seedTenants = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Get organization
        const org = await ctx.db.query("organizations").first();
        if (!org) {
            return { success: false, message: "No organization found. Please seed database first." };
        }

        // Check if tenants already exist
        const existingTenants = await ctx.db.query("tenants").take(1);
        if (existingTenants.length > 0) {
            return { success: false, message: "Tenants already seeded" };
        }

        // Get properties and units
        const properties = await ctx.db.query("properties").take(4);
        const units = await ctx.db.query("units").take(4);

        if (properties.length === 0 || units.length === 0) {
            return { success: false, message: "No properties/units found. Please seed database first." };
        }

        // Create demo users first for tenants
        const tenantUsersData = [
            { firstName: "James", lastName: "Wilson", email: "james.wilson@tenant.com", phone: "(512) 555-3001" },
            { firstName: "Maria", lastName: "Garcia", email: "maria.garcia@tenant.com", phone: "(512) 555-3002" },
            { firstName: "Robert", lastName: "Taylor", email: "robert.taylor@tenant.com", phone: "(512) 555-3003" },
            { firstName: "Lisa", lastName: "Anderson", email: "lisa.anderson@tenant.com", phone: "(512) 555-3004" },
        ];

        const createdUserIds: Id<"users">[] = [];
        const createdTenantIds: Id<"tenants">[] = [];

        for (let i = 0; i < tenantUsersData.length; i++) {
            const userData = tenantUsersData[i];

            // Create user
            const userId = await ctx.db.insert("users", {
                clerkId: `demo_tenant_${i + 1}`,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone,
                role: "tenant",
                status: "active",
                createdAt: now,
                updatedAt: now,
            });

            createdUserIds.push(userId);

            // Create tenant
            const unit = units[i % units.length];
            const property = properties[i % properties.length];

            const tenantId = await ctx.db.insert("tenants", {
                organizationId: org._id,
                userId: userId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                unitId: unit._id,
                propertyId: property._id,
                emergencyContacts: [{
                    name: "Emergency Contact",
                    relationship: "Spouse",
                    phone: "(512) 555-9999",
                }],
                vehicles: [],
                portalStatus: "active",
                activatedAt: now,
                autopayEnabled: false,
                status: "current",
                moveInDate: now - 90 * 24 * 60 * 60 * 1000, // 90 days ago
                currentBalance: 0,
                createdAt: now,
                updatedAt: now,
            });

            createdTenantIds.push(tenantId);
        }

        return {
            success: true,
            message: "Tenants seeded successfully",
            data: {
                users: createdUserIds.length,
                tenants: createdTenantIds.length,
            },
        };
    },
});

/**
 * Seed the database with sample conversations and messages for testing
 */
export const seedMessages = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Get organization
        const org = await ctx.db.query("organizations").first();
        if (!org) {
            return { success: false, message: "No organization found. Please seed database first." };
        }

        // Check if conversations already exist
        const existingConvs = await ctx.db.query("conversations").take(1);
        if (existingConvs.length > 0) {
            return { success: false, message: "Conversations already seeded" };
        }

        // Get tenants
        const tenants = await ctx.db.query("tenants").take(4);
        if (tenants.length === 0) {
            return { success: false, message: "No tenants found. Please seed tenants first." };
        }

        // Get owner user (first non-tenant user or create one)
        let ownerUser = await ctx.db.query("users").filter(q => q.eq(q.field("role"), "owner")).first();
        
        if (!ownerUser) {
            // Create an owner user
            const ownerUserId = await ctx.db.insert("users", {
                clerkId: "demo_owner_1",
                email: "owner@nomerlo.com",
                firstName: "Property",
                lastName: "Owner",
                role: "owner",
                status: "active",
                createdAt: now,
                updatedAt: now,
            });
            ownerUser = await ctx.db.get(ownerUserId);
        }

        if (!ownerUser) {
            return { success: false, message: "Could not create owner user" };
        }

        const createdConversations: Id<"conversations">[] = [];
        const createdMessages: Id<"messages">[] = [];

        // Sample conversation data
        const conversationData = [
            {
                tenant: tenants[0],
                messages: [
                    { sender: "tenant", content: "Hi, I wanted to report that the kitchen faucet has been dripping for a few days now.", time: -2 * 60 * 60 * 1000 },
                    { sender: "owner", content: "Thank you for letting me know, James! I'll schedule a plumber to come take a look. Is there a time that works best for you?", time: -1.5 * 60 * 60 * 1000 },
                    { sender: "tenant", content: "I'm usually home after 5pm on weekdays. Would Thursday or Friday work?", time: -1 * 60 * 60 * 1000 },
                    { sender: "owner", content: "Perfect! I've scheduled a plumber for Thursday at 5:30 PM. I'll send you a confirmation shortly.", time: -30 * 60 * 1000 },
                    { sender: "tenant", content: "That works great, thank you so much! 🙏", time: -10 * 60 * 1000, reactions: [{ emoji: "👍", userId: ownerUser._id }] },
                ],
                unread: 1,
            },
            {
                tenant: tenants[1],
                messages: [
                    { sender: "owner", content: "Hi Maria! Just a reminder that rent is due on the 1st. Let me know if you have any questions about the online payment portal.", time: -48 * 60 * 60 * 1000 },
                    { sender: "tenant", content: "Thanks for the reminder! I set up autopay last week, so it should go through automatically.", time: -47 * 60 * 60 * 1000 },
                    { sender: "owner", content: "Perfect! I can see it's set up correctly. You're all set! 😊", time: -46 * 60 * 60 * 1000, reactions: [{ emoji: "❤️", userId: tenants[1].userId as Id<"users"> }] },
                ],
                unread: 0,
            },
            {
                tenant: tenants[2],
                messages: [
                    { sender: "tenant", content: "Good morning! I wanted to ask about the pet policy. My girlfriend and I are thinking about getting a cat.", time: -72 * 60 * 60 * 1000 },
                    { sender: "owner", content: "Good morning Robert! Cats are allowed with a $300 pet deposit and $25/month pet rent. Would you like me to send over the pet addendum?", time: -71 * 60 * 60 * 1000 },
                    { sender: "tenant", content: "Yes please! That would be great.", time: -70 * 60 * 60 * 1000 },
                    { sender: "owner", content: "I've attached the pet addendum to this message. Please review and sign at your convenience. Once approved, your furry friend is welcome! 🐱", time: -69 * 60 * 60 * 1000 },
                    { sender: "tenant", content: "Awesome! I'll review it tonight and get it back to you tomorrow.", time: -68 * 60 * 60 * 1000 },
                    { sender: "tenant", content: "Just signed and submitted the pet addendum!", time: -24 * 60 * 60 * 1000 },
                    { sender: "owner", content: "Got it! Welcome to your new cat! Let me know if you need anything else.", time: -23 * 60 * 60 * 1000, reactions: [{ emoji: "🎉", userId: tenants[2].userId as Id<"users"> }, { emoji: "😺", userId: ownerUser._id }] },
                ],
                unread: 0,
            },
            {
                tenant: tenants[3],
                messages: [
                    { sender: "tenant", content: "Hi! The heating system seems to be making a strange noise. It's like a clicking sound every few minutes.", time: -4 * 60 * 60 * 1000 },
                    { sender: "owner", content: "Thanks for reporting this, Lisa. Can you tell me more about when it happens? Is it constant or only when the heat kicks on?", time: -3.5 * 60 * 60 * 1000 },
                    { sender: "tenant", content: "It happens mostly when the heat first turns on. It clicks for about 30 seconds then stops.", time: -3 * 60 * 60 * 1000 },
                    { sender: "owner", content: "That's helpful information. It sounds like it might be the heat exchanger expanding. I'll have our HVAC technician come check it out. Are you available tomorrow morning?", time: -2.5 * 60 * 60 * 1000 },
                    { sender: "tenant", content: "Yes, I work from home so any time works for me.", time: -2 * 60 * 60 * 1000 },
                ],
                unread: 2,
            },
        ];

        for (const convData of conversationData) {
            const tenant = convData.tenant;
            const tenantUser = tenant.userId ? await ctx.db.get(tenant.userId) : null;
            const property = await ctx.db.get(tenant.propertyId);
            const unit = await ctx.db.get(tenant.unitId);

            // Build unread counts
            const unreadCounts: Record<string, number> = {};
            if (convData.unread > 0) {
                unreadCounts[ownerUser._id] = convData.unread;
            }

            // Create conversation
            const lastMessage = convData.messages[convData.messages.length - 1];
            const conversationId = await ctx.db.insert("conversations", {
                organizationId: org._id,
                participants: [
                    {
                        userId: ownerUser._id,
                        role: "owner",
                        name: `${ownerUser.firstName || ""} ${ownerUser.lastName || ""}`.trim() || "Property Owner",
                    },
                    {
                        userId: tenantUser?._id || ownerUser._id,
                        role: "tenant",
                        name: `${tenant.firstName} ${tenant.lastName}`,
                    },
                ],
                tenantId: tenant._id,
                propertyId: tenant.propertyId,
                unitId: tenant.unitId,
                lastMessageAt: now + lastMessage.time,
                lastMessagePreview: lastMessage.content.substring(0, 100),
                unreadCounts: unreadCounts,
                status: "active",
                createdAt: now + convData.messages[0].time - 60000,
                updatedAt: now + lastMessage.time,
            });

            createdConversations.push(conversationId);

            // Create messages
            for (const msgData of convData.messages) {
                const senderId = msgData.sender === "owner" 
                    ? ownerUser._id 
                    : (tenantUser?._id || ownerUser._id);

                const messageId = await ctx.db.insert("messages", {
                    conversationId,
                    senderId,
                    content: msgData.content,
                    attachments: [],
                    reactions: msgData.reactions?.map(r => ({
                        ...r,
                        createdAt: now + msgData.time + 60000,
                    })),
                    readBy: [{ userId: senderId, readAt: now + msgData.time }],
                    createdAt: now + msgData.time,
                });

                createdMessages.push(messageId);
            }
        }

        return {
            success: true,
            message: "Messages seeded successfully",
            data: {
                conversations: createdConversations.length,
                messages: createdMessages.length,
            },
        };
    },
});

/**
 * Seed billing data (invoices and payments)
 */
export const seedBillingData = mutation({
    args: {},
    handler: async (ctx) => {
        // Get existing org, tenants, and leases
        const orgs = await ctx.db.query("organizations").take(1);
        if (orgs.length === 0) {
            return { success: false, message: "Please run seedDatabase first" };
        }
        const org = orgs[0];

        // Check if we already have invoices
        const existingInvoices = await ctx.db.query("invoices").take(1);
        if (existingInvoices.length > 0) {
            return { success: false, message: "Billing data already seeded" };
        }

        const tenants = await ctx.db.query("tenants").collect();
        if (tenants.length === 0) {
            return { success: false, message: "No tenants found. Please run seedDatabase first" };
        }

        const now = Date.now();
        const createdInvoices: Id<"invoices">[] = [];
        const createdPayments: Id<"payments">[] = [];

        // Create invoices and payments for each tenant
        for (let i = 0; i < Math.min(tenants.length, 6); i++) {
            const tenant = tenants[i];
            if (!tenant.leaseId) continue;

            const lease = await ctx.db.get(tenant.leaseId);
            if (!lease) continue;

            const unit = await ctx.db.get(tenant.unitId);
            if (!unit) continue;

            // Determine invoice status based on index
            const statuses: Array<"paid" | "sent" | "overdue"> = ["paid", "paid", "paid", "sent", "overdue", "paid"];
            const status = statuses[i % statuses.length];
            const isPaid = status === "paid";

            // Create invoice
            const invoiceNumber = `INV-2026-${String(i + 1).padStart(3, "0")}`;
            const dueDate = now - (10 - i * 3) * 24 * 60 * 60 * 1000; // Stagger due dates
            const rentAmount = lease.monthlyRent || 1500;

            const invoiceId = await ctx.db.insert("invoices", {
                organizationId: org._id,
                tenantId: tenant._id,
                leaseId: tenant.leaseId,
                invoiceNumber,
                lineItems: [
                    { description: "Monthly Rent - January 2026", amount: rentAmount, type: "rent" },
                ],
                subtotal: rentAmount,
                total: rentAmount,
                amountPaid: isPaid ? rentAmount : 0,
                amountDue: isPaid ? 0 : rentAmount,
                issueDate: dueDate - 7 * 24 * 60 * 60 * 1000,
                dueDate,
                status,
                reminderCount: 0,
                createdAt: now,
                updatedAt: now,
            });
            createdInvoices.push(invoiceId);

            // Create payment if paid
            if (isPaid) {
                const paymentMethods: Array<"ach" | "card" | "check"> = ["ach", "ach", "card", "ach", "card", "check"];
                const paymentId = await ctx.db.insert("payments", {
                    organizationId: org._id,
                    tenantId: tenant._id,
                    leaseId: tenant.leaseId,
                    unitId: tenant.unitId,
                    type: "rent",
                    amount: rentAmount,
                    status: "completed",
                    paymentMethod: paymentMethods[i % paymentMethods.length],
                    dueDate,
                    paidAt: dueDate + (Math.random() * 2 - 1) * 24 * 60 * 60 * 1000,
                    isLate: false,
                    createdAt: now,
                    updatedAt: now,
                });
                createdPayments.push(paymentId);
            }
        }

        return {
            success: true,
            message: "Billing data seeded successfully",
            data: {
                invoices: createdInvoices.length,
                payments: createdPayments.length,
            },
        };
    },
});
