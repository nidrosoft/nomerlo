<div align="center">
  <h1>🏠 Nomerlo</h1>
  <p><strong>Modern Property Management & Rental Marketplace Platform</strong></p>
  <p>A comprehensive SaaS solution connecting landlords and tenants with verified listings, online rent collection, digital leases, and maintenance management.</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat-square&logo=tailwind-css)
  ![Convex](https://img.shields.io/badge/Convex-1.31-orange?style=flat-square)
  ![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=flat-square)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [User Roles & Portals](#-user-roles--portals)
- [API & Backend](#-api--backend)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Pricing Model](#-pricing-model)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Nomerlo** is a full-stack property management and rental marketplace platform designed to simplify the rental experience for both landlords and tenants. The platform provides:

- **For Landlords**: Complete property management tools including rent collection, tenant screening, digital lease signing, maintenance tracking, and financial reporting.
- **For Tenants**: Verified rental listings, one-click applications, secure rent payments, maintenance requests, and direct communication with landlords.
- **For Maintenance Staff**: Work order management, scheduling, inventory tracking, and job completion workflows.
- **For Super Admins**: Platform-wide analytics, user management, subscription oversight, and support tools.

### Key Value Propositions

| For Landlords | For Tenants |
|---------------|-------------|
| ✅ Collect rent online | ✅ 100% verified listings |
| ✅ Screen tenants | ✅ Apply online instantly |
| ✅ Digital leases | ✅ Secure messaging |
| ✅ Track maintenance | ✅ Easy rent payments |
| ✅ AI-powered support | ✅ Maintenance requests |

---

## ✨ Features

### 🏢 Property Management (Owner Portal)
- **Property & Unit Management** - Add properties, manage units, track occupancy
- **Tenant Management** - Onboard tenants, manage profiles, track balances
- **Lease Management** - Create, sign, and manage digital leases
- **Rent Collection** - Online payments via ACH/card, autopay, late fee automation
- **Maintenance Tracking** - Receive requests, assign vendors, track resolution
- **Financial Reports** - Income/expense tracking, tax reports, accounting integration
- **Listing Syndication** - Publish to Zillow, Apartments.com, and more
- **Document Storage** - Secure storage for leases, receipts, and legal documents
- **Team Management** - Add property managers and staff with role-based access

### 🔑 Tenant Portal
- **Rent Payments** - Pay via bank transfer or card, set up autopay
- **Maintenance Requests** - Submit issues with photos, track progress
- **Document Access** - View lease, receipts, and notices
- **Secure Messaging** - Communicate directly with landlord/property manager
- **Payment History** - View all transactions and download receipts
- **Profile Management** - Update contact info, emergency contacts, vehicles

### 🔧 Maintenance Portal
- **Work Order Management** - View assigned jobs, update status
- **Scheduling** - Calendar view of upcoming work
- **Inventory Tracking** - Manage parts and supplies
- **Job Completion** - Log labor, materials, and costs
- **Reporting** - Track completed jobs and performance

### 🛡️ Super Admin Panel
- **Platform Analytics** - Users, revenue, growth metrics
- **Owner Management** - View/manage all landlord accounts
- **Subscription Management** - Monitor plans, handle billing issues
- **Support Tools** - Handle escalations and disputes

### 🌐 Public Marketplace
- **Listing Search** - Search by location, beds, price, amenities
- **Map View** - Interactive map with property markers
- **Verified Listings** - Every listing verified for authenticity
- **One-Click Apply** - Reusable renter profile for quick applications

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router, Turbopack |
| **React 19** | UI library with latest features |
| **TypeScript 5.9** | Type-safe development |
| **Tailwind CSS 4.1** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **React Aria** | Accessible UI components |
| **Lucide React** | Icon library |
| **Untitled UI** | Component library foundation |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Convex** | Real-time backend, database, and serverless functions |
| **Clerk** | Authentication and user management |
| **Stripe** | Payment processing (planned) |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Bun/npm** | Package management |
| **Prettier** | Code formatting |
| **PostCSS** | CSS processing |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  Marketing Pages  │  Owner Portal  │  Tenant Portal  │  Admin   │
└────────┬──────────┴───────┬────────┴────────┬────────┴────┬─────┘
         │                  │                 │             │
         ▼                  ▼                 ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLERK AUTHENTICATION                       │
│              (Middleware protects dashboard routes)             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CONVEX BACKEND                              │
├─────────────────────────────────────────────────────────────────┤
│  Queries  │  Mutations  │  Actions  │  HTTP Routes  │  Crons    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CONVEX DATABASE                             │
│  Users │ Organizations │ Properties │ Units │ Leases │ Payments │
│  Tenants │ Maintenance │ Documents │ Messages │ Subscriptions   │
└─────────────────────────────────────────────────────────────────┘
```

### Route Groups

| Route Group | Purpose | Auth Required |
|-------------|---------|---------------|
| `(marketing)` | Public pages - home, pricing, features, listings | No |
| `(auth)` | Sign in/up pages | No |
| `(dashboard)/owner` | Landlord/property manager portal | Yes |
| `(dashboard)/tenant` | Tenant portal | Yes |
| `(dashboard)/maintenance` | Maintenance staff portal | Yes |
| `(admin)` | Super admin panel | Yes (admin role) |
| `(marketplace)` | Browse/discover listings | No |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun
- Clerk account (for authentication)
- Convex account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/nomerlo.git
   cd nomerlo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Clerk and Convex credentials (see [Environment Variables](#-environment-variables))

4. **Initialize Convex**
   ```bash
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npx convex dev` | Start Convex development backend |
| `npx convex deploy` | Deploy Convex to production |

---

## 📁 Project Structure

```
nomerlo/
├── convex/                    # Convex backend
│   ├── _generated/            # Auto-generated Convex files
│   ├── admin/                 # Admin queries/mutations
│   ├── applications/          # Rental applications
│   ├── documents/             # Document management
│   ├── leases/                # Lease management
│   ├── listings/              # Marketplace listings
│   ├── maintenance/           # Maintenance requests
│   ├── messages/              # Messaging system
│   ├── notifications/         # Notification system
│   ├── organizations/         # Organization management
│   ├── payments/              # Payment processing
│   ├── properties/            # Property management
│   ├── subscriptions/         # SaaS subscriptions
│   ├── tenants/               # Tenant management
│   ├── units/                 # Unit management
│   ├── users/                 # User management
│   ├── schema.ts              # Database schema (1100+ lines)
│   ├── crons.ts               # Scheduled jobs
│   └── http.ts                # HTTP endpoints
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (admin)/           # Super admin routes
│   │   │   └── admin/
│   │   │       ├── analytics/
│   │   │       ├── owners/
│   │   │       ├── settings/
│   │   │       ├── subscriptions/
│   │   │       └── support/
│   │   │
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   │
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── owner/         # Landlord portal
│   │   │   │   ├── applications/
│   │   │   │   ├── billing/
│   │   │   │   ├── calendar/
│   │   │   │   ├── documents/
│   │   │   │   ├── expenses/
│   │   │   │   ├── leases/
│   │   │   │   ├── listings/
│   │   │   │   ├── maintenance/
│   │   │   │   ├── messages/
│   │   │   │   ├── onboarding/
│   │   │   │   ├── properties/
│   │   │   │   ├── reports/
│   │   │   │   ├── settings/
│   │   │   │   ├── tenants/
│   │   │   │   └── units/
│   │   │   │
│   │   │   ├── tenant/        # Tenant portal
│   │   │   │   ├── documents/
│   │   │   │   ├── maintenance/
│   │   │   │   ├── messages/
│   │   │   │   ├── notices/
│   │   │   │   ├── payments/
│   │   │   │   ├── profile/
│   │   │   │   └── settings/
│   │   │   │
│   │   │   └── maintenance/   # Maintenance portal
│   │   │       ├── inventory/
│   │   │       ├── reports/
│   │   │       ├── schedule/
│   │   │       └── work-orders/
│   │   │
│   │   ├── (marketing)/       # Public marketing pages
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   ├── features/
│   │   │   ├── for-landlords/
│   │   │   ├── for-tenants/
│   │   │   ├── help/
│   │   │   ├── listings/
│   │   │   ├── map/
│   │   │   ├── pricing/
│   │   │   ├── privacy/
│   │   │   ├── search/
│   │   │   ├── security/
│   │   │   └── terms/
│   │   │
│   │   ├── (marketplace)/     # Listing discovery
│   │   │   ├── browse/
│   │   │   └── discover/
│   │   │
│   │   └── api/               # API routes
│   │       └── webhooks/      # Clerk/Stripe webhooks
│   │
│   ├── components/            # React components
│   │   ├── application/       # App-specific components
│   │   ├── base/              # Base UI components
│   │   ├── foundations/       # Design system foundations
│   │   ├── marketing/         # Marketing page components
│   │   ├── shared-assets/     # Shared assets
│   │   └── ui/                # UI primitives
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-breakpoint.ts
│   │   ├── use-clipboard.ts
│   │   ├── use-organization.ts
│   │   ├── use-real-time.ts
│   │   ├── use-resize-observer.ts
│   │   └── use-user-role.ts
│   │
│   ├── lib/                   # Utility libraries
│   ├── providers/             # React context providers
│   │   └── convex-client-provider.tsx
│   ├── styles/                # Global styles
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
│
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── .prettierrc
```

---

## 🗄️ Database Schema

The Convex database schema includes **20+ tables** covering all aspects of property management:

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts linked to Clerk |
| `organizations` | Landlord/PM company accounts |
| `organizationMembers` | Team members within organizations |
| `properties` | Physical properties (buildings) |
| `units` | Individual rental units |
| `tenants` | Tenant profiles |
| `leases` | Lease agreements |

### Financial Tables

| Table | Description |
|-------|-------------|
| `payments` | Rent and other payments |
| `invoices` | Generated invoices |
| `subscriptions` | SaaS subscription plans |

### Operations Tables

| Table | Description |
|-------|-------------|
| `listings` | Marketplace listings |
| `applications` | Rental applications |
| `maintenanceRequests` | Maintenance tickets |
| `maintenanceNotes` | Notes on maintenance requests |
| `vendors` | Third-party service providers |
| `documents` | Uploaded documents |

### Communication Tables

| Table | Description |
|-------|-------------|
| `conversations` | Message threads |
| `messages` | Individual messages |
| `notifications` | User notifications |
| `announcements` | Property-wide announcements |

### System Tables

| Table | Description |
|-------|-------------|
| `auditLogs` | Activity audit trail |

### User Roles

```typescript
role: "super_admin" | "owner" | "tenant" | "maintenance" | "staff"
```

### Organization Types

```typescript
type: "individual" | "business" | "property_manager"
```

---

## 👥 User Roles & Portals

### 1. Super Admin (`/admin`)
- Platform-wide oversight
- Manage all organizations and users
- View analytics and revenue
- Handle support escalations

### 2. Owner/Landlord (`/owner`)
- Full property management access
- Financial management
- Tenant management
- Team management

### 3. Property Manager (within organization)
- Assigned property access
- Day-to-day operations
- Tenant communication
- Maintenance coordination

### 4. Tenant (`/tenant`)
- View lease and documents
- Make payments
- Submit maintenance requests
- Communicate with landlord

### 5. Maintenance Staff (`/maintenance`)
- View assigned work orders
- Update job status
- Track inventory
- Log time and materials

---

## 🔌 API & Backend

### Convex Functions

The backend is organized into domain-specific modules:

```
convex/
├── users/
│   ├── queries.ts      # getUser, getCurrentUser
│   └── mutations.ts    # createUser, updateUser
├── properties/
│   ├── queries.ts      # getProperty, listProperties
│   └── mutations.ts    # createProperty, updateProperty
├── payments/
│   ├── queries.ts      # getPayments, getPaymentHistory
│   ├── mutations.ts    # createPayment, updatePayment
│   └── actions.ts      # processPayment (Stripe integration)
└── ...
```

### Scheduled Jobs (Crons)

```typescript
// Planned cron jobs
- send-rent-reminders (daily at 2pm UTC)
- process-late-fees (daily at 6am UTC)
```

### HTTP Endpoints

```typescript
// Planned webhooks
- /clerk-webhook (user sync)
- /stripe-webhook (payment events)
```

---

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=prod:...

# Stripe (planned)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Convex Production

```bash
npx convex deploy
```

---

## 💰 Pricing Model

| Plan | Units | Price | Features |
|------|-------|-------|----------|
| **Starter** | 1-3 | Free | Basic rent collection, tenant screening, maintenance |
| **Professional** | 4-49 | $12/unit/mo | + Digital leases, accounting, syndication, API |
| **Enterprise** | 50+ | Custom | + Dedicated support, custom integrations, SLA |

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Next.js 16
- [x] Clerk authentication integration
- [x] Convex database schema
- [x] Marketing pages
- [x] Basic routing structure

### Phase 2: Core Features (In Progress)
- [ ] Property & unit CRUD operations
- [ ] Tenant onboarding flow
- [ ] Lease creation and e-signing
- [ ] Basic rent collection

### Phase 3: Advanced Features
- [ ] Stripe payment integration
- [ ] Tenant screening integration
- [ ] Maintenance workflow
- [ ] Document management
- [ ] Messaging system

### Phase 4: Marketplace
- [ ] Public listing search
- [ ] Map view
- [ ] Application workflow
- [ ] Listing syndication

### Phase 5: Scale
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered insights
- [ ] White-label options

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

- **Documentation**: [docs.nomerlo.com](https://docs.nomerlo.com)
- **Email**: support@nomerlo.com
- **Twitter**: [@nomerlo](https://twitter.com/nomerlo)

---

<div align="center">
  <p>Built with ❤️ by the Nomerlo Team</p>
  <p>
    <a href="https://nomerlo.com">Website</a> •
    <a href="https://docs.nomerlo.com">Docs</a> •
    <a href="https://twitter.com/nomerlo">Twitter</a>
  </p>
</div>

