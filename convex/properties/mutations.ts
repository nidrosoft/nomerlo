import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create a new property with units
export const createProperty = mutation({
    args: {
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
        }),
        // Details
        yearBuilt: v.optional(v.number()),
        totalSqft: v.optional(v.number()),
        // Features
        amenities: v.array(v.string()),
        // Units
        units: v.array(v.object({
            name: v.string(),
            unitNumber: v.string(),
            bedrooms: v.number(),
            bathrooms: v.number(),
            sqft: v.optional(v.number()),
            floor: v.optional(v.number()),
            marketRent: v.number(),
            depositAmount: v.optional(v.number()),
            features: v.array(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Create the property
        const propertyId = await ctx.db.insert("properties", {
            organizationId: args.organizationId,
            name: args.name,
            type: args.type,
            address: {
                ...args.address,
                latitude: undefined,
                longitude: undefined,
            },
            yearBuilt: args.yearBuilt,
            totalUnits: args.units.length,
            totalSqft: args.totalSqft,
            lotSize: undefined,
            parkingSpaces: undefined,
            images: [],
            amenities: args.amenities,
            status: "active",
            purchasePrice: undefined,
            purchaseDate: undefined,
            currentValue: undefined,
            createdAt: now,
            updatedAt: now,
        });

        // Create units for the property
        const unitIds = await Promise.all(
            args.units.map(async (unit) => {
                return await ctx.db.insert("units", {
                    organizationId: args.organizationId,
                    propertyId,
                    unitNumber: unit.unitNumber,
                    name: unit.name,
                    bedrooms: unit.bedrooms,
                    bathrooms: unit.bathrooms,
                    sqft: unit.sqft,
                    floor: unit.floor,
                    features: unit.features,
                    marketRent: unit.marketRent,
                    depositAmount: unit.depositAmount,
                    images: [],
                    status: "vacant",
                    currentLeaseId: undefined,
                    currentTenantId: undefined,
                    createdAt: now,
                    updatedAt: now,
                });
            })
        );

        return { propertyId, unitIds };
    },
});

// Update an existing property
export const updateProperty = mutation({
    args: {
        propertyId: v.id("properties"),
        name: v.optional(v.string()),
        type: v.optional(v.union(
            v.literal("single_family"),
            v.literal("multi_family"),
            v.literal("apartment"),
            v.literal("condo"),
            v.literal("townhouse"),
            v.literal("commercial"),
            v.literal("mixed_use")
        )),
        address: v.optional(v.object({
            street: v.string(),
            unit: v.optional(v.string()),
            city: v.string(),
            state: v.string(),
            zip: v.string(),
            country: v.string(),
        })),
        yearBuilt: v.optional(v.number()),
        totalSqft: v.optional(v.number()),
        amenities: v.optional(v.array(v.string())),
        status: v.optional(v.union(
            v.literal("active"),
            v.literal("inactive"),
            v.literal("archived")
        )),
    },
    handler: async (ctx, args) => {
        const { propertyId, ...updates } = args;
        
        const property = await ctx.db.get(propertyId);
        if (!property) {
            throw new Error("Property not found");
        }

        // Build update object with only provided fields
        const updateData: Record<string, unknown> = {
            updatedAt: Date.now(),
        };

        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.type !== undefined) updateData.type = updates.type;
        if (updates.address !== undefined) {
            updateData.address = {
                ...updates.address,
                latitude: property.address.latitude,
                longitude: property.address.longitude,
            };
        }
        if (updates.yearBuilt !== undefined) updateData.yearBuilt = updates.yearBuilt;
        if (updates.totalSqft !== undefined) updateData.totalSqft = updates.totalSqft;
        if (updates.amenities !== undefined) updateData.amenities = updates.amenities;
        if (updates.status !== undefined) updateData.status = updates.status;

        await ctx.db.patch(propertyId, updateData);

        return { success: true };
    },
});

// Delete a property (soft delete by setting status to archived)
export const archiveProperty = mutation({
    args: { propertyId: v.id("properties") },
    handler: async (ctx, args) => {
        const property = await ctx.db.get(args.propertyId);
        if (!property) {
            throw new Error("Property not found");
        }

        await ctx.db.patch(args.propertyId, {
            status: "archived",
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

// Add images to a property
export const addPropertyImages = mutation({
    args: {
        propertyId: v.id("properties"),
        images: v.array(v.object({
            url: v.string(),
            storageId: v.optional(v.id("_storage")),
            caption: v.optional(v.string()),
            isPrimary: v.boolean(),
        })),
    },
    handler: async (ctx, args) => {
        const property = await ctx.db.get(args.propertyId);
        if (!property) {
            throw new Error("Property not found");
        }

        // Merge with existing images
        const existingImages = property.images || [];
        const newImages = [...existingImages, ...args.images];

        // Ensure only one primary image
        let hasPrimary = false;
        const processedImages = newImages.map((img) => {
            if (img.isPrimary && !hasPrimary) {
                hasPrimary = true;
                return img;
            }
            return { ...img, isPrimary: false };
        });

        await ctx.db.patch(args.propertyId, {
            images: processedImages,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});
