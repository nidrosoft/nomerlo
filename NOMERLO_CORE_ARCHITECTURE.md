# NOMERLO - Core Platform Architecture
## Technical Foundation & Implementation Blueprint

**Version:** 1.0  
**Last Updated:** January 2026  
**Stack:** Next.js 14+ (App Router) + Convex + Clerk Auth + Tailwind CSS  
**Target:** Development-ready architecture for Cursor IDE

---

# TABLE OF CONTENTS

1. [Technology Stack & Project Setup](#1-technology-stack--project-setup)
2. [Project Directory Structure](#2-project-directory-structure)
3. [Multi-Tenancy Architecture](#3-multi-tenancy-architecture)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Complete Routing Architecture](#5-complete-routing-architecture)
6. [Convex Database Schema](#6-convex-database-schema)
7. [Convex Functions (API Layer)](#7-convex-functions-api-layer)
8. [Landing Page & Public Routes](#8-landing-page--public-routes)
9. [Onboarding Flows](#9-onboarding-flows)
10. [Real-Time Data Architecture](#10-real-time-data-architecture)
11. [File Storage & Media](#11-file-storage--media)
12. [Third-Party Integrations](#12-third-party-integrations)
13. [Environment Configuration](#13-environment-configuration)
14. [Deployment Architecture](#14-deployment-architecture)

---

# 1. TECHNOLOGY STACK & PROJECT SETUP

## 1.1 Core Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14+ (App Router) | React framework with SSR/SSG |
| **Backend/Database** | Convex | Real-time database + serverless functions |
| **Authentication** | Clerk | User authentication & management |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS + component library |
| **Forms** | React Hook Form + Zod | Form handling + validation |
| **State** | Convex React hooks | Real-time state management |
| **Payments** | Stripe | Subscription billing + rent collection |
| **File Storage** | Convex File Storage | Document/image storage |
| **Email** | Resend | Transactional emails |
| **AI** | OpenAI / Anthropic | AI assistant features |

## 1.2 Project Initialization

```bash
# Create Next.js project
npx create-next-app@latest nomerlo --typescript --tailwind --eslint --app --src-dir

# Install core dependencies
npm install convex @clerk/nextjs @clerk/themes
npm install @tanstack/react-query zod react-hook-form @hookform/resolvers
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install date-fns

# Install shadcn/ui
npx shadcn-ui@latest init

# Initialize Convex
npx convex dev
```

## 1.3 Package.json Scripts

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:next dev:convex",
    "dev:next": "next dev",
    "dev:convex": "convex dev",
    "build": "convex deploy && next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

---

# 2. PROJECT DIRECTORY STRUCTURE

```
nomerlo/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Public marketing pages (no auth)
│   │   │   ├── page.tsx              # Landing page (/)
│   │   │   ├── pricing/
│   │   │   ├── features/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── blog/
│   │   │   └── layout.tsx            # Marketing layout
│   │   │
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   ├── sign-up/[[...sign-up]]/
│   │   │   └── layout.tsx            # Auth layout (centered)
│   │   │
│   │   ├── (marketplace)/            # Public rental marketplace
│   │   │   ├── listings/
│   │   │   │   ├── page.tsx          # Browse listings
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Listing detail
│   │   │   │       └── apply/        # Application form
│   │   │   ├── search/
│   │   │   └── layout.tsx            # Marketplace layout
│   │   │
│   │   ├── (onboarding)/             # Onboarding flows
│   │   │   ├── owner/
│   │   │   │   ├── page.tsx          # Owner onboarding
│   │   │   │   ├── property/
│   │   │   │   ├── billing/
│   │   │   │   └── complete/
│   │   │   ├── tenant/
│   │   │   │   └── [inviteCode]/     # Tenant invitation flow
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── owner/                # Owner/Landlord Portal
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   ├── properties/
│   │   │   │   ├── units/
│   │   │   │   ├── tenants/
│   │   │   │   ├── leases/
│   │   │   │   ├── applications/
│   │   │   │   ├── billing/
│   │   │   │   ├── maintenance/
│   │   │   │   ├── documents/
│   │   │   │   ├── messages/
│   │   │   │   ├── reports/
│   │   │   │   ├── calendar/
│   │   │   │   ├── settings/
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── tenant/               # Tenant Portal
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   ├── payments/
│   │   │   │   ├── maintenance/
│   │   │   │   ├── documents/
│   │   │   │   ├── messages/
│   │   │   │   ├── notices/
│   │   │   │   ├── profile/
│   │   │   │   ├── settings/
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── maintenance/          # Maintenance Portal
│   │   │   │   ├── page.tsx          # Dashboard
│   │   │   │   ├── work-orders/
│   │   │   │   ├── schedule/
│   │   │   │   ├── inventory/
│   │   │   │   ├── reports/
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   └── layout.tsx            # Dashboard wrapper (auth check)
│   │   │
│   │   ├── (admin)/                  # Super Admin Portal
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx          # Admin dashboard
│   │   │   │   ├── owners/
│   │   │   │   ├── subscriptions/
│   │   │   │   ├── analytics/
│   │   │   │   ├── support/
│   │   │   │   ├── settings/
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                      # API routes (webhooks, etc.)
│   │   │   ├── webhooks/
│   │   │   │   ├── clerk/
│   │   │   │   └── stripe/
│   │   │   └── [...]/
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── shared/                   # Shared components
│   │   │   ├── navigation/
│   │   │   ├── forms/
│   │   │   ├── tables/
│   │   │   ├── modals/
│   │   │   └── cards/
│   │   ├── marketing/                # Landing page components
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── owner/
│   │   │   ├── tenant/
│   │   │   └── maintenance/
│   │   └── providers/                # Context providers
│   │
│   ├── lib/
│   │   ├── utils.ts                  # Utility functions
│   │   ├── validations/              # Zod schemas
│   │   └── constants.ts              # App constants
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-user-role.ts
│   │   ├── use-organization.ts
│   │   └── use-real-time.ts
│   │
│   ├── types/                        # TypeScript types
│   │   └── index.ts
│   │
│   └── styles/
│       └── globals.css
│
├── convex/                           # Convex backend
│   ├── _generated/                   # Auto-generated (don't edit)
│   ├── schema.ts                     # Database schema
│   ├── auth.config.ts                # Clerk integration
│   │
│   ├── users/                        # User functions
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── organizations/                # Organization (owner accounts)
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── properties/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── units/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── tenants/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── leases/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── payments/
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── actions.ts                # Stripe integration
│   │
│   ├── maintenance/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── documents/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── messages/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── listings/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── applications/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── notifications/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── subscriptions/                # SaaS billing
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── actions.ts
│   │
│   ├── admin/                        # Super admin functions
│   │   ├── queries.ts
│   │   └── mutations.ts
│   │
│   ├── lib/                          # Shared utilities
│   │   ├── permissions.ts
│   │   └── helpers.ts
│   │
│   ├── http.ts                       # HTTP endpoints (webhooks)
│   └── crons.ts                      # Scheduled jobs
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local                        # Environment variables
├── convex.json                       # Convex config
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

# 3. MULTI-TENANCY ARCHITECTURE

## 3.1 Tenancy Model

Nomerlo uses a **single-database multi-tenant architecture** where all data is stored in one Convex database, isolated by `organizationId`.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        NOMERLO PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                     SHARED DATABASE (Convex)                      │   │
│  │                                                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │   │
│  │  │   Org A     │  │   Org B     │  │   Org C     │               │   │
│  │  │ (Landlord1) │  │ (Landlord2) │  │ (Landlord3) │               │   │
│  │  │             │  │             │  │             │               │   │
│  │  │ Properties  │  │ Properties  │  │ Properties  │               │   │
│  │  │ Tenants     │  │ Tenants     │  │ Tenants     │               │   │
│  │  │ Leases      │  │ Leases      │  │ Leases      │               │   │
│  │  │ Payments    │  │ Payments    │  │ Payments    │               │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘               │   │
│  │                                                                   │   │
│  │  Every table has organizationId for data isolation                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 3.2 User Hierarchy

```
                    ┌─────────────────┐
                    │   SUPER ADMIN   │
                    │   (Nomerlo)     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  ORGANIZATION │    │  ORGANIZATION │    │  ORGANIZATION │
│   (Owner A)   │    │   (Owner B)   │    │   (Owner C)   │
└───────┬───────┘    └───────────────┘    └───────────────┘
        │
        │ Has roles:
        ├─► Owner (full access)
        ├─► Property Manager (assigned properties)
        └─► Staff (limited access)
        │
        │ Invites:
        ▼
┌───────────────────────────────────────────────────────┐
│                       TENANTS                          │
│  (Linked to specific unit within the organization)    │
└───────────────────────────────────────────────────────┘
        │
        │ Can assign:
        ▼
┌───────────────────────────────────────────────────────┐
│                  MAINTENANCE STAFF                     │
│  (Internal staff or external vendors)                 │
└───────────────────────────────────────────────────────┘
```

## 3.3 Role Definitions

```typescript
// types/index.ts

export type UserRole = 
  | 'super_admin'      // Nomerlo staff - platform-wide access
  | 'owner'            // Organization owner - full org access
  | 'property_manager' // Manager - assigned properties only
  | 'staff'            // Staff - limited access
  | 'tenant'           // Tenant - their unit only
  | 'maintenance'      // Maintenance - work orders only

export type Permission = 
  | 'properties:read' | 'properties:write' | 'properties:delete'
  | 'units:read' | 'units:write' | 'units:delete'
  | 'tenants:read' | 'tenants:write' | 'tenants:invite'
  | 'leases:read' | 'leases:write' | 'leases:sign'
  | 'payments:read' | 'payments:write' | 'payments:process'
  | 'maintenance:read' | 'maintenance:write' | 'maintenance:assign'
  | 'documents:read' | 'documents:write' | 'documents:delete'
  | 'reports:read' | 'reports:export'
  | 'settings:read' | 'settings:write'
  | 'billing:read' | 'billing:write'
  | 'team:read' | 'team:write' | 'team:invite'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: ['*'], // All permissions
  owner: [
    'properties:read', 'properties:write', 'properties:delete',
    'units:read', 'units:write', 'units:delete',
    'tenants:read', 'tenants:write', 'tenants:invite',
    'leases:read', 'leases:write', 'leases:sign',
    'payments:read', 'payments:write', 'payments:process',
    'maintenance:read', 'maintenance:write', 'maintenance:assign',
    'documents:read', 'documents:write', 'documents:delete',
    'reports:read', 'reports:export',
    'settings:read', 'settings:write',
    'billing:read', 'billing:write',
    'team:read', 'team:write', 'team:invite',
  ],
  property_manager: [
    'properties:read',
    'units:read', 'units:write',
    'tenants:read', 'tenants:write', 'tenants:invite',
    'leases:read', 'leases:write',
    'payments:read',
    'maintenance:read', 'maintenance:write', 'maintenance:assign',
    'documents:read', 'documents:write',
    'reports:read',
  ],
  staff: [
    'properties:read',
    'units:read',
    'tenants:read',
    'maintenance:read', 'maintenance:write',
    'documents:read',
  ],
  tenant: [
    'payments:read', 'payments:write',
    'maintenance:read', 'maintenance:write',
    'documents:read',
  ],
  maintenance: [
    'maintenance:read', 'maintenance:write',
    'properties:read',
    'units:read',
  ],
}
```

---

# 4. AUTHENTICATION & AUTHORIZATION

## 4.1 Clerk Configuration

```typescript
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

## 4.2 Authentication Middleware

```typescript
// src/middleware.ts
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
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

## 4.3 Convex Auth Helpers

```typescript
// convex/lib/permissions.ts
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get authenticated user with their role and organization
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// Verify user has access to organization
export async function verifyOrgAccess(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">
) {
  const user = await getAuthenticatedUser(ctx);
  
  // Super admins have access to all orgs
  if (user.role === "super_admin") {
    return user;
  }

  // Check if user belongs to organization
  const membership = await ctx.db
    .query("organizationMembers")
    .withIndex("by_user_org", (q) => 
      q.eq("userId", user._id).eq("organizationId", organizationId)
    )
    .unique();

  if (!membership) {
    throw new Error("Unauthorized: No access to this organization");
  }

  return { ...user, orgRole: membership.role };
}

// Check specific permission
export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.includes('*') || permissions.includes(permission);
}

// Require permission or throw
export async function requirePermission(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">,
  permission: Permission
) {
  const user = await verifyOrgAccess(ctx, organizationId);
  
  if (!hasPermission(user.orgRole || user.role, permission)) {
    throw new Error(`Unauthorized: Missing permission ${permission}`);
  }

  return user;
}
```

## 4.4 Frontend Auth Provider

```typescript
// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ConvexReactClient } from "convex/react"
import { dark } from '@clerk/themes'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#6366f1' }
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
```

---

# 5. COMPLETE ROUTING ARCHITECTURE

## 5.1 Route Map Overview

```
NOMERLO ROUTE ARCHITECTURE
══════════════════════════════════════════════════════════════════════════

PUBLIC ROUTES (No Authentication Required)
──────────────────────────────────────────

MARKETING PAGES
/                                    Landing page
/pricing                             Pricing plans
/features                            Feature showcase
/about                               About Nomerlo
/contact                             Contact form
/blog                                Blog listing
/blog/[slug]                         Blog post
/help                                Help center
/help/[category]/[article]           Help article
/terms                               Terms of service
/privacy                             Privacy policy

MARKETPLACE (Rental Listings)
/listings                            Browse all listings
/listings?location=...&price=...     Filtered listings
/listings/[id]                       Listing detail
/listings/[id]/apply                 Rental application (auth required)
/search                              Advanced search
/map                                 Map view

AUTH ROUTES
/sign-in                             Sign in page
/sign-up                             Sign up page
/sign-up/owner                       Owner registration
/sign-up/tenant                      Tenant registration (from invite)
/forgot-password                     Password reset
/verify-email                        Email verification

══════════════════════════════════════════════════════════════════════════

PROTECTED ROUTES (Authentication Required)
──────────────────────────────────────────

ONBOARDING
/onboarding/owner                    Owner onboarding start
/onboarding/owner/business           Business details
/onboarding/owner/property           First property setup
/onboarding/owner/billing            Payment setup
/onboarding/owner/complete           Onboarding complete

/onboarding/tenant/[inviteCode]      Tenant invitation acceptance

──────────────────────────────────────────────────────────────────────────

OWNER PORTAL (/owner/*)
──────────────────────────────────────────────────────────────────────────

Dashboard
/owner                               Main dashboard
/owner/notifications                 Notification center

Properties
/owner/properties                    Property list
/owner/properties/new                Add property
/owner/properties/[id]               Property detail
/owner/properties/[id]/edit          Edit property
/owner/properties/[id]/units         Manage units
/owner/properties/[id]/units/new     Add unit
/owner/properties/[id]/units/[unitId]           Unit detail
/owner/properties/[id]/units/[unitId]/edit      Edit unit
/owner/properties/[id]/settings      Property settings

Listings
/owner/listings                      Active listings
/owner/listings/new                  Create listing
/owner/listings/[id]                 Listing detail
/owner/listings/[id]/edit            Edit listing
/owner/listings/[id]/analytics       Listing analytics

Applications
/owner/applications                  All applications
/owner/applications/[id]             Application detail
/owner/applications/[id]/screening   Screening report

Tenants
/owner/tenants                       Tenant directory
/owner/tenants/invite                Invite tenant
/owner/tenants/[id]                  Tenant profile
/owner/tenants/[id]/ledger           Tenant ledger
/owner/tenants/[id]/history          Payment history

Leases
/owner/leases                        All leases
/owner/leases/new                    Create lease
/owner/leases/[id]                   Lease detail
/owner/leases/[id]/edit              Edit lease
/owner/leases/[id]/amendments        Lease amendments
/owner/leases/[id]/renew             Lease renewal

Billing & Payments
/owner/billing                       Billing overview
/owner/billing/invoices              Invoice list
/owner/billing/invoices/new          Create invoice
/owner/billing/invoices/[id]         Invoice detail
/owner/billing/payments              Payment history
/owner/billing/late-fees             Late fee management
/owner/billing/settings              Payment settings

Expenses
/owner/expenses                      Expense tracker
/owner/expenses/new                  Add expense
/owner/expenses/[id]                 Expense detail
/owner/expenses/categories           Expense categories
/owner/expenses/vendors              Vendor management

Maintenance
/owner/maintenance                   Work order list
/owner/maintenance/[id]              Work order detail
/owner/maintenance/vendors           Vendor directory
/owner/maintenance/settings          Maintenance settings

Documents
/owner/documents                     Document library
/owner/documents/upload              Upload document
/owner/documents/templates           Document templates
/owner/documents/[id]                Document detail

Messages
/owner/messages                      Message inbox
/owner/messages/[conversationId]     Conversation thread
/owner/messages/new                  New message
/owner/messages/announcements        Send announcement

Reports
/owner/reports                       Report dashboard
/owner/reports/income                Income statement
/owner/reports/expenses              Expense report
/owner/reports/rent-roll             Rent roll
/owner/reports/occupancy             Occupancy report
/owner/reports/tax                   Tax documents

Calendar
/owner/calendar                      Calendar view
/owner/calendar/tours                Scheduled tours
/owner/calendar/events               All events

Settings
/owner/settings                      General settings
/owner/settings/profile              Profile settings
/owner/settings/team                 Team management
/owner/settings/team/invite          Invite team member
/owner/settings/billing              Subscription billing
/owner/settings/integrations         Third-party integrations
/owner/settings/notifications        Notification preferences
/owner/settings/security             Security settings
/owner/settings/api                  API keys

──────────────────────────────────────────────────────────────────────────

TENANT PORTAL (/tenant/*)
──────────────────────────────────────────────────────────────────────────

Dashboard
/tenant                              Main dashboard
/tenant/notifications                Notifications

Payments
/tenant/payments                     Payment overview
/tenant/payments/pay                 Make payment
/tenant/payments/history             Payment history
/tenant/payments/autopay             Auto-pay settings
/tenant/payments/methods             Payment methods

Maintenance
/tenant/maintenance                  My requests
/tenant/maintenance/new              Submit request
/tenant/maintenance/[id]             Request detail

Documents
/tenant/documents                    My documents
/tenant/documents/lease              View lease
/tenant/documents/receipts           Payment receipts

Messages
/tenant/messages                     Message inbox
/tenant/messages/[conversationId]    Conversation thread

Notices
/tenant/notices                      Notice board
/tenant/notices/[id]                 Notice detail

Profile
/tenant/profile                      My profile
/tenant/profile/edit                 Edit profile
/tenant/profile/vehicles             Vehicle info
/tenant/profile/emergency-contacts   Emergency contacts

Settings
/tenant/settings                     Settings
/tenant/settings/notifications       Notification preferences
/tenant/settings/security            Security settings

──────────────────────────────────────────────────────────────────────────

MAINTENANCE PORTAL (/maintenance/*)
──────────────────────────────────────────────────────────────────────────

Dashboard
/maintenance                         Dashboard

Work Orders
/maintenance/work-orders             All work orders
/maintenance/work-orders/[id]        Work order detail
/maintenance/work-orders/[id]/update Update status

Schedule
/maintenance/schedule                Schedule calendar
/maintenance/schedule/availability   Set availability

Inventory
/maintenance/inventory               Parts inventory
/maintenance/inventory/low-stock     Low stock alerts

Reports
/maintenance/reports                 Performance reports
/maintenance/reports/time-tracking   Time logs

──────────────────────────────────────────────────────────────────────────

ADMIN PORTAL (/admin/*)
──────────────────────────────────────────────────────────────────────────

Dashboard
/admin                               Admin dashboard

Owner Management
/admin/owners                        All owners
/admin/owners/[id]                   Owner detail
/admin/owners/[id]/impersonate       Impersonate owner

Subscriptions
/admin/subscriptions                 All subscriptions
/admin/subscriptions/plans           Plan management
/admin/subscriptions/[id]            Subscription detail

Analytics
/admin/analytics                     Platform analytics
/admin/analytics/revenue             Revenue metrics
/admin/analytics/usage               Usage metrics

Support
/admin/support                       Support tickets
/admin/support/[id]                  Ticket detail

Settings
/admin/settings                      Platform settings
/admin/settings/features             Feature flags
/admin/settings/policies             Policy management

══════════════════════════════════════════════════════════════════════════
```

## 5.2 Route Groups Explained

```typescript
// Next.js App Router uses route groups for organization:

// (marketing) - Public marketing pages
// - Shares marketing layout with header/footer
// - No authentication required
// - SEO optimized with metadata

// (auth) - Authentication pages
// - Centered layout for sign-in/sign-up forms
// - Clerk components rendered here

// (marketplace) - Public rental marketplace
// - Browse listings without account
// - Application requires authentication

// (onboarding) - Onboarding flows
// - Progressive multi-step forms
// - Requires authentication
// - Specific to user type (owner/tenant)

// (dashboard) - Protected application
// - Requires authentication
// - Role-based portal access
// - Sidebar navigation layout

// (admin) - Super admin portal
// - Requires super_admin role
// - Platform management
```

## 5.3 Dynamic Route Handling

```typescript
// src/app/(dashboard)/owner/properties/[id]/page.tsx
import { PropertyDetail } from '@/components/dashboard/owner/property-detail'

interface Props {
  params: { id: string }
}

export default function PropertyPage({ params }: Props) {
  return <PropertyDetail propertyId={params.id} />
}

// Generate static paths for better performance (optional)
export async function generateStaticParams() {
  // Could fetch property IDs from Convex for static generation
  return []
}
```

---

# 6. CONVEX DATABASE SCHEMA

## 6.1 Complete Schema Definition

```typescript
// convex/schema.ts
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
    .index("by_status", ["organizationId", "status"])
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
    
    // Unread tracking per participant
    unreadCounts: v.object({}), // { [userId]: number }
    
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
    
    // Read receipts
    readBy: v.array(v.object({
      userId: v.id("users"),
      readAt: v.number(),
    })),
    
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
    
    // Stripe
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
    
    // Limits
    unitLimit: v.number(),
    userLimit: v.number(),
    
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
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["organizationId"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"]),

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
});
```

---

# 7. CONVEX FUNCTIONS (API LAYER)

## 7.1 Function Organization Pattern

```typescript
// Each domain has:
// - queries.ts  (read operations)
// - mutations.ts (write operations)
// - actions.ts  (external API calls, optional)
```

## 7.2 Example: Properties Module

```typescript
// convex/properties/queries.ts
import { query } from "../_generated/server";
import { v } from "convex/values";
import { verifyOrgAccess, requirePermission } from "../lib/permissions";

export const list = query({
  args: {
    organizationId: v.id("organizations"),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("archived")
    )),
  },
  handler: async (ctx, args) => {
    await verifyOrgAccess(ctx, args.organizationId);

    let query = ctx.db
      .query("properties")
      .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId));

    if (args.status) {
      query = ctx.db
        .query("properties")
        .withIndex("by_org_status", (q) => 
          q.eq("organizationId", args.organizationId).eq("status", args.status!)
        );
    }

    const properties = await query.collect();

    // Enrich with unit counts and occupancy
    const enriched = await Promise.all(
      properties.map(async (property) => {
        const units = await ctx.db
          .query("units")
          .withIndex("by_property", (q) => q.eq("propertyId", property._id))
          .collect();

        const occupied = units.filter((u) => u.status === "occupied").length;

        return {
          ...property,
          unitCount: units.length,
          occupiedCount: occupied,
          vacantCount: units.length - occupied,
          occupancyRate: units.length > 0 ? occupied / units.length : 0,
        };
      })
    );

    return enriched;
  },
});

export const getById = query({
  args: {
    propertyId: v.id("properties"),
  },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) throw new Error("Property not found");

    await verifyOrgAccess(ctx, property.organizationId);

    // Get units
    const units = await ctx.db
      .query("units")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();

    // Get recent maintenance
    const maintenance = await ctx.db
      .query("maintenanceRequests")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .order("desc")
      .take(5);

    return {
      ...property,
      units,
      recentMaintenance: maintenance,
    };
  },
});

// convex/properties/mutations.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requirePermission } from "../lib/permissions";

export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
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
    address: v.object({
      street: v.string(),
      unit: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
    totalUnits: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, args.organizationId, "properties:write");

    const now = Date.now();
    const propertyId = await ctx.db.insert("properties", {
      organizationId: args.organizationId,
      name: args.name,
      type: args.type,
      address: {
        ...args.address,
        latitude: undefined,
        longitude: undefined,
      },
      totalUnits: args.totalUnits,
      images: [],
      amenities: [],
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      organizationId: args.organizationId,
      userId: user._id,
      action: "property.created",
      entityType: "property",
      entityId: propertyId,
      createdAt: now,
    });

    return propertyId;
  },
});

export const update = mutation({
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
    amenities: v.optional(v.array(v.string())),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("archived")
    )),
  },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) throw new Error("Property not found");

    await requirePermission(ctx, property.organizationId, "properties:write");

    const { propertyId, ...updates } = args;
    
    await ctx.db.patch(propertyId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return propertyId;
  },
});
```

## 7.3 Real-Time Query Example

```typescript
// Frontend component using real-time data
"use client"

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function PropertyList({ organizationId }: { organizationId: Id<"organizations"> }) {
  // This automatically updates in real-time when data changes
  const properties = useQuery(api.properties.queries.list, {
    organizationId,
    status: "active",
  });

  if (properties === undefined) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="grid gap-4">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
```

---

# 8. LANDING PAGE & PUBLIC ROUTES

## 8.1 Landing Page Structure

```typescript
// src/app/(marketing)/page.tsx
import { Hero } from '@/components/marketing/hero'
import { Features } from '@/components/marketing/features'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Testimonials } from '@/components/marketing/testimonials'
import { Pricing } from '@/components/marketing/pricing'
import { FAQ } from '@/components/marketing/faq'
import { CTA } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}
```

## 8.2 Marketing Layout

```typescript
// src/app/(marketing)/layout.tsx
import { MarketingNav } from '@/components/marketing/nav'
import { Footer } from '@/components/marketing/footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

## 8.3 Landing Page Sections

```
LANDING PAGE STRUCTURE
══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│  NAVIGATION BAR                                                          │
│  [Logo] [Features] [Pricing] [About] [Help]     [Sign In] [Get Started] │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  HERO SECTION                                                            │
│                                                                          │
│  "Property Management Made Simple"                                       │
│  "The all-in-one platform for landlords who want to spend less time     │
│   managing and more time growing their portfolio."                       │
│                                                                          │
│  [Get Started Free]  [Watch Demo]                                        │
│                                                                          │
│  [Hero Image: Dashboard Preview]                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  TRUST INDICATORS                                                        │
│                                                                          │
│  "Trusted by 5,000+ landlords managing 50,000+ units"                   │
│  [Logo] [Logo] [Logo] [Logo] [Logo]                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  FEATURES GRID                                                           │
│                                                                          │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐         │
│  │ 💳 Rent          │ │ 📋 Listings &    │ │ 🔧 Maintenance   │         │
│  │ Collection       │ │ Applications     │ │ Tracking         │         │
│  │ Same-day ACH     │ │ AI screening     │ │ Real-time        │         │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘         │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐         │
│  │ 📄 Lease         │ │ 📊 Reports &     │ │ 🤖 AI            │         │
│  │ Management       │ │ Analytics        │ │ Assistant        │         │
│  │ E-signatures     │ │ Tax-ready        │ │ 24/7 support     │         │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  HOW IT WORKS                                                            │
│                                                                          │
│  1. Sign Up & Add Properties                                             │
│     ↓                                                                    │
│  2. List Your Vacancies                                                  │
│     ↓                                                                    │
│  3. Screen & Sign Tenants                                                │
│     ↓                                                                    │
│  4. Collect Rent & Manage                                                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  TESTIMONIALS                                                            │
│  "Nomerlo cut my management time in half..."                            │
│  "Finally, a platform that actually works..."                           │
│  "The support is incredible..."                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  PRICING                                                                 │
│                                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   STARTER   │ │   GROWTH    │ │PROFESSIONAL │ │ ENTERPRISE  │       │
│  │   $0/mo     │ │   $29/mo    │ │   $79/mo    │ │  Custom     │       │
│  │  1-3 units  │ │  4-20 units │ │ 21-100 units│ │   100+      │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  FAQ SECTION                                                             │
│  [Accordion of common questions]                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  CTA BANNER                                                              │
│  "Ready to simplify your property management?"                          │
│  [Start Free Trial]                                                      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  FOOTER                                                                  │
│  [Logo]                                                                  │
│  Product: Features | Pricing | Integrations                             │
│  Company: About | Blog | Careers | Contact                              │
│  Resources: Help Center | API Docs | Status                             │
│  Legal: Terms | Privacy | Security                                       │
│                                                                          │
│  © 2026 Nomerlo. All rights reserved.                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 9. ONBOARDING FLOWS

## 9.1 Owner Onboarding

```
OWNER ONBOARDING FLOW
══════════════════════════════════════════════════════════════════════════

Step 1: Sign Up (/sign-up)
─────────────────────────
├── Email/Password or OAuth (Google, etc.)
├── Basic info (name, email)
└── Select account type: "I'm a landlord/property manager"

Step 2: Business Profile (/onboarding/owner/business)
─────────────────────────────────────────────────────
├── Business name (or personal name)
├── Business type (individual/business/PM)
├── Contact information
├── Time zone
└── Currency preference

Step 3: First Property (/onboarding/owner/property)
─────────────────────────────────────────────────────
├── Property address
├── Property type
├── Number of units
└── Quick unit setup (optional)

Step 4: Plan Selection (/onboarding/owner/billing)
──────────────────────────────────────────────────
├── Select subscription plan
├── Enter payment method
└── Start trial or activate

Step 5: Complete (/onboarding/owner/complete)
──────────────────────────────────────────────
├── Success confirmation
├── Quick tips / getting started guide
├── Add more properties (optional)
└── Redirect to dashboard
```

## 9.2 Tenant Onboarding

```
TENANT ONBOARDING FLOW
══════════════════════════════════════════════════════════════════════════

Step 1: Invitation Email
────────────────────────
├── Landlord invites tenant via email
├── Email contains unique invite link
└── Link: /onboarding/tenant/[inviteCode]

Step 2: Accept Invitation (/onboarding/tenant/[inviteCode])
───────────────────────────────────────────────────────────
├── View property/unit details
├── View landlord info
└── Continue to create account

Step 3: Create Account
──────────────────────
├── Email (pre-filled)
├── Create password
├── Phone number
└── Basic profile info

Step 4: Profile Setup
─────────────────────
├── Emergency contacts
├── Vehicle information (optional)
├── Communication preferences
└── Payment method setup

Step 5: Complete
────────────────
├── Welcome to your tenant portal
├── Quick tour of features
└── Redirect to tenant dashboard
```

## 9.3 Onboarding Implementation

```typescript
// src/app/(onboarding)/owner/page.tsx
"use client"

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'

const STEPS = ['business', 'property', 'billing', 'complete']

export default function OwnerOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const { user } = useUser()
  const router = useRouter()
  
  const createOrganization = useMutation(api.organizations.mutations.create)
  const createProperty = useMutation(api.properties.mutations.create)

  // ... step components and logic

  return (
    <div className="max-w-2xl mx-auto py-12">
      {/* Progress indicator */}
      <div className="mb-8">
        <Steps current={currentStep} steps={STEPS} />
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow p-6">
        {currentStep === 0 && <BusinessStep onComplete={() => setCurrentStep(1)} />}
        {currentStep === 1 && <PropertyStep onComplete={() => setCurrentStep(2)} />}
        {currentStep === 2 && <BillingStep onComplete={() => setCurrentStep(3)} />}
        {currentStep === 3 && <CompleteStep onComplete={() => router.push('/owner')} />}
      </div>
    </div>
  )
}
```

---

# 10. REAL-TIME DATA ARCHITECTURE

## 10.1 Convex Real-Time Subscriptions

```typescript
// Convex automatically handles real-time updates
// When data changes, all subscribed clients update immediately

// Example: Real-time notification count
// convex/notifications/queries.ts
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => 
        q.eq("userId", user._id).eq("read", false)
      )
      .collect();

    return unread.length;
  },
});

// Frontend usage
function NotificationBell() {
  const unreadCount = useQuery(api.notifications.queries.getUnreadCount);
  
  return (
    <button className="relative">
      <BellIcon />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
```

## 10.2 Optimistic Updates

```typescript
// convex/payments/mutations.ts
export const markAsPaid = mutation({
  args: {
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    // ... validation
    
    await ctx.db.patch(args.paymentId, {
      status: "completed",
      paidAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update tenant balance
    const payment = await ctx.db.get(args.paymentId);
    const tenant = await ctx.db.get(payment!.tenantId);
    
    await ctx.db.patch(payment!.tenantId, {
      currentBalance: tenant!.currentBalance - payment!.amount,
      updatedAt: Date.now(),
    });
  },
});

// Frontend with optimistic update
function PaymentButton({ payment }) {
  const markAsPaid = useMutation(api.payments.mutations.markAsPaid)
    .withOptimisticUpdate((localStore, args) => {
      // Immediately update local state
      const current = localStore.getQuery(api.payments.queries.getById, { 
        paymentId: args.paymentId 
      });
      if (current) {
        localStore.setQuery(api.payments.queries.getById, { paymentId: args.paymentId }, {
          ...current,
          status: "completed",
          paidAt: Date.now(),
        });
      }
    });

  return (
    <button onClick={() => markAsPaid({ paymentId: payment._id })}>
      Mark as Paid
    </button>
  );
}
```

---

# 11. FILE STORAGE & MEDIA

## 11.1 Convex File Storage

```typescript
// convex/documents/mutations.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveDocument = mutation({
  args: {
    organizationId: v.id("organizations"),
    storageId: v.id("_storage"),
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
    mimeType: v.string(),
    fileSize: v.number(),
    propertyId: v.optional(v.id("properties")),
    tenantId: v.optional(v.id("tenants")),
  },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, args.organizationId, "documents:write");
    
    const url = await ctx.storage.getUrl(args.storageId);
    
    const documentId = await ctx.db.insert("documents", {
      organizationId: args.organizationId,
      storageId: args.storageId,
      url: url!,
      name: args.name,
      type: args.type,
      mimeType: args.mimeType,
      fileSize: args.fileSize,
      propertyId: args.propertyId,
      tenantId: args.tenantId,
      sharedWithTenant: false,
      tags: [],
      uploadedBy: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return documentId;
  },
});
```

## 11.2 Frontend Upload Component

```typescript
// src/components/shared/file-upload.tsx
"use client"

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function FileUpload({ onUploadComplete }) {
  const generateUploadUrl = useMutation(api.documents.mutations.generateUploadUrl);
  const saveDocument = useMutation(api.documents.mutations.saveDocument);

  const handleUpload = async (file: File) => {
    // Step 1: Get upload URL
    const uploadUrl = await generateUploadUrl();

    // Step 2: Upload file to Convex storage
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();

    // Step 3: Save document record
    const documentId = await saveDocument({
      organizationId,
      storageId,
      name: file.name,
      type: "other",
      mimeType: file.type,
      fileSize: file.size,
    });

    onUploadComplete(documentId);
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
    />
  );
}
```

---

# 12. THIRD-PARTY INTEGRATIONS

## 12.1 Integration Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     NOMERLO INTEGRATION ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  AUTHENTICATION              PAYMENTS                 COMMUNICATION      │
│  ┌─────────────┐            ┌─────────────┐          ┌─────────────┐    │
│  │   Clerk     │            │   Stripe    │          │   Resend    │    │
│  │ - Sign up   │            │ - Subs      │          │ - Email     │    │
│  │ - Sign in   │            │ - Payments  │          │ - Notifs    │    │
│  │ - OAuth     │            │ - ACH/Cards │          └─────────────┘    │
│  │ - MFA       │            └─────────────┘          ┌─────────────┐    │
│  └─────────────┘                                     │   Twilio    │    │
│                                                      │ - SMS       │    │
│  SCREENING                  AI/ML                    │ - Voice     │    │
│  ┌─────────────┐            ┌─────────────┐          └─────────────┘    │
│  │ TransUnion  │            │  OpenAI/    │                             │
│  │ - Credit    │            │  Anthropic  │          STORAGE            │
│  │ - Background│            │ - AI Chat   │          ┌─────────────┐    │
│  │ - Eviction  │            │ - Summaries │          │Convex Files │    │
│  └─────────────┘            │ - Generation│          │ - Documents │    │
│                             └─────────────┘          │ - Images    │    │
│  E-SIGNATURES                                        └─────────────┘    │
│  ┌─────────────┐            MAPPING/GEO                                 │
│  │  DocuSign   │            ┌─────────────┐                             │
│  │ - Leases    │            │   Mapbox    │                             │
│  │ - Addendums │            │ - Search    │                             │
│  └─────────────┘            │ - Maps      │                             │
│                             └─────────────┘                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 12.2 Stripe Integration

```typescript
// convex/payments/actions.ts
"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createPaymentIntent = action({
  args: {
    amount: v.number(),
    tenantId: v.id("tenants"),
    metadata: v.object({
      organizationId: v.string(),
      leaseId: v.string(),
      type: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(args.amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        tenantId: args.tenantId,
        ...args.metadata,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  },
});

// Webhook handler
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      await convex.mutation(api.payments.mutations.handlePaymentSuccess, {
        stripePaymentIntentId: paymentIntent.id,
      });
      break;
    
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      await convex.mutation(api.payments.mutations.handlePaymentFailure, {
        stripePaymentIntentId: failedPayment.id,
        reason: failedPayment.last_payment_error?.message,
      });
      break;

    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object;
      await convex.mutation(api.subscriptions.mutations.syncSubscription, {
        stripeSubscriptionId: subscription.id,
      });
      break;
  }

  return NextResponse.json({ received: true });
}
```

---

# 13. ENVIRONMENT CONFIGURATION

## 13.1 Environment Variables

```bash
# .env.local

# ═══════════════════════════════════════════════════════════════════════
# APPLICATION
# ═══════════════════════════════════════════════════════════════════════
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Nomerlo

# ═══════════════════════════════════════════════════════════════════════
# CONVEX
# ═══════════════════════════════════════════════════════════════════════
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# ═══════════════════════════════════════════════════════════════════════
# CLERK AUTHENTICATION
# ═══════════════════════════════════════════════════════════════════════
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/owner
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding/owner

# ═══════════════════════════════════════════════════════════════════════
# STRIPE
# ═══════════════════════════════════════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Price IDs
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_GROWTH=price_xxxxx
STRIPE_PRICE_PROFESSIONAL=price_xxxxx
STRIPE_PRICE_ENTERPRISE=price_xxxxx

# ═══════════════════════════════════════════════════════════════════════
# EMAIL (RESEND)
# ═══════════════════════════════════════════════════════════════════════
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@nomerlo.com

# ═══════════════════════════════════════════════════════════════════════
# AI SERVICES
# ═══════════════════════════════════════════════════════════════════════
OPENAI_API_KEY=sk-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx

# ═══════════════════════════════════════════════════════════════════════
# SCREENING (TRANSUNION)
# ═══════════════════════════════════════════════════════════════════════
TRANSUNION_API_KEY=xxxxx
TRANSUNION_ENVIRONMENT=sandbox

# ═══════════════════════════════════════════════════════════════════════
# MAPS (MAPBOX)
# ═══════════════════════════════════════════════════════════════════════
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxxxx

# ═══════════════════════════════════════════════════════════════════════
# SMS (TWILIO)
# ═══════════════════════════════════════════════════════════════════════
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
```

---

# 14. DEPLOYMENT ARCHITECTURE

## 14.1 Production Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      NOMERLO PRODUCTION ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                              CLOUDFLARE                                  │
│                           (CDN + WAF + DDoS)                             │
│                                  │                                       │
│                                  ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                          VERCEL                                  │    │
│  │                                                                  │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │    │
│  │  │   Next.js App   │  │  Edge Functions │  │    API Routes   │ │    │
│  │  │   (SSR + SSG)   │  │    (Middleware) │  │    (Webhooks)   │ │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘ │    │
│  │                                                                  │    │
│  └──────────────────────────────┬───────────────────────────────────┘    │
│                                 │                                        │
│                                 ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         CONVEX CLOUD                             │    │
│  │                                                                  │    │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │    │
│  │  │ Database  │  │ Functions │  │ File      │  │ Scheduled │   │    │
│  │  │ (Realtime)│  │ (Actions) │  │ Storage   │  │ Jobs      │   │    │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │    │
│  │                                                                  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  EXTERNAL SERVICES                                                       │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐               │
│  │   Clerk   │ │  Stripe   │ │  Resend   │ │  OpenAI   │               │
│  │   (Auth)  │ │ (Payments)│ │  (Email)  │ │   (AI)    │               │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 14.2 Deployment Commands

```bash
# Development
npm run dev

# Preview deployment
vercel

# Production deployment
vercel --prod

# Convex deployment (happens automatically with Vercel integration)
npx convex deploy
```

## 14.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Deploy Convex
        run: npx convex deploy
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

# APPENDIX: QUICK REFERENCE

## A.1 Key Commands

```bash
# Start development
npm run dev

# Generate Convex types after schema changes
npx convex dev

# Deploy to production
vercel --prod && npx convex deploy

# Run type checking
npm run typecheck
```

## A.2 Key Files to Create First

1. `convex/schema.ts` - Database schema
2. `src/middleware.ts` - Auth middleware
3. `src/app/layout.tsx` - Root layout with providers
4. `convex/lib/permissions.ts` - Auth helpers
5. `src/app/(marketing)/page.tsx` - Landing page

## A.3 Development Workflow

1. Define schema in `convex/schema.ts`
2. Create queries/mutations in `convex/[domain]/`
3. Create page routes in `src/app/`
4. Build components in `src/components/`
5. Test with `npm run dev`
6. Deploy with Vercel + Convex

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Prepared for:** Cursor IDE Development

*This document serves as the foundational architecture blueprint for the Nomerlo platform. All specifications are designed for immediate implementation with Convex and Next.js.*
