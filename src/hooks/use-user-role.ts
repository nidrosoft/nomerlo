import { useUser } from '@clerk/nextjs'

export type UserRole =
    | 'super_admin'
    | 'owner'
    | 'property_manager'
    | 'staff'
    | 'tenant'
    | 'maintenance'

export function useUserRole() {
    const { user, isLoaded } = useUser()

    // Coming soon: Fetch user role from Convex
    const role: UserRole | null = null
    const isLoading = !isLoaded

    return {
        role,
        isLoading,
        isOwner: role === 'owner',
        isTenant: role === 'tenant',
        isMaintenance: role === 'maintenance',
        isAdmin: role === 'super_admin',
    }
}
