# NOMERLO - Super Admin Panel
## Complete System Documentation

**Version:** 1.0  
**Last Updated:** January 2026  
**Portal Type:** Internal Administration & Platform Management  
**Target Users:** Nomerlo Staff (Customer Support, Operations, Finance, Engineering, Executive)

---

# TABLE OF CONTENTS

1. [Overview & Introduction](#1-overview--introduction)
2. [Authentication & Access Control](#2-authentication--access-control)
3. [Navigation Structure](#3-navigation-structure)
4. [Dashboard & Command Center](#4-dashboard--command-center)
5. [User Management](#5-user-management)
6. [Property Management](#6-property-management)
7. [Financial Operations](#7-financial-operations)
8. [Support Center](#8-support-center)
9. [Fraud Detection & Trust Safety](#9-fraud-detection--trust-safety)
10. [Content Moderation](#10-content-moderation)
11. [Subscription & Billing Management](#11-subscription--billing-management)
12. [Platform Analytics](#12-platform-analytics)
13. [System Configuration](#13-system-configuration)
14. [AI Assistant Management](#14-ai-assistant-management)
15. [Audit Logs & Compliance](#15-audit-logs--compliance)
16. [Communication Tools](#16-communication-tools)
17. [Admin Team Management](#17-admin-team-management)
18. [Data Models & API Endpoints](#18-data-models--api-endpoints)

---

# 1. OVERVIEW & INTRODUCTION

## 1.1 Portal Purpose

The Super Admin Panel is Nomerlo's internal command center for managing the entire platform. It provides comprehensive tools for customer support, fraud prevention, financial oversight, system configuration, and operational excellence. This is the backbone of Nomerlo's commitment to world-class customer support and platform reliability.

## 1.2 Core Objectives

| Objective | Description |
|-----------|-------------|
| **Customer Excellence** | Enable rapid response to user issues, proactive support, and seamless resolution |
| **Platform Integrity** | Detect and prevent fraud, ensure listing accuracy, maintain trust |
| **Financial Oversight** | Monitor transactions, manage payouts, handle disputes efficiently |
| **Operational Efficiency** | Automate routine tasks, provide actionable insights, scale operations |
| **Compliance & Security** | Maintain audit trails, ensure regulatory compliance, protect user data |

## 1.3 Admin User Types & Permissions

| Role | Level | Access Scope |
|------|-------|--------------|
| **Super Admin** | 5 | Full platform access, system configuration, user role management |
| **Finance Admin** | 4 | Payouts, disputes, refunds, subscriptions, financial reports |
| **Ops Admin** | 4 | All users, properties, fraud review, content moderation |
| **Support Admin** | 4 | Tickets, user lookup, account help, escalations |
| **Support Agent** | 2 | View users, handle basic tickets, no financial access |
| **Read-Only** | 1 | View-only access for auditors, analysts, and reporting |

## 1.4 Permission Matrix

| Feature | Super Admin | Finance Admin | Ops Admin | Support Admin | Support Agent | Read-Only |
|---------|:-----------:|:-------------:|:---------:|:-------------:|:-------------:|:---------:|
| View Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| User Management | ✓ (all) | View | ✓ (all) | ✓ (limited) | View | View |
| Suspend/Ban Users | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ |
| Property Management | ✓ | View | ✓ | View | View | View |
| Financial Operations | ✓ | ✓ | View | View | View | View |
| Process Refunds | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Approve Payouts | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Support Tickets | ✓ | View | ✓ | ✓ | ✓ (assigned) | View |
| Fraud Review | ✓ | ✓ | ✓ | ✓ | ✗ | View |
| Content Moderation | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| System Config | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| AI Management | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| Audit Logs | ✓ | ✓ (finance) | ✓ | View | ✗ | View |
| Admin User Mgmt | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

---

# 2. AUTHENTICATION & ACCESS CONTROL

## 2.1 Login Requirements

- Email + Password OR SSO (Google Workspace / Okta)
- Multi-Factor Authentication (MFA) - **Required for all admin accounts**
- IP Whitelisting - Required for Super Admin level
- Session timeout: 8 hours active, 30 minutes idle

## 2.2 Session Management

| Setting | Value |
|---------|-------|
| Session Duration | 8 hours (active) |
| Idle Timeout | 30 minutes |
| Max Concurrent Sessions | 2 |
| Session Lock on Sensitive Actions | Required (re-auth for payouts, user bans) |
| IP Whitelisting | Required for Super Admin |

## 2.3 Access Logging

All admin actions are logged:
- Login/logout events
- User data access
- Configuration changes
- Financial operations
- Support ticket actions

---

# 3. NAVIGATION STRUCTURE

## 3.1 URL Structure

```
DOMAIN: admin.nomerlo.com

MAIN ROUTES:
├── /                           → Dashboard / Command Center
├── /users                      → User Management
│   ├── /users/owners           → Owner accounts
│   ├── /users/tenants          → Tenant accounts
│   ├── /users/maintenance      → Maintenance staff
│   ├── /users/vendors          → Vendor accounts
│   └── /users/:id              → User detail view
├── /properties                 → Property Management
│   ├── /properties/all         → All properties
│   ├── /properties/listings    → Active listings
│   ├── /properties/flagged     → Flagged for review
│   └── /properties/:id         → Property detail
├── /finance                    → Financial Operations
│   ├── /finance/transactions   → All transactions
│   ├── /finance/payouts        → Owner payouts
│   ├── /finance/disputes       → Payment disputes
│   ├── /finance/refunds        → Refund queue
│   └── /finance/subscriptions  → Subscription management
├── /support                    → Support Center
│   ├── /support/tickets        → All tickets
│   ├── /support/queue          → My queue
│   ├── /support/escalations    → Escalated tickets
│   └── /support/canned         → Canned responses
├── /trust                      → Trust & Safety
│   ├── /trust/fraud            → Fraud detection
│   ├── /trust/verification     → Verification queue
│   ├── /trust/reports          → User reports
│   └── /trust/bans             → Banned accounts
├── /content                    → Content Moderation
│   ├── /content/listings       → Listing review
│   ├── /content/photos         → Photo moderation
│   └── /content/reviews        → Review moderation
├── /analytics                  → Platform Analytics
├── /config                     → System Configuration
├── /ai                         → AI Management
├── /audit                      → Audit & Compliance
├── /communication              → Communication Tools
├── /team                       → Admin Team Management
└── /settings                   → Personal Settings
```

---

# 4. DASHBOARD & COMMAND CENTER

## 4.1 Main Dashboard Components

### Platform Health Indicators
- Systems status (uptime, latency)
- Payment processing status
- AI assistant status
- Support queue health

### Key Metrics (Daily)
- Total rent collected
- New signups
- Active listings
- Support tickets

### Requires Attention Queue
- Escalated tickets (with age)
- Payment disputes (with $ at risk)
- Flagged listings (policy violations)
- Pending verifications
- Payout holds

### Activity Feed
- Real-time platform events
- Recent admin actions
- System notifications

### Quick Actions
- Find User
- Find Property
- Create Ticket
- Process Refund
- Send Blast
- System Status

## 4.2 Global Search

Search across all entities:
- Users (by name, email, phone)
- Properties (by address, ID, owner)
- Tickets (by ID, subject, content)
- Transactions (by ID, amount)

---

# 5. USER MANAGEMENT

## 5.1 User List Features

- Paginated list with search/filter
- Tabs: All, Active, Suspended, Pending
- Filters: Status, Plan, Region, Date Range
- Bulk actions: Export, Email, Status change

## 5.2 User Detail View

### Profile Information
- Account details (ID, type, status)
- Contact information
- Subscription plan & billing status
- Verification status (email, phone, 2FA)

### Portfolio Summary (Owners)
- Properties count
- Units (occupied/vacant)
- Total collected
- Outstanding balance

### Financial Summary
- Total collected/paid
- Payment method on file
- Next payout amount
- Transaction history link

### Support History
- Ticket count (open/resolved)
- CSAT score
- Recent tickets

### Risk Indicators
- Trust score (0-100)
- Fraud flags count
- Chargebacks count
- User reports count
- Verification completion

## 5.3 User Actions

| Action | Description | Permission Required |
|--------|-------------|---------------------|
| View | See user details | All admins |
| Edit | Modify user info | Ops Admin+ |
| Impersonate | View platform as user | Ops Admin+ |
| Reset Password | Send password reset | Support Admin+ |
| Suspend | Temporarily disable account | Support Admin+ |
| Ban | Permanently disable account | Ops Admin+ |
| Delete | Remove account (GDPR) | Super Admin |

---

# 6. PROPERTY MANAGEMENT

## 6.1 Property List

- All properties with search/filter
- Tabs: All, Listed, Flagged, Under Review
- Quick view: Address, owner, units, status, listings

## 6.2 Property Detail

### Property Information
- Address, type, units count
- Owner details with link
- Verification status

### Units Overview
- Unit list with status
- Occupancy details
- Lease information
- Listing status

### Verification Status
- Owner identity verified
- Property ownership verified
- Photos verified
- User reports status
- Trust score

## 6.3 Property Actions

| Action | Description |
|--------|-------------|
| View as Public | See public listing |
| Edit Property | Modify property details |
| Remove Listing | Take listing offline |
| Flag for Review | Mark for investigation |
| Contact Owner | Send message to owner |
| View Audit Log | See property history |

## 6.4 Flagged Listings Queue

Review triggers:
- AI detection (scam indicators)
- Below-market pricing
- Stock photos detected
- Description matches scam templates
- New account + multiple listings
- User reports

---

# 7. FINANCIAL OPERATIONS

## 7.1 Transaction Overview

### Summary Metrics (30 days)
- Total collected
- Total paid out
- Fees earned
- Pending amount

### Transaction List
- All transactions with filters
- Type: Rent, Payout, Dispute, Refund
- Status: Completed, Processing, Failed
- Actions: View details, related entities

## 7.2 Payout Management

### Payout Tabs
- Scheduled
- Processing
- On Hold (manual review)
- Completed

### Hold Reasons
- Account suspended
- First large payout (>$10K)
- Fraud investigation
- Document verification required

### Payout Actions
- Release payout
- Hold for review
- Cancel payout
- Request documents

## 7.3 Dispute Resolution

### Dispute Details
- Status & deadline
- Type & reason
- Amount at risk
- Parties involved

### Evidence & Timeline
- Chronological event log
- Attached documents
- Communications

### Resolution Options
- Rule for Tenant (Refund)
- Rule for Owner (Deny)
- Split (Partial refund)

## 7.4 Refund Processing

Required information:
- Original transaction
- Refund amount (full/partial)
- Refund reason
- Internal notes
- Notification preferences

---

# 8. SUPPORT CENTER

## 8.1 Ticket Queue

### Views
- All Tickets
- My Queue
- Unassigned
- Escalated

### Ticket Card Information
- Ticket number & subject
- User info & type
- Category & priority
- SLA status & timer
- Assigned agent

### Priority Levels
| Priority | First Response | Resolution | Auto-escalate |
|----------|---------------|------------|---------------|
| Urgent | 15 min | 2 hours | 30 min |
| High | 1 hour | 4 hours | 2 hours |
| Medium | 4 hours | 24 hours | 8 hours |
| Low | 24 hours | 72 hours | 48 hours |

## 8.2 Ticket Detail View

### Conversation Thread
- User messages
- Agent responses
- AI assistant interactions
- Internal notes (admin only)

### User Context Panel
- User profile summary
- Previous tickets
- Quick actions

### Ticket Actions
- Assign/reassign
- Change status/priority
- Escalate
- Merge tickets
- Add internal note

## 8.3 Canned Responses

Template variables:
- {{customer_name}}
- {{amount}}
- {{date}}
- {{property_address}}
- {{ticket_number}}

---

# 9. FRAUD DETECTION & TRUST SAFETY

## 9.1 Fraud Dashboard

### Metrics (30 days)
- Fraud cases detected
- Catch rate percentage
- Prevented losses ($)
- Banned accounts

### Active Alerts
- Risk level (High/Medium/Low)
- Alert type
- User & indicators
- Risk score

### Fraud Patterns
Top indicators tracked:
1. Below-market pricing
2. Stock photo usage
3. Off-platform communication requests
4. Wire transfer requests
5. New accounts with multiple listings

## 9.2 User Reports Queue

Report types:
- Potential scam
- Harassment
- Fake listing
- Discrimination
- Other

Actions:
- Dismiss
- Warning
- Suspend
- Ban

## 9.3 Verification Queue

### Types
- Identity verification
- Property ownership
- Business verification

### AI Check Results
- Document authenticity
- Face match confidence
- Name match
- Address verification

---

# 10. CONTENT MODERATION

## 10.1 Listing Moderation

### Auto-moderation Stats
- Auto-approved percentage
- Manual review percentage

### Review Triggers
- New account
- Price anomaly
- Phone number in description
- Suspicious keywords

### Actions
- Approve
- Request Edit
- Reject (with reason)

## 10.2 Photo Moderation

AI catches:
- Inappropriate content
- Stock photos
- Watermarked images
- Duplicate photos
- Misleading photos

## 10.3 Review Moderation

Flag reasons:
- Inappropriate language
- Personal information
- Fake review suspected
- Reported by owner

---

# 11. SUBSCRIPTION & BILLING MANAGEMENT

## 11.1 MRR Metrics

- Total MRR
- Net new MRR
- Growth rate
- Churn rate

## 11.2 Plan Distribution

| Plan | Price | Users | MRR |
|------|-------|-------|-----|
| Starter | Free | 8,234 | $0 |
| Growth | $29/mo | 3,456 | $100,224 |
| Professional | $79/mo | 760 | $60,040 |

## 11.3 Coupon Management

Coupon properties:
- Code
- Discount type (% or fixed)
- Usage limit
- Expiration date
- Status

---

# 12. PLATFORM ANALYTICS

## 12.1 KPI Dashboard

### User Metrics
- Total users
- New users (period)
- Conversion rate
- Churn rate

### Revenue Metrics
- MRR / ARR
- ARPU
- Revenue by plan

### Support Metrics
- Avg first response time
- Avg resolution time
- CSAT score
- SLA compliance

## 12.2 User Analytics

### Acquisition Funnel
1. Website visitors
2. Signups
3. Added property
4. First tenant
5. Paid subscriber

### Cohort Retention
Monthly retention by signup cohort

## 12.3 Support Analytics

- Ticket volume by category
- Agent performance leaderboard
- CSAT trends

---

# 13. SYSTEM CONFIGURATION

## 13.1 General Settings

- Platform name
- Support email
- Default timezone
- Default currency
- Maintenance mode

## 13.2 Feature Flags

Toggle features:
- New checkout flow (A/B test)
- AI phone assistant
- International payments
- Beta features

## 13.3 Regional Settings

Per region configuration:
- Currency
- Language(s)
- Active markets
- Compliance requirements

## 13.4 Integration Settings

### Configured Integrations
- Stripe Connect (payments)
- TransUnion ShareAble (screening)
- OpenAI (AI)
- Twilio (SMS/Voice)
- Vapi AI (voice assistant)

---

# 14. AI ASSISTANT MANAGEMENT

## 14.1 Conversation Logs

### Performance Metrics
- Total conversations
- Resolution rate
- Avg response time
- Escalation rate

### Conversation List
- Channel (Voice/Chat/Email)
- Outcome (Resolved/Escalated)
- Duration
- Transcript link

## 14.2 Conversation Detail

- Full transcript
- Recording (voice)
- Actions taken by AI
- Quality review form

## 14.3 AI Training

### System Prompts
- Voice assistant prompt
- Chat widget prompt
- Email auto-responder prompt

### Escalation Rules
Conditions for human handoff:
- User explicitly requests agent
- Legal threats
- Financial dispute over threshold
- Negative sentiment detected
- Low AI confidence score
- Specific topics (suspension, refunds)

---

# 15. AUDIT LOGS & COMPLIANCE

## 15.1 Activity Logs

Logged actions:
- Login/logout
- User data access
- User modifications
- Financial operations
- Configuration changes
- Impersonation sessions

### Log Entry Details
- Timestamp
- Admin user
- Action type
- Resource affected
- IP address
- Details/notes

## 15.2 Data Export Requests

Types:
- User data export (GDPR)
- Transaction reports
- User deletion requests

## 15.3 Compliance Status

| Standard | Status |
|----------|--------|
| PCI DSS Level 1 | Compliant |
| SOC 2 Type II | Compliant |
| GDPR | Compliant |
| CCPA | Compliant |
| Fair Housing Act | Compliant |

---

# 16. COMMUNICATION TOOLS

## 16.1 Mass Notifications

### Configuration
- Notification type
- Target audience
- Channels (Email, In-App, SMS, Push)
- Message content
- Schedule

### Audience Filters
- All users
- User type (Owner/Tenant)
- Region
- Plan
- Custom segment

## 16.2 Email Templates

Categories:
- Transactional
- Marketing
- Support
- Notifications

Variables: {{first_name}}, {{amount}}, {{date}}, etc.

## 16.3 SMS Campaigns

- Usage tracking
- Automated triggers
- Cost per message

## 16.4 In-App Announcements

Types:
- Banner (top of dashboard)
- Modal (dismissible)
- Tooltip (feature highlight)

---

# 17. ADMIN TEAM MANAGEMENT

## 17.1 Team Members

- Member list with roles
- Status (Active/Inactive)
- Last login
- Actions: Edit, Reset Password, View Activity

## 17.2 Role Management

Configurable permissions per role:
- Users (view, edit, suspend, delete, impersonate)
- Properties (view, edit, flag, remove)
- Support (view, handle, escalate, manage)
- Financial (view, refunds, payouts, subscriptions)
- Content (listings, photos, reviews)
- System (config, integrations, audit)

## 17.3 Team Performance

Metrics per agent:
- Tickets handled
- Avg resolution time
- CSAT score
- Escalation count

---

# 18. DATA MODELS & API ENDPOINTS

## 18.1 Admin API Endpoints

**Base URL:** `https://admin-api.nomerlo.com/v1`

### Authentication
```
POST   /auth/login
POST   /auth/logout
POST   /auth/mfa/verify
GET    /auth/session
```

### Users
```
GET    /users
GET    /users/:id
PUT    /users/:id
POST   /users/:id/suspend
POST   /users/:id/reinstate
POST   /users/:id/ban
DELETE /users/:id
POST   /users/:id/impersonate
GET    /users/:id/activity
GET    /users/:id/transactions
GET    /users/:id/tickets
```

### Properties
```
GET    /properties
GET    /properties/:id
PUT    /properties/:id
POST   /properties/:id/flag
DELETE /properties/:id/listing
GET    /properties/flagged
```

### Finance
```
GET    /transactions
GET    /transactions/:id
GET    /payouts
POST   /payouts/:id/release
POST   /payouts/:id/hold
GET    /disputes
POST   /disputes/:id/resolve
POST   /refunds
GET    /subscriptions
```

### Support
```
GET    /tickets
GET    /tickets/:id
POST   /tickets
PUT    /tickets/:id
POST   /tickets/:id/assign
POST   /tickets/:id/escalate
POST   /tickets/:id/resolve
POST   /tickets/:id/reply
GET    /canned-responses
```

### Trust & Safety
```
GET    /fraud/alerts
POST   /fraud/alerts/:id/review
GET    /reports
POST   /reports/:id/action
GET    /verifications
POST   /verifications/:id/approve
GET    /bans
```

### Content Moderation
```
GET    /moderation/listings
POST   /moderation/listings/:id/approve
POST   /moderation/listings/:id/reject
GET    /moderation/photos
GET    /moderation/reviews
```

### Analytics
```
GET    /analytics/overview
GET    /analytics/users
GET    /analytics/revenue
GET    /analytics/support
```

### AI Management
```
GET    /ai/conversations
GET    /ai/conversations/:id
GET    /ai/escalations
GET    /ai/performance
PUT    /ai/prompts/:id
PUT    /ai/escalation-rules
```

### System Configuration
```
GET    /config
PUT    /config
GET    /config/feature-flags
PUT    /config/feature-flags/:id
GET    /config/regions
GET    /config/integrations
```

### Audit & Compliance
```
GET    /audit/logs
POST   /audit/exports
GET    /audit/compliance
```

### Communication
```
POST   /notifications
GET    /email-templates
PUT    /email-templates/:id
POST   /announcements
```

### Team Management
```
GET    /team/members
POST   /team/members
PUT    /team/members/:id
GET    /team/roles
PUT    /team/roles/:id
GET    /team/activity
```

## 18.2 Key Data Models

### AdminUser
```typescript
interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: AdminRole;
  status: 'active' | 'inactive' | 'suspended';
  mfa_enabled: boolean;
  last_login: string | null;
  created_at: string;
}
```

### SupportTicket
```typescript
interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  subject: string;
  category: TicketCategory;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed';
  assigned_to: string | null;
  sla_deadline: string;
  sla_breached: boolean;
  messages: TicketMessage[];
  created_at: string;
  resolved_at: string | null;
  csat_rating: number | null;
}
```

### FraudAlert
```typescript
interface FraudAlert {
  id: string;
  alert_type: FraudAlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  user_id: string;
  indicators: FraudIndicator[];
  status: 'new' | 'reviewing' | 'confirmed' | 'dismissed';
  reviewed_by: string | null;
  created_at: string;
}
```

### AuditLog
```typescript
interface AuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: AuditAction;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: string;
}
```

---

# APPENDIX A: KEYBOARD SHORTCUTS

| Shortcut | Action |
|----------|--------|
| G + D | Go to Dashboard |
| G + U | Go to Users |
| G + P | Go to Properties |
| G + T | Go to Tickets |
| G + F | Go to Finance |
| / | Focus global search |
| ? | Show keyboard shortcuts |
| N | New ticket (in support) |
| E | Edit (in detail views) |
| Esc | Close modal / Go back |

---

# APPENDIX B: ESCALATION PROCEDURES

## Ticket Escalation Path

```
Level 1: Support Agent
    ↓ (if unresolved in 4 hours)
Level 2: Support Admin
    ↓ (if unresolved in 8 hours)
Level 3: Department Lead
    ↓ (if critical issue)
Level 4: VP/Director
    ↓ (if legal/PR/strategic)
Level 5: Executive Team
```

---

# APPENDIX C: ADMIN ONBOARDING CHECKLIST

## New Admin Setup
- [ ] Account created by Super Admin
- [ ] Email invitation sent
- [ ] Password set
- [ ] MFA configured (required)
- [ ] Role assigned
- [ ] Training modules completed
- [ ] Full access granted

## Required Training
1. Platform Overview (30 min)
2. Support Procedures (1 hour)
3. Fraud Detection (45 min)
4. Financial Operations (1 hour) - Finance roles
5. Compliance & Privacy (30 min)

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Author:** Nomerlo Product Team  
**Classification:** Internal Use Only
