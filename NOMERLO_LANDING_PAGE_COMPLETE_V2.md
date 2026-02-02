# NOMERLO - Landing Page & Marketing Site (V2)
## Complete Documentation for Development

**Version:** 2.0  
**Last Updated:** January 2026  
**Base URL:** `nomerlo.com`  
**Stack:** Next.js 14+ (App Router) + Tailwind CSS + Framer Motion

---

# TABLE OF CONTENTS

1. [Overview & Site Structure](#1-overview--site-structure)
2. [Navigation Component](#2-navigation-component)
3. [Homepage (Marketplace)](#3-homepage-marketplace)
4. [For Landlords Page](#4-for-landlords-page)
5. [For Tenants Page](#5-for-tenants-page)
6. [Listings & Search Pages](#6-listings--search-pages)
7. [Pricing Page](#7-pricing-page)
8. [Shared Components](#8-shared-components)
9. [Additional Pages](#9-additional-pages)
10. [SEO & Metadata](#10-seo--metadata)
11. [Component Implementation](#11-component-implementation)

---

# 1. OVERVIEW & SITE STRUCTURE

## 1.1 New Site Architecture

```
NOMERLO SITE STRUCTURE
══════════════════════════════════════════════════════════════════════════

The site is structured around TWO primary audiences:
1. LANDLORDS/PROPERTY OWNERS - People who want to manage rentals
2. TENANTS/RENTERS - People looking for places to rent

HOMEPAGE = Marketplace (Browse Rentals)
├── /                           Homepage with featured listings + search
├── /for-landlords              Landlord features, benefits, pricing
├── /for-tenants                Tenant features, benefits
├── /listings                   Browse all listings
│   ├── /listings/[id]          Individual listing detail
│   └── /listings/[id]/apply    Application form
├── /search                     Advanced search with filters
├── /map                        Map-based search
├── /pricing                    Pricing plans (for landlords)
├── /about                      About Nomerlo
├── /contact                    Contact form
├── /blog                       Blog listing
├── /help                       Help center
├── /sign-in                    Sign in (both audiences)
├── /sign-up                    Sign up selection
│   ├── /sign-up/landlord       Landlord registration
│   └── /sign-up/tenant         Tenant registration
├── /terms                      Terms of service
├── /privacy                    Privacy policy
└── /security                   Security overview
```

## 1.2 User Flows

```
LANDLORD FLOW
══════════════════════════════════════════════════════════════════════════

Homepage ──► "For Landlords" ──► Features/Benefits ──► "List Your Property"
                                                              │
                                                              ▼
                                                      /sign-up/landlord
                                                              │
                                                              ▼
                                                      Onboarding Flow
                                                              │
                                                              ▼
                                                      Owner Dashboard


TENANT FLOW
══════════════════════════════════════════════════════════════════════════

Homepage ──► Browse Listings ──► View Listing ──► "Apply Now"
                                                       │
                                                       ▼
                                               /sign-up/tenant
                                                       │
                                                       ▼
                                               Application Form
                                                       │
                                                       ▼
                                               Tenant Dashboard

     OR

Homepage ──► "For Tenants" ──► Features/Benefits ──► "Find Your Home"
                                                           │
                                                           ▼
                                                    /listings (Search)
```

## 1.3 Design System

```
BRAND COLORS
────────────────────────────────────────────────────────────────────────

Primary:        #6366F1 (Indigo 500)      - Main brand color
Primary Dark:   #4F46E5 (Indigo 600)      - Hover states
Primary Light:  #818CF8 (Indigo 400)      - Accents

Secondary:      #10B981 (Emerald 500)     - Success, positive
Accent:         #F59E0B (Amber 500)       - Highlights, warnings

Neutrals:
- Background:   #FFFFFF (White)
- Surface:      #F9FAFB (Gray 50)
- Border:       #E5E7EB (Gray 200)
- Text Primary: #111827 (Gray 900)
- Text Secondary: #6B7280 (Gray 500)
- Text Muted:   #9CA3AF (Gray 400)

TYPOGRAPHY
────────────────────────────────────────────────────────────────────────

Font Family:    Inter (Google Fonts)
Headings:       font-bold, tracking-tight
Body:           leading-relaxed

SECTION SPACING
────────────────────────────────────────────────────────────────────────

Section Padding: py-24 (desktop), py-16 (mobile)
Container:       max-w-7xl (1280px)
Content Max:     max-w-3xl for text-heavy sections
```

---

# 2. NAVIGATION COMPONENT

## 2.1 Primary Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [LOGO]   For Landlords   For Tenants   Browse Rentals   Pricing        │
│                                                                          │
│                                              │Sign In│  │List Property│  │
│                                              └───────┘  └─────────────┘  │
│                                                              (CTA)       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Navigation Data

```typescript
const navigation = {
  logo: {
    src: "/logo.svg",
    alt: "Nomerlo",
    href: "/",
  },
  
  mainLinks: [
    {
      name: "For Landlords",
      href: "/for-landlords",
      description: "Property management tools",
    },
    {
      name: "For Tenants",
      href: "/for-tenants",
      description: "Find your next home",
    },
    {
      name: "Browse Rentals",
      href: "/listings",
      description: "Search available properties",
    },
    {
      name: "Pricing",
      href: "/pricing",
      description: "Simple, transparent pricing",
    },
  ],
  
  actions: {
    signIn: {
      name: "Sign In",
      href: "/sign-in",
      variant: "ghost",
    },
    primaryCTA: {
      name: "List Property",
      href: "/sign-up/landlord",
      variant: "primary",
    },
  },
};
```

## 2.3 Mobile Navigation

```
┌───────────────────────────┐
│  [LOGO]           [☰]    │
├───────────────────────────┤
│                           │
│  For Landlords       →    │
│  For Tenants         →    │
│  Browse Rentals      →    │
│  Pricing             →    │
│                           │
│  ─────────────────────    │
│                           │
│  [Sign In]                │
│  [List Property]          │
│                           │
└───────────────────────────┘
```

## 2.4 Navigation Behavior

```typescript
const navBehavior = {
  // Sticky on scroll with blur background
  sticky: true,
  scrollThreshold: 50,
  
  initial: {
    background: "transparent",
    backdropBlur: "none",
  },
  
  scrolled: {
    background: "bg-white/90 dark:bg-slate-900/90",
    backdropBlur: "backdrop-blur-lg",
    shadow: "shadow-sm",
  },
};
```

---

# 3. HOMEPAGE (MARKETPLACE)

## 3.1 Homepage Layout Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           NAVIGATION                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         HERO + SEARCH                                    │
│                   "Find Your Perfect Rental"                             │
│                      [Search Bar]                                        │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                      FEATURED LISTINGS                                   │
│                   (6-8 property cards)                                   │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    BROWSE BY CITY/AREA                                   │
│                 (Popular locations grid)                                 │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    VALUE PROPOSITION SPLIT                               │
│           [For Landlords]          [For Tenants]                        │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                       TRUST INDICATORS                                   │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                      HOW IT WORKS                                        │
│              (Simple 3-step for each audience)                          │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                       TESTIMONIALS                                       │
│              (Mix of landlord and tenant reviews)                       │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                          CTA SPLIT                                       │
│     [List Your Property]      [Find Your Home]                          │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                            FOOTER                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Hero + Search Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                     │
│                    ░░  Background: Gradient or    ░░                     │
│                    ░░  subtle property image      ░░                     │
│                    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                     │
│                                                                          │
│                                                                          │
│                     Find Your Perfect Rental                             │
│                                                                          │
│         Thousands of verified listings. Zero headaches.                 │
│                                                                          │
│                                                                          │
│    ┌─────────────────────────────────────────────────────────────┐     │
│    │                                                              │     │
│    │  🔍  City, neighborhood, or ZIP    │ Beds ▼ │ Price ▼ │ Search│   │
│    │                                                              │     │
│    └─────────────────────────────────────────────────────────────┘     │
│                                                                          │
│           Popular: San Francisco • Austin • Denver • Miami              │
│                                                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const heroSearch = {
  headline: "Find Your Perfect Rental",
  subheadline: "Thousands of verified listings. Zero headaches.",
  
  searchBar: {
    placeholder: "City, neighborhood, or ZIP",
    filters: [
      {
        name: "Beds",
        options: ["Any", "Studio", "1", "2", "3", "4+"],
      },
      {
        name: "Price",
        options: ["Any", "Under $1,000", "$1,000-$1,500", "$1,500-$2,000", "$2,000-$3,000", "$3,000+"],
      },
    ],
    submitText: "Search",
  },
  
  popularSearches: [
    { name: "San Francisco", href: "/search?city=san-francisco" },
    { name: "Austin", href: "/search?city=austin" },
    { name: "Denver", href: "/search?city=denver" },
    { name: "Miami", href: "/search?city=miami" },
    { name: "Seattle", href: "/search?city=seattle" },
  ],
};
```

## 3.3 Featured Listings Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                      Featured Listings                                   │
│               Hand-picked properties, verified by Nomerlo               │
│                                                                          │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│   │  [IMAGE]    │  │  [IMAGE]    │  │  [IMAGE]    │  │  [IMAGE]    │   │
│   │             │  │             │  │             │  │             │   │
│   │  $2,400/mo  │  │  $1,850/mo  │  │  $3,200/mo  │  │  $1,650/mo  │   │
│   │  2bd • 2ba  │  │  1bd • 1ba  │  │  3bd • 2ba  │  │  Studio     │   │
│   │  San Fran   │  │  Austin     │  │  Denver     │  │  Miami      │   │
│   │  ✓ Verified │  │  ✓ Verified │  │  ✓ Verified │  │  ✓ Verified │   │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                          │
│                       [View All Listings →]                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const featuredListings = {
  sectionTitle: "Featured Listings",
  sectionSubtitle: "Hand-picked properties, verified by Nomerlo",
  
  // These would come from API, but here's the structure:
  listings: [
    {
      id: "listing-1",
      images: ["/images/listing-1.jpg"],
      price: 2400,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      address: {
        street: "123 Market St",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
      },
      verified: true,
      featured: true,
      availableDate: "2026-02-01",
    },
    // ... more listings
  ],
  
  cta: {
    text: "View All Listings",
    href: "/listings",
  },
};
```

## 3.4 Browse by Location Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                     Browse by Location                                   │
│               Discover rentals in popular areas                         │
│                                                                          │
│   ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────┐ │
│   │                    │  │                    │  │                  │ │
│   │    [City Image]    │  │    [City Image]    │  │   [City Image]   │ │
│   │                    │  │                    │  │                  │ │
│   │   San Francisco    │  │       Austin       │  │      Denver      │ │
│   │   1,234 listings   │  │    856 listings    │  │   672 listings   │ │
│   │                    │  │                    │  │                  │ │
│   └────────────────────┘  └────────────────────┘  └──────────────────┘ │
│                                                                          │
│   ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────┐ │
│   │                    │  │                    │  │                  │ │
│   │    [City Image]    │  │    [City Image]    │  │   [City Image]   │ │
│   │                    │  │                    │  │                  │ │
│   │       Miami        │  │      Seattle       │  │     Phoenix      │ │
│   │    543 listings    │  │    721 listings    │  │   489 listings   │ │
│   │                    │  │                    │  │                  │ │
│   └────────────────────┘  └────────────────────┘  └──────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const browseByLocation = {
  sectionTitle: "Browse by Location",
  sectionSubtitle: "Discover rentals in popular areas",
  
  locations: [
    {
      name: "San Francisco",
      state: "CA",
      image: "/images/cities/san-francisco.jpg",
      listingCount: 1234,
      href: "/search?city=san-francisco",
    },
    {
      name: "Austin",
      state: "TX",
      image: "/images/cities/austin.jpg",
      listingCount: 856,
      href: "/search?city=austin",
    },
    {
      name: "Denver",
      state: "CO",
      image: "/images/cities/denver.jpg",
      listingCount: 672,
      href: "/search?city=denver",
    },
    {
      name: "Miami",
      state: "FL",
      image: "/images/cities/miami.jpg",
      listingCount: 543,
      href: "/search?city=miami",
    },
    {
      name: "Seattle",
      state: "WA",
      image: "/images/cities/seattle.jpg",
      listingCount: 721,
      href: "/search?city=seattle",
    },
    {
      name: "Phoenix",
      state: "AZ",
      image: "/images/cities/phoenix.jpg",
      listingCount: 489,
      href: "/search?city=phoenix",
    },
  ],
};
```

## 3.5 Value Proposition Split Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                     One Platform, Two Experiences                        │
│                                                                          │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │                             │  │                                 │  │
│  │     FOR LANDLORDS           │  │        FOR TENANTS              │  │
│  │                             │  │                                 │  │
│  │  🏠 Property Management     │  │  🔍 Verified Listings           │  │
│  │     Made Simple             │  │     You Can Trust               │  │
│  │                             │  │                                 │  │
│  │  Everything you need to     │  │  Find your perfect home         │  │
│  │  list, lease, and manage    │  │  with confidence. No fake       │  │
│  │  your rental properties.    │  │  listings, no scams.            │  │
│  │                             │  │                                 │  │
│  │  ✓ Collect rent online      │  │  ✓ Every listing verified       │  │
│  │  ✓ Screen tenants           │  │  ✓ Apply online instantly       │  │
│  │  ✓ Digital leases           │  │  ✓ Secure messaging             │  │
│  │  ✓ Track maintenance        │  │  ✓ Easy rent payments           │  │
│  │  ✓ AI-powered support       │  │  ✓ Maintenance requests         │  │
│  │                             │  │                                 │  │
│  │  [Learn More →]             │  │  [Learn More →]                 │  │
│  │  [List Your Property]       │  │  [Find Your Home]               │  │
│  │                             │  │                                 │  │
│  └─────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const valuePropositionSplit = {
  sectionTitle: "One Platform, Two Experiences",
  
  landlords: {
    label: "FOR LANDLORDS",
    icon: "Building",
    headline: "Property Management Made Simple",
    description: "Everything you need to list, lease, and manage your rental properties.",
    benefits: [
      { icon: "CreditCard", text: "Collect rent online" },
      { icon: "UserCheck", text: "Screen tenants" },
      { icon: "FileText", text: "Digital leases" },
      { icon: "Wrench", text: "Track maintenance" },
      { icon: "Bot", text: "AI-powered support" },
    ],
    primaryCTA: {
      text: "List Your Property",
      href: "/sign-up/landlord",
    },
    secondaryCTA: {
      text: "Learn More",
      href: "/for-landlords",
    },
    backgroundAccent: "bg-indigo-50",
  },
  
  tenants: {
    label: "FOR TENANTS",
    icon: "Home",
    headline: "Verified Listings You Can Trust",
    description: "Find your perfect home with confidence. No fake listings, no scams.",
    benefits: [
      { icon: "ShieldCheck", text: "Every listing verified" },
      { icon: "Zap", text: "Apply online instantly" },
      { icon: "MessageSquare", text: "Secure messaging" },
      { icon: "DollarSign", text: "Easy rent payments" },
      { icon: "Tool", text: "Maintenance requests" },
    ],
    primaryCTA: {
      text: "Find Your Home",
      href: "/listings",
    },
    secondaryCTA: {
      text: "Learn More",
      href: "/for-tenants",
    },
    backgroundAccent: "bg-emerald-50",
  },
};
```

## 3.6 Trust Indicators (Homepage)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│        Trusted by landlords and tenants across the country              │
│                                                                          │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐ │
│   │  5,000+ │   │ 50,000+ │   │ 100%    │   │  4.9/5  │   │  $50M+  │ │
│   │Landlords│   │  Units  │   │Verified │   │ Rating  │   │Processed│ │
│   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const trustIndicatorsHomepage = {
  headline: "Trusted by landlords and tenants across the country",
  
  stats: [
    { value: "5,000+", label: "Landlords" },
    { value: "50,000+", label: "Units Managed" },
    { value: "100%", label: "Verified Listings" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "$50M+", label: "Rent Processed Monthly" },
  ],
};
```

## 3.7 How It Works (Homepage - Split View)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                          How It Works                                    │
│                                                                          │
│          [● Landlords]        [○ Tenants]   ← Tab Toggle                │
│                                                                          │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│   │       1         │  │       2         │  │       3         │        │
│   │                 │  │                 │  │                 │        │
│   │   📝            │  │   ✍️            │  │   💰            │        │
│   │                 │  │                 │  │                 │        │
│   │  List Your      │  │  Find Your      │  │  Collect        │        │
│   │  Property       │  │  Tenant         │  │  Rent           │        │
│   │                 │  │                 │  │                 │        │
│   │  Add property   │  │  Review apps,   │  │  Get paid via   │        │
│   │  details, set   │  │  screen, and    │  │  same-day ACH.  │        │
│   │  rent, upload   │  │  sign lease     │  │  Autopay makes  │        │
│   │  photos. Done   │  │  digitally.     │  │  it automatic.  │        │
│   │  in 5 minutes.  │  │                 │  │                 │        │
│   │                 │  │                 │  │                 │        │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                          │
│                      [Get Started Free →]                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const howItWorksHomepage = {
  sectionTitle: "How It Works",
  
  tabs: [
    {
      id: "landlords",
      label: "Landlords",
      steps: [
        {
          number: 1,
          icon: "ClipboardList",
          title: "List Your Property",
          description: "Add property details, set rent, upload photos. Done in 5 minutes.",
        },
        {
          number: 2,
          icon: "UserCheck",
          title: "Find Your Tenant",
          description: "Review applications, run screening, and sign lease digitally.",
        },
        {
          number: 3,
          icon: "DollarSign",
          title: "Collect Rent",
          description: "Get paid via same-day ACH. Autopay makes it automatic.",
        },
      ],
      cta: {
        text: "Get Started Free",
        href: "/sign-up/landlord",
      },
    },
    {
      id: "tenants",
      label: "Tenants",
      steps: [
        {
          number: 1,
          icon: "Search",
          title: "Search Listings",
          description: "Browse verified rentals. Filter by location, price, and amenities.",
        },
        {
          number: 2,
          icon: "Send",
          title: "Apply Online",
          description: "Submit your application with one click. Track status in real-time.",
        },
        {
          number: 3,
          icon: "Key",
          title: "Move In",
          description: "Sign your lease digitally, set up payments, and get your keys.",
        },
      ],
      cta: {
        text: "Find Your Home",
        href: "/listings",
      },
    },
  ],
};
```

## 3.8 Testimonials (Homepage - Mixed)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                    What Our Users Are Saying                            │
│                                                                          │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │  "Nomerlo made renting my first investment property a breeze.  │   │
│   │   I had no idea what I was doing, but their platform walked    │   │
│   │   me through everything."                                       │   │
│   │                                                                 │   │
│   │   ★★★★★                                                        │   │
│   │                                                                 │   │
│   │   [Photo]  Mike Chen                                           │   │
│   │            Landlord • 4 units in Austin                        │   │
│   │                                                                 │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│        ●  ○  ○  ○  ○              [←] [→]                              │
│                                                                          │
│   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐           │
│   │  LANDLORD      │  │  TENANT        │  │  LANDLORD      │           │
│   │                │  │                │  │                │           │
│   │  "Best PM      │  │  "Finally      │  │  "Support      │           │
│   │   software     │  │   found a      │  │   team is      │           │
│   │   I've used"   │  │   legit app"   │  │   amazing"     │           │
│   │                │  │                │  │                │           │
│   │   ★★★★★       │  │   ★★★★★       │  │   ★★★★★       │           │
│   │   Sarah M.     │  │   Jordan T.    │  │   David K.     │           │
│   │   12 units     │  │   Renter       │  │   23 units     │           │
│   │                │  │                │  │                │           │
│   └────────────────┘  └────────────────┘  └────────────────┘           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const testimonialsHomepage = {
  sectionTitle: "What Our Users Are Saying",
  
  featured: {
    quote: "Nomerlo made renting my first investment property a breeze. I had no idea what I was doing, but their platform walked me through everything.",
    author: {
      name: "Mike Chen",
      type: "landlord",
      detail: "4 units in Austin",
      image: "/testimonials/mike.jpg",
    },
    rating: 5,
  },
  
  grid: [
    {
      quote: "Best property management software I've used. And I've tried them all.",
      author: { name: "Sarah M.", type: "landlord", detail: "12 units" },
      rating: 5,
    },
    {
      quote: "Finally found a rental app that isn't full of fake listings. Applied and got approved in 2 days.",
      author: { name: "Jordan T.", type: "tenant", detail: "Renter in Denver" },
      rating: 5,
    },
    {
      quote: "Support team is amazing. Had an issue at 10pm on a Saturday and got help within 15 minutes.",
      author: { name: "David K.", type: "landlord", detail: "23 units" },
      rating: 5,
    },
  ],
};
```

## 3.9 Dual CTA Section (Homepage)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌──────────────────────────────┐ ┌──────────────────────────────────┐ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │ ░░                        ░░ │ │ ░░                           ░░ │ │
│  │ ░░   Own Rental Property? ░░ │ │ ░░    Looking for a Place?   ░░ │ │
│  │ ░░                        ░░ │ │ ░░                           ░░ │ │
│  │ ░░   List it free. Get    ░░ │ │ ░░   Browse verified         ░░ │ │
│  │ ░░   qualified tenants.   ░░ │ │ ░░   listings. Apply today.  ░░ │ │
│  │ ░░                        ░░ │ │ ░░                           ░░ │ │
│  │ ░░  ┌──────────────────┐  ░░ │ │ ░░  ┌────────────────────┐  ░░ │ │
│  │ ░░  │ List Your Property│  ░░ │ │ ░░  │  Find Your Home    │  ░░ │ │
│  │ ░░  └──────────────────┘  ░░ │ │ ░░  └────────────────────┘  ░░ │ │
│  │ ░░                        ░░ │ │ ░░                           ░░ │ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  └──────────────────────────────┘ └──────────────────────────────────┘ │
│         (Indigo gradient)                 (Emerald gradient)            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const dualCTA = {
  landlord: {
    headline: "Own Rental Property?",
    subheadline: "List it free. Get qualified tenants.",
    cta: {
      text: "List Your Property",
      href: "/sign-up/landlord",
    },
    background: "from-indigo-600 to-indigo-800",
  },
  tenant: {
    headline: "Looking for a Place?",
    subheadline: "Browse verified listings. Apply today.",
    cta: {
      text: "Find Your Home",
      href: "/listings",
    },
    background: "from-emerald-600 to-emerald-800",
  },
};
```

---

# 4. FOR LANDLORDS PAGE

## 4.1 Page Layout Overview

```
/for-landlords
══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                           NAVIGATION                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        LANDLORD HERO                                     │
│            "Property Management Made Simple"                             │
│                    [List Your Property]                                  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                     PROBLEM STATEMENT                                    │
│            "Tired of chasing rent payments?"                            │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                       FEATURES GRID                                      │
│            (All landlord features - 6 cards)                            │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    FEATURE DEEP DIVES                                    │
│            (Alternating sections for each feature)                      │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                     COMPARISON TABLE                                     │
│               (Nomerlo vs competitors)                                  │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         PRICING                                          │
│                  (Full pricing section)                                 │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                      TESTIMONIALS                                        │
│               (Landlord-specific reviews)                               │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                           FAQ                                            │
│                (Landlord-specific questions)                            │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                           CTA                                            │
│                  [Start Free Trial]                                     │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                            FOOTER                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Landlord Hero Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                      Property Management                                 │
│                        Made Simple                                       │
│                                                                          │
│      Stop juggling spreadsheets, chasing payments, and playing          │
│      phone tag with tenants. Nomerlo handles it all.                    │
│                                                                          │
│                                                                          │
│         ┌──────────────────────┐    ┌──────────────────────┐            │
│         │  List Your Property  │    │    Watch Demo        │            │
│         │        Free          │    │        ▶             │            │
│         └──────────────────────┘    └──────────────────────┘            │
│                                                                          │
│            Free for 1-3 units • No credit card required                 │
│                                                                          │
│                                                                          │
│    ┌───────────────────────────────────────────────────────────────┐   │
│    │                                                                │   │
│    │              [OWNER DASHBOARD PREVIEW]                         │   │
│    │                                                                │   │
│    └───────────────────────────────────────────────────────────────┘   │
│                                                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const landlordHero = {
  headline: "Property Management Made Simple",
  subheadline: "Stop juggling spreadsheets, chasing payments, and playing phone tag with tenants. Nomerlo handles it all.",
  
  primaryCTA: {
    text: "List Your Property Free",
    href: "/sign-up/landlord",
  },
  secondaryCTA: {
    text: "Watch Demo",
    href: "#demo",
  },
  
  trustText: "Free for 1-3 units • No credit card required • Setup in 5 minutes",
  
  heroImage: "/images/owner-dashboard-preview.png",
};
```

## 4.3 Problem Statement Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                  Sound Familiar?                                         │
│                                                                          │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│   │                  │  │                  │  │                  │     │
│   │  😫 Chasing      │  │  📱 Endless      │  │  📊 Spreadsheet  │     │
│   │     Rent         │  │     Texts        │  │     Chaos        │     │
│   │                  │  │                  │  │                  │     │
│   │  Reminders,      │  │  "Is the         │  │  Payment logs,   │     │
│   │  late fees,      │  │  plumber         │  │  expense files,  │     │
│   │  awkward         │  │  coming?"        │  │  lease docs      │     │
│   │  conversations   │  │  "When's rent    │  │  scattered       │     │
│   │                  │  │  due?"           │  │  everywhere      │     │
│   │                  │  │                  │  │                  │     │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                                                          │
│            There's a better way. →  [See How It Works]                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const problemStatement = {
  sectionTitle: "Sound Familiar?",
  
  problems: [
    {
      emoji: "😫",
      title: "Chasing Rent",
      description: "Reminders, late fees, awkward conversations",
    },
    {
      emoji: "📱",
      title: "Endless Texts",
      description: '"Is the plumber coming?" "When\'s rent due?"',
    },
    {
      emoji: "📊",
      title: "Spreadsheet Chaos",
      description: "Payment logs, expense files, lease docs scattered everywhere",
    },
  ],
  
  solution: {
    text: "There's a better way.",
    cta: {
      text: "See How It Works",
      href: "#features",
    },
  },
};
```

## 4.4 Landlord Features Grid

```typescript
const landlordFeatures = {
  sectionTitle: "Everything You Need to Manage Properties Like a Pro",
  sectionSubtitle: "From listing your first vacancy to collecting rent—it's all here.",
  
  features: [
    {
      id: "rent-collection",
      icon: "CreditCard",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50",
      title: "Rent Collection",
      shortDescription: "Same-day ACH deposits. Autopay. Automatic late fees.",
      longDescription: "Stop waiting days for rent to clear. With Nomerlo, tenants pay online and you get same-day deposits. Set up autopay and never chase a payment again.",
      highlights: [
        "Same-day ACH deposits",
        "Tenant autopay setup",
        "Automatic late fees",
        "Payment reminders",
        "Multiple payment methods",
      ],
      image: "/images/features/rent-collection.png",
    },
    {
      id: "listings",
      icon: "ClipboardList",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
      title: "Listings & Marketing",
      shortDescription: "AI-powered listings. One-click syndication.",
      longDescription: "Create compelling listings in seconds with AI. Syndicate to Zillow, Apartments.com, and 20+ sites automatically. Get more applications, faster.",
      highlights: [
        "AI-written descriptions",
        "Professional photo optimization",
        "One-click syndication",
        "Lead tracking",
        "Tour scheduling",
      ],
      image: "/images/features/listings.png",
    },
    {
      id: "screening",
      icon: "UserCheck",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
      title: "Tenant Screening",
      shortDescription: "Credit, criminal, and eviction checks in minutes.",
      longDescription: "Make confident decisions with comprehensive screening. Credit reports, criminal background, eviction history, and income verification—all in one place.",
      highlights: [
        "Credit reports (TransUnion)",
        "Criminal background check",
        "Eviction history",
        "Income verification",
        "AI recommendations",
      ],
      image: "/images/features/screening.png",
    },
    {
      id: "leases",
      icon: "FileText",
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
      title: "Lease Management",
      shortDescription: "Digital leases with legally-binding e-signatures.",
      longDescription: "State-specific lease templates, custom clauses, and e-signatures. Create, send, and sign leases without printing a single page.",
      highlights: [
        "State-specific templates",
        "Custom clauses",
        "E-signatures (DocuSign)",
        "Automatic renewals",
        "Amendment tracking",
      ],
      image: "/images/features/leases.png",
    },
    {
      id: "maintenance",
      icon: "Wrench",
      iconColor: "text-red-500",
      iconBg: "bg-red-50",
      title: "Maintenance Tracking",
      shortDescription: "Receive requests, assign vendors, track progress.",
      longDescription: "Tenants submit requests with photos. You assign vendors and track progress. Everyone stays informed automatically—no phone tag required.",
      highlights: [
        "Photo attachments",
        "Vendor assignment",
        "Real-time status updates",
        "Cost tracking",
        "Work order history",
      ],
      image: "/images/features/maintenance.png",
    },
    {
      id: "accounting",
      icon: "BarChart3",
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-50",
      title: "Reports & Accounting",
      shortDescription: "Income statements, expense tracking, tax documents.",
      longDescription: "Track every dollar in and out. Generate income statements, rent rolls, and Schedule E reports for tax time. Export to QuickBooks or CSV.",
      highlights: [
        "Income statements (P&L)",
        "Expense categorization",
        "Rent roll reports",
        "Schedule E ready",
        "QuickBooks integration",
      ],
      image: "/images/features/accounting.png",
    },
  ],
};
```

## 4.5 Feature Deep-Dive Section (Alternating Layout)

For each major feature, create an alternating left/right layout:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │                              │  │                                  │ │
│  │  💰 Rent Collection          │  │                                  │ │
│  │                              │  │    [FEATURE SCREENSHOT]          │ │
│  │  Get Paid Faster with        │  │                                  │ │
│  │  Same-Day Deposits           │  │                                  │ │
│  │                              │  │                                  │ │
│  │  Stop waiting 3-5 business   │  │                                  │ │
│  │  days for rent to clear.     │  │                                  │ │
│  │  With Nomerlo, payments      │  │                                  │ │
│  │  submitted before 2pm ET     │  │                                  │ │
│  │  hit your account the        │  │                                  │ │
│  │  same day.                   │  │                                  │ │
│  │                              │  │                                  │ │
│  │  ✓ Same-day ACH deposits     │  │                                  │ │
│  │  ✓ Tenant autopay setup      │  │                                  │ │
│  │  ✓ Automatic late fees       │  │                                  │ │
│  │  ✓ Payment reminders         │  │                                  │ │
│  │                              │  │                                  │ │
│  │  [Learn More →]              │  │                                  │ │
│  │                              │  │                                  │ │
│  └──────────────────────────────┘  └──────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

// Next feature: Image on LEFT, Text on RIGHT
```

## 4.6 Comparison Table (Landlords Page)

```typescript
const landlordComparison = {
  sectionTitle: "How Nomerlo Compares",
  sectionSubtitle: "See why landlords are switching",
  
  competitors: ["Nomerlo", "AppFolio", "Buildium", "TurboTenant", "Avail"],
  
  features: [
    { name: "Same-day ACH", nomerlo: true, appfolio: false, buildium: false, turbotenant: false, avail: false },
    { name: "No per-unit fees", nomerlo: true, appfolio: false, buildium: false, turbotenant: true, avail: false },
    { name: "AI assistant", nomerlo: true, appfolio: false, buildium: false, turbotenant: false, avail: false },
    { name: "Full mobile app", nomerlo: true, appfolio: true, buildium: "Limited", turbotenant: false, avail: false },
    { name: "24/7 support", nomerlo: true, appfolio: false, buildium: false, turbotenant: false, avail: false },
    { name: "Free tier", nomerlo: true, appfolio: false, buildium: false, turbotenant: true, avail: true },
    { name: "E-signatures", nomerlo: true, appfolio: true, buildium: true, turbotenant: true, avail: false },
    { name: "Tenant screening", nomerlo: true, appfolio: true, buildium: true, turbotenant: true, avail: true },
  ],
  
  pricing: {
    nomerlo: "Free / $29",
    appfolio: "$1.40/unit",
    buildium: "$58/mo",
    turbotenant: "Free / $12/unit",
    avail: "$7/unit",
  },
};
```

## 4.7 Pricing Section (Landlords Page)

```typescript
const landlordPricing = {
  sectionTitle: "Simple, Transparent Pricing",
  sectionSubtitle: "No hidden fees. No per-unit charges.",
  
  plans: [
    {
      name: "Starter",
      price: 0,
      period: "forever",
      unitRange: "1-3 units",
      description: "Perfect for getting started",
      features: [
        "Rent collection",
        "Basic listings",
        "Maintenance tracking",
        "Tenant portal",
        "Email support",
      ],
      cta: { text: "Get Started Free", href: "/sign-up/landlord" },
    },
    {
      name: "Growth",
      price: 29,
      period: "/month",
      unitRange: "4-20 units",
      description: "For growing portfolios",
      popular: false,
      features: [
        "Everything in Starter",
        "Tenant screening (5/mo)",
        "E-signature leases",
        "AI assistant",
        "Listing syndication",
        "Phone support",
      ],
      cta: { text: "Start Free Trial", href: "/sign-up/landlord?plan=growth" },
    },
    {
      name: "Professional",
      price: 79,
      period: "/month",
      unitRange: "21-100 units",
      description: "For serious landlords",
      popular: true,
      features: [
        "Everything in Growth",
        "Unlimited screening",
        "Advanced reports",
        "API access",
        "Priority support",
        "QuickBooks sync",
      ],
      cta: { text: "Start Free Trial", href: "/sign-up/landlord?plan=professional" },
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      unitRange: "100+ units",
      description: "For property managers",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "SSO/SAML",
      ],
      cta: { text: "Contact Sales", href: "/contact?type=enterprise" },
    },
  ],
};
```

## 4.8 Landlord Testimonials

```typescript
const landlordTestimonials = {
  sectionTitle: "Trusted by 5,000+ Landlords",
  
  testimonials: [
    {
      quote: "I switched from AppFolio and cut my monthly costs by 60%. Plus, same-day deposits are a game changer.",
      author: { name: "Sarah Johnson", detail: "12 units, Austin TX" },
      rating: 5,
    },
    {
      quote: "The AI assistant handles 80% of tenant questions. I actually have time to grow my portfolio now.",
      author: { name: "Mike Rodriguez", detail: "47 units, Denver CO" },
      rating: 5,
    },
    {
      quote: "Customer support is incredible. I had an issue at 10pm on a Saturday and got help within 15 minutes.",
      author: { name: "David Kim", detail: "23 units, Los Angeles CA" },
      rating: 5,
    },
    {
      quote: "Finally, a platform that works on mobile. I can manage everything from my phone.",
      author: { name: "Jennifer Lee", detail: "8 units, Seattle WA" },
      rating: 5,
    },
  ],
};
```

## 4.9 Landlord FAQ

```typescript
const landlordFAQ = {
  sectionTitle: "Frequently Asked Questions",
  
  questions: [
    {
      question: "How long does it take to get set up?",
      answer: "Most landlords are up and running in under 10 minutes. Just add your property, set up units, and invite tenants. We also offer free data migration from other platforms.",
    },
    {
      question: "How quickly will I receive rent payments?",
      answer: "With same-day ACH, payments submitted before 2pm ET are deposited the same business day. This is significantly faster than competitors who typically take 3-5 days.",
    },
    {
      question: "Can I try before I commit?",
      answer: "Absolutely! Our Starter plan is free forever for 1-3 units. For larger portfolios, we offer a 14-day free trial with no credit card required.",
    },
    {
      question: "What if I need help migrating from another platform?",
      answer: "We offer free data migration from all major platforms including AppFolio, Buildium, TurboTenant, and more. Our team handles everything—usually within 24-48 hours.",
    },
    {
      question: "Do my tenants need to pay to use Nomerlo?",
      answer: "No! Tenants use Nomerlo completely free. They can pay rent, submit maintenance requests, and access their documents without any cost.",
    },
    {
      question: "What happens if I go over my unit limit?",
      answer: "We'll notify you as you approach your limit. You can upgrade anytime, and we'll prorate your billing. No surprises.",
    },
  ],
};
```

## 4.10 Landlord CTA Section

```typescript
const landlordCTA = {
  headline: "Ready to Simplify Your Property Management?",
  subheadline: "Join 5,000+ landlords who've made the switch. Free for 1-3 units.",
  
  primaryCTA: {
    text: "List Your Property Free",
    href: "/sign-up/landlord",
  },
  
  trustText: "No credit card required • Setup in 5 minutes • Cancel anytime",
};
```

---

# 5. FOR TENANTS PAGE

## 5.1 Page Layout Overview

```
/for-tenants
══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                           NAVIGATION                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         TENANT HERO                                      │
│             "Find Your Perfect Rental"                                   │
│                  [Start Your Search]                                     │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    PROBLEM STATEMENT                                     │
│          "Tired of fake listings and scams?"                            │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                     BENEFITS GRID                                        │
│             (All tenant benefits - 6 cards)                             │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    FEATURE SECTIONS                                      │
│         (Alternating sections for key features)                         │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                     HOW IT WORKS                                         │
│             (3-step tenant journey)                                     │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                      TESTIMONIALS                                        │
│               (Tenant-specific reviews)                                 │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                           FAQ                                            │
│                (Tenant-specific questions)                              │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                           CTA                                            │
│                  [Find Your Home]                                       │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                            FOOTER                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## 5.2 Tenant Hero Section

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                     Find Your Perfect Rental                             │
│                                                                          │
│       Browse verified listings, apply online, and move in              │
│       with confidence. No fake ads. No scams. Just real homes.         │
│                                                                          │
│                                                                          │
│         ┌──────────────────────┐    ┌──────────────────────┐            │
│         │  Start Your Search   │    │   How It Works       │            │
│         │                      │    │        ▶             │            │
│         └──────────────────────┘    └──────────────────────┘            │
│                                                                          │
│             100% verified listings • Apply in minutes                   │
│                                                                          │
│                                                                          │
│    ┌───────────────────────────────────────────────────────────────┐   │
│    │                                                                │   │
│    │              [TENANT PORTAL PREVIEW / LISTINGS]                │   │
│    │                                                                │   │
│    └───────────────────────────────────────────────────────────────┘   │
│                                                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const tenantHero = {
  headline: "Find Your Perfect Rental",
  subheadline: "Browse verified listings, apply online, and move in with confidence. No fake ads. No scams. Just real homes.",
  
  primaryCTA: {
    text: "Start Your Search",
    href: "/listings",
  },
  secondaryCTA: {
    text: "How It Works",
    href: "#how-it-works",
  },
  
  trustText: "100% verified listings • Apply in minutes • Free for tenants",
  
  heroImage: "/images/tenant-listings-preview.png",
};
```

## 5.3 Problem Statement (Tenants)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│               Finding a rental shouldn't be this hard                   │
│                                                                          │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│   │                  │  │                  │  │                  │     │
│   │  🚫 Fake         │  │  📝 Endless      │  │  📞 No           │     │
│   │     Listings     │  │     Paperwork    │  │     Response     │     │
│   │                  │  │                  │  │                  │     │
│   │  Scammers        │  │  Fill out the    │  │  Applied to 20   │     │
│   │  posting fake    │  │  same form 10    │  │  places, heard   │     │
│   │  apartments on   │  │  times for 10    │  │  back from 2.    │     │
│   │  every site.     │  │  apartments.     │  │                  │     │
│   │                  │  │                  │  │                  │     │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                                                          │
│            There's a better way. →  [See How It Works]                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```typescript
const tenantProblemStatement = {
  sectionTitle: "Finding a rental shouldn't be this hard",
  
  problems: [
    {
      emoji: "🚫",
      title: "Fake Listings",
      description: "Scammers posting fake apartments on every site.",
    },
    {
      emoji: "📝",
      title: "Endless Paperwork",
      description: "Fill out the same form 10 times for 10 apartments.",
    },
    {
      emoji: "📞",
      title: "No Response",
      description: "Applied to 20 places, heard back from 2.",
    },
  ],
  
  solution: {
    text: "There's a better way.",
    cta: {
      text: "See How It Works",
      href: "#how-it-works",
    },
  },
};
```

## 5.4 Tenant Benefits Grid

```typescript
const tenantBenefits = {
  sectionTitle: "Renting Made Simple",
  sectionSubtitle: "Everything you need to find and manage your rental.",
  
  benefits: [
    {
      icon: "ShieldCheck",
      iconColor: "text-emerald-500",
      title: "100% Verified Listings",
      description: "Every listing is verified by Nomerlo. No fake posts, no scams, no wasted time.",
    },
    {
      icon: "Zap",
      iconColor: "text-yellow-500",
      title: "Apply in Minutes",
      description: "One application, multiple properties. Save your info and apply with a single click.",
    },
    {
      icon: "MessageSquare",
      iconColor: "text-blue-500",
      title: "Direct Messaging",
      description: "Message landlords directly through the app. No more missed calls or ignored emails.",
    },
    {
      icon: "CreditCard",
      iconColor: "text-indigo-500",
      title: "Easy Rent Payments",
      description: "Pay rent online with autopay. Never worry about late fees again.",
    },
    {
      icon: "Wrench",
      iconColor: "text-orange-500",
      title: "Quick Maintenance",
      description: "Submit requests with photos. Track progress in real-time. Get issues fixed fast.",
    },
    {
      icon: "FileText",
      iconColor: "text-purple-500",
      title: "All Docs in One Place",
      description: "Access your lease, receipts, and documents anytime from your tenant portal.",
    },
  ],
};
```

## 5.5 Tenant Feature Sections (Alternating)

```typescript
const tenantFeatureSections = [
  {
    id: "verified-listings",
    title: "Verified Listings You Can Trust",
    headline: "Every Listing is Real",
    description: "We verify every property before it goes live. You'll never waste time on fake listings or fall victim to rental scams.",
    bullets: [
      "Property ownership verification",
      "Photos verified against property records",
      "Landlord identity confirmation",
      "Real-time availability updates",
    ],
    image: "/images/tenant-features/verified.png",
    imagePosition: "right",
  },
  {
    id: "easy-apply",
    title: "Apply Once, Apply Anywhere",
    headline: "One Application, Unlimited Properties",
    description: "Create your renter profile once—income, references, background check—then apply to any property with a single click.",
    bullets: [
      "Save your application info",
      "One-click apply to multiple listings",
      "Track application status in real-time",
      "Get instant decision on screenings",
    ],
    image: "/images/tenant-features/apply.png",
    imagePosition: "left",
  },
  {
    id: "tenant-portal",
    title: "Your Rental, Organized",
    headline: "Everything in Your Tenant Portal",
    description: "Pay rent, submit maintenance requests, access documents, and communicate with your landlord—all from one dashboard.",
    bullets: [
      "Pay rent online with autopay",
      "Submit & track maintenance requests",
      "Access lease and payment receipts",
      "Message your landlord directly",
    ],
    image: "/images/tenant-features/portal.png",
    imagePosition: "right",
  },
];
```

## 5.6 How It Works (Tenants)

```typescript
const tenantHowItWorks = {
  sectionTitle: "How It Works",
  sectionSubtitle: "Find your new home in 3 simple steps",
  
  steps: [
    {
      number: 1,
      icon: "Search",
      title: "Search & Browse",
      description: "Browse thousands of verified rentals. Filter by location, price, beds, and amenities.",
    },
    {
      number: 2,
      icon: "Send",
      title: "Apply Online",
      description: "Submit your application with one click. Track status in real-time and get quick decisions.",
    },
    {
      number: 3,
      icon: "Key",
      title: "Move In",
      description: "Sign your lease digitally, set up rent payments, and get your keys. Welcome home!",
    },
  ],
  
  cta: {
    text: "Start Your Search",
    href: "/listings",
  },
};
```

## 5.7 Tenant Testimonials

```typescript
const tenantTestimonials = {
  sectionTitle: "What Renters Are Saying",
  
  testimonials: [
    {
      quote: "Finally, a rental site without fake listings. Found my apartment in 3 days after wasting weeks on other sites.",
      author: { name: "Jordan Taylor", detail: "Renter in Denver, CO" },
      rating: 5,
    },
    {
      quote: "The one-click apply feature is amazing. I applied to 5 places in 10 minutes instead of filling out forms all night.",
      author: { name: "Alex Chen", detail: "Renter in San Francisco, CA" },
      rating: 5,
    },
    {
      quote: "Paying rent takes 30 seconds. Maintenance requests get fixed fast. Why isn't every landlord on this?",
      author: { name: "Maria Santos", detail: "Renter in Austin, TX" },
      rating: 5,
    },
    {
      quote: "Moved across the country and found a place without a single in-person visit. Virtual tours and video chat made it possible.",
      author: { name: "Chris Johnson", detail: "Renter in Seattle, WA" },
      rating: 5,
    },
  ],
};
```

## 5.8 Tenant FAQ

```typescript
const tenantFAQ = {
  sectionTitle: "Frequently Asked Questions",
  
  questions: [
    {
      question: "Is Nomerlo free for tenants?",
      answer: "Yes! Tenants use Nomerlo completely free. There are no fees to search, apply, pay rent, or use any features.",
    },
    {
      question: "How do I know listings are real?",
      answer: "We verify every listing before it goes live. This includes property ownership verification, photo matching, and landlord identity confirmation. If we can't verify it, we don't list it.",
    },
    {
      question: "What do I need to apply?",
      answer: "You'll need to create a renter profile with your basic info, employment details, and rental history. For screening, we'll run a credit and background check (landlord pays for this).",
    },
    {
      question: "How long does approval take?",
      answer: "Most applications are processed within 24-48 hours. Some landlords offer instant decisions. You can track your application status in real-time.",
    },
    {
      question: "Can I pay rent with a credit card?",
      answer: "Yes! You can pay via bank transfer (ACH), debit card, or credit card. Bank transfers are usually free. Card payments may have a small processing fee.",
    },
    {
      question: "What if I have a maintenance emergency?",
      answer: "Submit an emergency maintenance request through the app. Your landlord will be notified immediately. You can also mark urgency levels and include photos.",
    },
  ],
};
```

## 5.9 Tenant CTA Section

```typescript
const tenantCTA = {
  headline: "Ready to Find Your Perfect Rental?",
  subheadline: "Thousands of verified listings. Zero hassle.",
  
  primaryCTA: {
    text: "Start Your Search",
    href: "/listings",
  },
  
  trustText: "Free for tenants • 100% verified • Apply in minutes",
};
```

---

# 6. LISTINGS & SEARCH PAGES

## 6.1 Listings Page (/listings)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           NAVIGATION                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔍 Location    │ Price ▼ │ Beds ▼ │ More Filters │  [Search]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   1,234 rentals in San Francisco           │Sort: Newest ▼│ ☐ Map │ 卌 │ │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │  │
│  │  │[IMAGE]  │  │[IMAGE]  │  │[IMAGE]  │  │[IMAGE]  │             │  │
│  │  │$2,400/mo│  │$1,850/mo│  │$3,200/mo│  │$1,650/mo│             │  │
│  │  │2bd•2ba  │  │1bd•1ba  │  │3bd•2ba  │  │Studio   │             │  │
│  │  │Mission  │  │SOMA     │  │Marina   │  │Tenderloin│            │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘             │  │
│  │                                                                   │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │  │
│  │  │[IMAGE]  │  │[IMAGE]  │  │[IMAGE]  │  │[IMAGE]  │             │  │
│  │  │ ...     │  │ ...     │  │ ...     │  │ ...     │             │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘             │  │
│  │                                                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│                    [Load More] or Pagination                            │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                            FOOTER                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Listing Detail Page (/listings/[id])

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           NAVIGATION                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ← Back to Search                                                        │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │                     [PHOTO GALLERY]                              │   │
│  │                     5 photos • Virtual tour                      │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌────────────────────────────────┐  ┌───────────────────────────────┐ │
│  │                                │  │                                │ │
│  │  Sunny 2BR in the Mission      │  │  $2,400/month                  │ │
│  │  123 Valencia St, SF 94110     │  │                                │ │
│  │                                │  │  Available Feb 1, 2026         │ │
│  │  2 beds • 2 baths • 1,100 sqft │  │                                │ │
│  │                                │  │  ┌────────────────────────┐   │ │
│  │  ─────────────────────────────│  │  │     Apply Now           │   │ │
│  │                                │  │  └────────────────────────┘   │ │
│  │  About This Place              │  │                                │ │
│  │  Beautiful sun-filled 2BR...   │  │  ┌────────────────────────┐   │ │
│  │                                │  │  │   Schedule Tour         │   │ │
│  │  ─────────────────────────────│  │  └────────────────────────┘   │ │
│  │                                │  │                                │ │
│  │  Amenities                     │  │  ─────────────────────────    │ │
│  │  • In-unit laundry             │  │                                │ │
│  │  • Dishwasher                  │  │  Listed by:                    │ │
│  │  • Hardwood floors             │  │  [Photo] John Smith            │ │
│  │  • Pet friendly                │  │  Responds in < 1 hour          │ │
│  │                                │  │                                │ │
│  │  ─────────────────────────────│  │  [Message Landlord]            │ │
│  │                                │  │                                │ │
│  │  Location                      │  │  ✓ Verified listing            │ │
│  │  [MAP]                         │  │  ✓ Instant apply               │ │
│  │                                │  │                                │ │
│  └────────────────────────────────┘  └───────────────────────────────┘ │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                            FOOTER                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## 6.3 Listing Card Component

```typescript
const listingCard = {
  image: "/listing-image.jpg",
  imageCount: 5,
  price: 2400,
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1100,
  address: {
    street: "123 Valencia St",
    neighborhood: "Mission",
    city: "San Francisco",
    state: "CA",
    zip: "94110",
  },
  availableDate: "2026-02-01",
  verified: true,
  featured: false,
  tags: ["Pet Friendly", "In-Unit Laundry"],
};
```

---

# 7. PRICING PAGE

## 7.1 Dedicated Pricing Page (/pricing)

This is a standalone page (accessible from main nav) that has:
- Full pricing comparison
- Feature breakdown by plan
- FAQ
- CTA

Content is same as the pricing section on /for-landlords but expanded with more detail.

---

# 8. SHARED COMPONENTS

## 8.1 Component Library

```
src/components/
├── marketing/
│   ├── navigation.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   ├── hero-search.tsx
│   ├── trust-bar.tsx
│   ├── features-grid.tsx
│   ├── feature-section.tsx
│   ├── how-it-works.tsx
│   ├── testimonials.tsx
│   ├── testimonial-card.tsx
│   ├── pricing-section.tsx
│   ├── pricing-card.tsx
│   ├── comparison-table.tsx
│   ├── faq-section.tsx
│   ├── faq-item.tsx
│   ├── cta-section.tsx
│   ├── value-prop-split.tsx
│   ├── problem-statement.tsx
│   └── city-grid.tsx
├── listings/
│   ├── listing-card.tsx
│   ├── listing-grid.tsx
│   ├── search-bar.tsx
│   ├── search-filters.tsx
│   ├── listing-detail.tsx
│   ├── photo-gallery.tsx
│   └── map-view.tsx
└── shared/
    ├── button.tsx
    ├── input.tsx
    ├── select.tsx
    ├── badge.tsx
    ├── card.tsx
    ├── accordion.tsx
    └── tabs.tsx
```

## 8.2 Footer (Shared)

```typescript
const footer = {
  brand: {
    logo: "/logo.svg",
    tagline: "Property management made simple.",
  },
  
  columns: [
    {
      title: "For Landlords",
      links: [
        { name: "Features", href: "/for-landlords#features" },
        { name: "Pricing", href: "/pricing" },
        { name: "List Property", href: "/sign-up/landlord" },
      ],
    },
    {
      title: "For Tenants",
      links: [
        { name: "Browse Rentals", href: "/listings" },
        { name: "How It Works", href: "/for-tenants#how-it-works" },
        { name: "Tenant Portal", href: "/for-tenants#portal" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "API Docs", href: "/docs/api" },
        { name: "Status", href: "https://status.nomerlo.com" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms", href: "/terms" },
        { name: "Privacy", href: "/privacy" },
        { name: "Security", href: "/security" },
      ],
    },
  ],
  
  social: [
    { name: "Twitter", href: "https://twitter.com/nomerlo", icon: "Twitter" },
    { name: "LinkedIn", href: "https://linkedin.com/company/nomerlo", icon: "LinkedIn" },
  ],
  
  copyright: "© 2026 Nomerlo, Inc. All rights reserved.",
};
```

---

# 9. ADDITIONAL PAGES

## 9.1 About Page (/about)
Standard about page with company story, values, team.

## 9.2 Contact Page (/contact)
Contact form with options for Sales, Support, Press.

## 9.3 Blog (/blog)
Blog listing with categories for landlords and tenants.

## 9.4 Help Center (/help)
Knowledge base with separate sections for landlords and tenants.

---

# 10. SEO & METADATA

## 10.1 Homepage Metadata

```typescript
export const metadata: Metadata = {
  title: 'Nomerlo - Find Verified Rentals & Manage Properties',
  description: 'Browse verified rental listings or manage your properties with Nomerlo. Same-day rent collection, tenant screening, and more. Free for small landlords.',
  // ... rest of metadata
};
```

## 10.2 For Landlords Metadata

```typescript
export const metadata: Metadata = {
  title: 'Property Management Software for Landlords | Nomerlo',
  description: 'The all-in-one property management platform. Collect rent, screen tenants, manage maintenance. Free for 1-3 units. Same-day ACH deposits.',
  // ... rest of metadata
};
```

## 10.3 For Tenants Metadata

```typescript
export const metadata: Metadata = {
  title: 'Find Verified Rentals - No Scams | Nomerlo',
  description: 'Browse 100% verified rental listings. Apply online in minutes. No fake posts, no scams. Find your next home with confidence.',
  // ... rest of metadata
};
```

---

# 11. COMPONENT IMPLEMENTATION

## 11.1 Page Structure

```typescript
// src/app/(marketing)/page.tsx (Homepage)
import { Navigation } from '@/components/marketing/navigation'
import { HeroSearch } from '@/components/marketing/hero-search'
import { FeaturedListings } from '@/components/marketing/featured-listings'
import { CityGrid } from '@/components/marketing/city-grid'
import { ValuePropSplit } from '@/components/marketing/value-prop-split'
import { TrustBar } from '@/components/marketing/trust-bar'
import { HowItWorksTabs } from '@/components/marketing/how-it-works-tabs'
import { Testimonials } from '@/components/marketing/testimonials'
import { DualCTA } from '@/components/marketing/dual-cta'
import { Footer } from '@/components/marketing/footer'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSearch />
        <FeaturedListings />
        <CityGrid />
        <ValuePropSplit />
        <TrustBar />
        <HowItWorksTabs />
        <Testimonials type="mixed" />
        <DualCTA />
      </main>
      <Footer />
    </>
  )
}
```

```typescript
// src/app/(marketing)/for-landlords/page.tsx
import { Navigation } from '@/components/marketing/navigation'
import { LandlordHero } from '@/components/marketing/landlord-hero'
import { ProblemStatement } from '@/components/marketing/problem-statement'
import { FeaturesGrid } from '@/components/marketing/features-grid'
import { FeatureSections } from '@/components/marketing/feature-sections'
import { ComparisonTable } from '@/components/marketing/comparison-table'
import { Pricing } from '@/components/marketing/pricing'
import { Testimonials } from '@/components/marketing/testimonials'
import { FAQ } from '@/components/marketing/faq'
import { CTA } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'

export default function ForLandlordsPage() {
  return (
    <>
      <Navigation />
      <main>
        <LandlordHero />
        <ProblemStatement type="landlord" />
        <FeaturesGrid features={landlordFeatures} />
        <FeatureSections features={landlordFeatures} />
        <ComparisonTable />
        <Pricing />
        <Testimonials type="landlord" />
        <FAQ questions={landlordFAQ} />
        <CTA type="landlord" />
      </main>
      <Footer />
    </>
  )
}
```

```typescript
// src/app/(marketing)/for-tenants/page.tsx
import { Navigation } from '@/components/marketing/navigation'
import { TenantHero } from '@/components/marketing/tenant-hero'
import { ProblemStatement } from '@/components/marketing/problem-statement'
import { BenefitsGrid } from '@/components/marketing/benefits-grid'
import { FeatureSections } from '@/components/marketing/feature-sections'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Testimonials } from '@/components/marketing/testimonials'
import { FAQ } from '@/components/marketing/faq'
import { CTA } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'

export default function ForTenantsPage() {
  return (
    <>
      <Navigation />
      <main>
        <TenantHero />
        <ProblemStatement type="tenant" />
        <BenefitsGrid benefits={tenantBenefits} />
        <FeatureSections features={tenantFeatureSections} />
        <HowItWorks steps={tenantHowItWorks} />
        <Testimonials type="tenant" />
        <FAQ questions={tenantFAQ} />
        <CTA type="tenant" />
      </main>
      <Footer />
    </>
  )
}
```

---

# SUMMARY: SITE STRUCTURE

```
NOMERLO.COM
══════════════════════════════════════════════════════════════════════════

NAVIGATION:
[Logo] | For Landlords | For Tenants | Browse Rentals | Pricing | [Sign In] [List Property]

PAGES:
─────────────────────────────────────────────────────────────────────────

/                      HOMEPAGE (Marketplace)
                       • Hero with search bar
                       • Featured listings
                       • Browse by city
                       • Value prop split (landlords/tenants)
                       • How it works (tabs)
                       • Mixed testimonials
                       • Dual CTA

/for-landlords         LANDLORD PAGE
                       • Landlord-focused hero
                       • Problem statement
                       • Features grid (6 features)
                       • Feature deep-dives
                       • Comparison table
                       • Full pricing
                       • Landlord testimonials
                       • Landlord FAQ
                       • Landlord CTA

/for-tenants           TENANT PAGE
                       • Tenant-focused hero
                       • Problem statement
                       • Benefits grid (6 benefits)
                       • Feature sections
                       • How it works (3 steps)
                       • Tenant testimonials
                       • Tenant FAQ
                       • Tenant CTA

/listings              BROWSE RENTALS
                       • Search + filters
                       • Listing grid
                       • Map view toggle

/listings/[id]         LISTING DETAIL
                       • Photo gallery
                       • Details + amenities
                       • Apply/Contact buttons
                       • Map

/pricing               PRICING PAGE
                       • Full pricing details

/sign-up/landlord      LANDLORD SIGNUP
/sign-up/tenant        TENANT SIGNUP

═══════════════════════════════════════════════════════════════════════
```

---

**Document Version:** 2.0  
**Last Updated:** January 2026  
**Prepared for:** Cursor IDE Development

*This document reflects the restructured landing page with separate audience-specific pages for landlords and tenants, with the homepage serving as a marketplace.*
