import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/pricing',
    '/features',
    '/about',
    '/contact',
    '/blog(.*)',
    '/listings(.*)',
    '/search(.*)',
    '/map(.*)',
    '/for-landlords(.*)',
    '/for-tenants(.*)',
    '/help(.*)',
    '/terms(.*)',
    '/privacy(.*)',
    '/security(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
])

export const proxy = clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
        await auth.protect()
    }
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
