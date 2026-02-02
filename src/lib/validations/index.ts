import { z } from 'zod'

// Coming soon: Zod validation schemas

export const userSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
})

export const propertySchema = z.object({
    name: z.string().min(1),
    type: z.enum([
        'single_family',
        'multi_family',
        'apartment',
        'condo',
        'townhouse',
        'commercial',
        'mixed_use',
    ]),
    address: z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(2).max(2),
        zip: z.string().min(5).max(10),
        country: z.string().default('US'),
    }),
})

export const unitSchema = z.object({
    unitNumber: z.string().min(1),
    bedrooms: z.number().min(0),
    bathrooms: z.number().min(0),
    sqft: z.number().optional(),
    marketRent: z.number().min(0),
})

export const maintenanceRequestSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    priority: z.enum(['low', 'medium', 'high', 'emergency']),
})

export type UserInput = z.infer<typeof userSchema>
export type PropertyInput = z.infer<typeof propertySchema>
export type UnitInput = z.infer<typeof unitSchema>
export type MaintenanceRequestInput = z.infer<typeof maintenanceRequestSchema>
