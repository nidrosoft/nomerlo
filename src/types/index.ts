export type UserRole =
    | 'super_admin'
    | 'owner'
    | 'property_manager'
    | 'staff'
    | 'tenant'
    | 'maintenance'

export type OrganizationType =
    | 'individual'
    | 'business'
    | 'property_manager'

export interface User {
    _id: string
    clerkId: string
    email: string
    role: UserRole
    firstName?: string
    lastName?: string
    imageUrl?: string
}
