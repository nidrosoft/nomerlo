import { useQuery } from 'convex/react'

export function useRealTime() {
    // Coming soon: Real-time subscription hooks

    return {
        isConnected: true,
        lastUpdated: null,
    }
}
