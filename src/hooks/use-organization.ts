import { useUser } from '@clerk/nextjs'

export function useOrganization() {
    const { user, isLoaded } = useUser()

    // Coming soon: Fetch organization from Convex
    const organization = null
    const isLoading = !isLoaded

    return {
        organization,
        isLoading,
        organizationId: null,
    }
}
