# NOMERLO MAINTENANCE PORTAL
## Complete System Documentation for Development

**Version:** 1.0  
**Last Updated:** January 2026  
**Instance:** Maintenance Portal  
**Base URL:** `app.nomerlo.com/maintenance`

---

# TABLE OF CONTENTS

1. [Overview & User Types](#1-overview--user-types)
2. [Authentication & Access Control](#2-authentication--access-control)
3. [Dashboard](#3-dashboard)
4. [Work Orders](#4-work-orders)
5. [Schedule Management](#5-schedule-management)
6. [Inventory Management](#6-inventory-management)
7. [Vendor & Contractor Management](#7-vendor--contractor-management)
8. [Documents & Resources](#8-documents--resources)
9. [Communication](#9-communication)
10. [Reports & Analytics](#10-reports--analytics)
11. [Profile & Settings](#11-profile--settings)
12. [AI Assistant Integration](#12-ai-assistant-integration)
13. [Mobile Experience](#13-mobile-experience)
14. [API Endpoints](#14-api-endpoints)
15. [Data Models](#15-data-models)

---

# 1. OVERVIEW & USER TYPES

## 1.1 Maintenance Portal Purpose

The Maintenance Portal is a dedicated workspace for maintenance personnel and vendors to efficiently manage property repairs, preventive maintenance, and work orders across managed properties. It provides:

- Real-time work order management and prioritization
- Schedule optimization and route planning
- Inventory tracking and parts management
- Time and cost tracking for all jobs
- Direct communication with tenants and owners
- Performance analytics and reporting
- Technical documentation and manuals

## 1.2 User Types & Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| Maintenance Manager | Full portal access, assigns work, manages inventory, vendors, reports | Full |
| Maintenance Technician | Assigned properties, work orders, time tracking, parts usage | Limited |
| Maintenance Helper | Assists on jobs, limited access, time entry only | Minimal |
| External Vendor | Assigned jobs only, invoice submission, own performance data | Assigned Only |

## 1.3 Role Permissions Matrix

| Permission | Manager | Technician | Helper | Vendor |
|------------|---------|------------|--------|--------|
| View Dashboard | Full | Limited | Personal | Assigned |
| Create Work Orders | Yes | Yes | No | No |
| Assign Work Orders | Yes | No | No | No |
| Complete Work Orders | Yes | Yes | Yes | Yes |
| View All Properties | Yes | No | No | No |
| Manage Inventory | Yes | View | No | No |
| Order Parts | Yes | Request | No | No |
| Manage Vendors | Yes | No | No | No |
| View Reports | Yes | Personal | No | Own |
| Access Documents | Yes | Yes | Limited | Job |
| Manage Team | Yes | No | No | No |
| Submit Invoices | No | No | No | Yes |

## 1.4 Work Order Lifecycle

```
NEW → ASSIGNED → IN PROGRESS → (ON HOLD) → REVIEW PENDING → COMPLETED → CLOSED

Sources:
- Tenant request
- Owner request
- Scheduled PM
- Inspection finding
- AI triage

Completion includes:
- Time logged
- Parts used
- Photos attached
- Tenant signature
- Resolution notes
```

## 1.5 Navigation Structure

```
MAINTENANCE PORTAL NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

├── Dashboard           /maintenance/dashboard
├── Work Orders         /maintenance/work-orders
│   ├── All Orders      /maintenance/work-orders
│   ├── My Orders       /maintenance/work-orders/mine
│   ├── Emergency       /maintenance/work-orders/emergency
│   └── Scheduled       /maintenance/work-orders/scheduled
├── Schedule            /maintenance/schedule
│   ├── Calendar        /maintenance/schedule/calendar
│   ├── Route Planner   /maintenance/schedule/routes
│   └── Availability    /maintenance/schedule/availability
├── Inventory           /maintenance/inventory
│   ├── Parts List      /maintenance/inventory/parts
│   ├── Order History   /maintenance/inventory/orders
│   └── Low Stock       /maintenance/inventory/alerts
├── Vendors             /maintenance/vendors
│   ├── Vendor List     /maintenance/vendors/list
│   ├── Add Vendor      /maintenance/vendors/add
│   └── Invoices        /maintenance/vendors/invoices
├── Documents           /maintenance/documents
│   ├── Manuals         /maintenance/documents/manuals
│   ├── Procedures      /maintenance/documents/procedures
│   └── Safety          /maintenance/documents/safety
├── Messages            /maintenance/messages
├── Reports             /maintenance/reports
│   ├── Performance     /maintenance/reports/performance
│   ├── Costs           /maintenance/reports/costs
│   ├── Time Tracking   /maintenance/reports/time
│   └── Property        /maintenance/reports/properties
├── Profile             /maintenance/profile
├── Settings            /maintenance/settings
└── Logout
```

---

# 2. AUTHENTICATION & ACCESS CONTROL

## 2.1 Staff Invitation Flow

Maintenance staff are invited by property owners or managers via email invitation containing:
- Role assignment (Manager/Technician/Helper)
- Assigned properties
- Portal access link
- 7-day expiration

## 2.2 Account Setup Steps

1. **Create Account**: Email, name, phone, password
2. **Skills & Certifications**: Select skills, upload certifications
3. **Availability**: Set working hours, on-call preferences
4. **Complete**: Review and start

## 2.3 Vendor Registration

External vendors complete a separate registration:
- Business information
- Service category
- License number and state
- Insurance certificate upload
- Coverage amount and expiration
- W-9 documentation
- Payment terms

## 2.4 Login Methods

- Email + Password
- Mobile app biometric
- SSO (enterprise)

---

# 3. DASHBOARD

## 3.1 Manager Dashboard Components

**Today's Overview Stats:**
- Open Orders (with trend)
- Emergency Priority count
- Scheduled Today count
- Completed This Week

**Emergency Orders Panel:**
- List of emergency work orders
- Quick assign and view actions
- Time since created

**Team Status Panel:**
- Staff member status (Available/On Job/En Route)
- Current job location
- Jobs scheduled today

**Today's Schedule:**
- Timeline view of day's jobs
- Color-coded by priority
- Estimated duration and assignee

**Alerts Panel:**
- Low inventory warnings
- Pending invoice approvals
- Upcoming inspections

**Weekly Performance:**
- Completion rate
- Response time
- Tenant satisfaction rating

## 3.2 Technician Dashboard Components

**My Day Stats:**
- Jobs Today
- Emergency count
- Hours Estimated
- Parts Needed ($)

**My Jobs Today:**
- Chronological list
- Priority indicators
- Address and tenant info
- Navigate/Call/Start actions

**Today's Route:**
- Map view with numbered stops
- Total distance and drive time
- Open in Maps option

**My Stats This Week:**
- Jobs completed
- Average response time
- First-time fix rate
- Tenant rating
- Hours logged
- Parts used

## 3.3 Vendor Dashboard Components

**Overview Stats:**
- Active Jobs
- Completed This Month
- Pending Payment
- Paid This Month

**Assigned Jobs:**
- Job cards with details
- Contact information
- Navigate and view actions

**Invoices Panel:**
- Pending payment
- Paid this month
- Submit new invoice action

**Performance Metrics:**
- Response time
- Completion rate
- Rating
- Jobs per month

---

# 4. WORK ORDERS

## 4.1 Work Orders List View

**Tabs:**
- All
- Emergency (count)
- Open (count)
- In Progress (count)
- On Hold (count)
- Scheduled (count)
- Completed
- Closed

**Filters:**
- Property
- Category
- Assignee
- Date Range

**List Columns:**
- Checkbox
- Work Order #
- Category
- Title
- Priority/Status
- Property
- Assignee
- Time created

**Bulk Actions:**
- Assign Selected
- Change Priority
- Export

## 4.2 Work Order Detail View

**Header:**
- Work order number
- Title and category
- Status badge
- Priority indicator

**Tabs:**
- Overview
- Activity
- Time & Parts
- Photos
- Communication

**Details Section:**
- Property and unit
- Location within property
- Owner contact
- Tenant contact
- Entry permission status

**Assignment Section:**
- Assigned to dropdown
- Scheduled date/time
- Estimated duration
- Reassign/Reschedule buttons

**Description:**
- Full description text
- Attachments/photos from request

**Suggested Parts (AI):**
- Parts likely needed
- Stock availability
- Reserve parts action

**Actions:**
- Navigate
- Call Tenant
- Message
- Start Job

## 4.3 Create Work Order Form

**Property & Location:**
- Property selector
- Unit selector
- Specific location text

**Issue Details:**
- Category dropdown
- Priority dropdown
- Subcategory
- Title
- Description
- Attachments upload

**Assignment:**
- Auto-assign (recommended)
- Specific technician
- External vendor
- Leave unassigned

**Schedule:**
- ASAP
- Specific date/time
- Within timeframe

**Notifications:**
- Notify tenant checkbox
- Notify owner checkbox
- Notify assignee checkbox

## 4.4 In-Progress Work Order View

**Timer Display:**
- Running time
- Pause/Break/Complete buttons

**Work Log:**
- Timestamped entries
- Add log entry button

**Parts Used:**
- Item, quantity, cost
- Add/remove parts
- Running total

**Photos:**
- Before/during/after
- Add photo button

**Quick Actions:**
- Call Tenant
- Message Owner
- Request Help
- Get Directions
- View Property Docs

## 4.5 Complete Work Order Form

**Time Summary:**
- Start time
- End time
- Total time
- Break time
- Billable time
- Edit times option

**Parts Used Review:**
- Item list with costs
- Add more parts option
- Total parts cost

**Resolution:**
- Resolution type (Fully resolved/Partially/Unable/Canceled)
- Resolution notes (required)

**Completion Photos:**
- Minimum 2 required
- Add more option

**Tenant Signature:**
- Signature capture
- Not present checkbox

**Follow-up Options:**
- Schedule follow-up work order
- Create preventive maintenance task
- Flag for owner review

## 4.6 Priority Levels

| Priority | Color | Response Time | Examples |
|----------|-------|---------------|----------|
| Emergency | Red | < 4 hours | No heat, flooding, gas leak, no water, electrical hazard |
| High | Yellow | < 24 hours | AC not working (summer), appliance failure, significant leak |
| Normal | Green | < 72 hours | Minor repairs, fixture replacement, cosmetic issues |
| Low | Blue | < 7 days | Preventive maintenance, non-urgent improvements |
| Scheduled | Gray | As scheduled | Seasonal maintenance, inspections, routine service |

## 4.7 Work Order Categories

| Category | Subcategories |
|----------|---------------|
| Plumbing | Leak, Clog, Toilet, Faucet, Water Heater, Garbage Disposal, Pipe Issue |
| Electrical | Outlet, Switch, Lighting, Circuit Breaker, Wiring, Smoke Detector |
| HVAC | Heating, Cooling, Thermostat, Air Quality, Ductwork, Filter |
| Appliance | Refrigerator, Stove/Oven, Dishwasher, Washer/Dryer, Microwave |
| General | Doors, Windows, Locks, Flooring, Walls, Ceiling, Painting |
| Exterior | Landscaping, Parking, Fencing, Gutters, Roof, Siding |
| Pest Control | Insects, Rodents, Wildlife, Prevention |
| Safety | Fire Safety, Security, Emergency Systems |

---

# 5. SCHEDULE MANAGEMENT

## 5.1 Calendar View

**View Options:**
- Day
- Week
- Month

**Filters:**
- All Staff
- All Properties
- All Categories

**Calendar Display:**
- Time slots with job blocks
- Color-coded by priority
- Drag-and-drop scheduling

**Legend:**
- Emergency (Red)
- High/Vendor (Yellow)
- Normal (Green)
- Inspection (Blue)

## 5.2 Route Planner

**Technician Selector**

**Map View:**
- Numbered stops
- Route lines

**Route Details:**
- Starting point (workshop)
- Numbered stops with:
  - Address
  - Job type and priority
  - Estimated duration
  - Drive time to next

**Route Summary:**
- Total distance
- Total drive time
- Total work time
- Estimated end time

**Route Options:**
- Optimize for shortest distance
- Optimize for shortest time
- Prioritize emergency jobs first
- Include lunch break

**Actions:**
- Recalculate
- Save Route
- Send to Mobile
- Open in Maps

## 5.3 Staff Availability

**Weekly Grid View:**
- Staff rows
- Day columns
- Availability indicators
- On-call status
- PTO marked

**Availability Legend:**
- Available (filled)
- Partial (half)
- PTO (icon)
- OFF (not working)

## 5.4 Preventive Maintenance Scheduling

**Tabs:**
- Upcoming
- All Schedules
- Completed
- Overdue (count)

**PM Schedule Card:**
- Date
- Task name
- Property/units
- Frequency
- Last completed
- Assignee
- Estimated duration
- Parts needed
- View/Reschedule/Complete actions

**Create PM Schedule Form:**
- Name and description
- Target properties/units
- Frequency (daily/weekly/monthly/quarterly/annually/custom)
- Work order template details
- Default assignee
- Active toggle

---

# 6. INVENTORY MANAGEMENT

## 6.1 Parts Inventory List

**Tabs:**
- All Items
- Low Stock (count)
- Out of Stock (count)
- Ordered (count)

**Search and Filters:**
- Search parts
- Category filter
- Location filter

**List Columns:**
- Item name and description
- SKU
- Category
- In Stock quantity
- Minimum level
- Location
- Unit cost
- Actions (Order/Edit/History)

**Status Indicators:**
- Warning for low stock
- Checkmark for adequate
- Red for out of stock

**Summary:**
- Total inventory value
- Items below minimum

## 6.2 Add/Edit Inventory Item

**Item Details:**
- Item name
- SKU/Part number
- Category
- Description

**Quantity & Location:**
- Current quantity
- Minimum stock level
- Storage location
- Unit of measure

**Cost & Supplier:**
- Unit cost
- Supplier selection
- Supplier part number
- Reorder URL

**Alerts:**
- Alert on low stock checkbox
- Alert on out of stock checkbox
- Auto-reorder option (coming soon)

## 6.3 Order Parts Form

**Reorder Suggestions:**
- Items below minimum
- Suggested quantities
- Costs
- Add all suggestions option

**Order Items:**
- Item list with quantities
- Unit and total costs
- Remove option
- Add custom item option
- Subtotal, tax, total

**Order Details:**
- Supplier selection
- Order method (in-store/online delivery/online pickup)
- Needed by date
- Requested by
- Notes

**Actions:**
- Save as Draft
- Submit Order Request

---

# 7. VENDOR & CONTRACTOR MANAGEMENT

## 7.1 Vendor List

**Tabs:**
- All Vendors
- Active (count)
- Pending (count)
- Inactive (count)

**Vendor Card:**
- Business name
- Rating (stars and count)
- Category
- Status
- Contact name and info
- License and insurance status
- Jobs completed
- Average response time
- YTD spend
- Last job date
- Actions (View/Assign/Message/Invoices)

## 7.2 Add Vendor Form

**Business Information:**
- Business name
- Service category
- Business type
- Services offered (checkboxes)

**Contact Information:**
- Primary contact name
- Phone
- Email
- Emergency phone
- Address

**Licensing & Insurance:**
- License number
- License state
- License expiration
- Insurance certificate upload
- Coverage amount
- Insurance expiration
- Workers comp checkbox

**Payment Information:**
- Payment terms
- Tax ID
- W-9 document upload

## 7.3 Vendor Invoices

**Tabs:**
- All
- Pending Review (count)
- Approved (count)
- Paid (count)
- Disputed (count)

**Filters:**
- Search
- Vendor
- Date Range

**Invoice Card:**
- Invoice number
- Vendor name
- Amount
- Work order reference
- Service date
- Submitted date
- Labor breakdown
- Parts breakdown
- Attachments
- Actions (View WO/Approve/Dispute/Comment)

**Summary:**
- Pending review total
- Approved total
- Total payable

**Actions:**
- Process Approved Payments
- Export to Accounting

---

# 8. DOCUMENTS & RESOURCES

## 8.1 Documents Library

**Folder Structure:**
- Property Manuals
  - Per-property folders
  - HVAC, water heater, appliance manuals
  - Access codes (locked)
  - Emergency shutoff locations
- Procedures
  - Emergency response protocol
  - Tenant entry procedures
  - After-hours call handling
  - Work order completion checklist
  - Vendor onboarding guide
  - Preventive maintenance schedules
- Safety
  - OSHA guidelines
  - Lockout/tagout procedures
  - PPE requirements
  - Hazardous materials handling
  - First aid procedures
  - Ladder safety
  - Electrical safety
- Forms
  - Various maintenance forms

**Actions:**
- Upload
- Create Folder

## 8.2 Quick Reference

**Emergency Shutoffs:**
- Per-property locations for water, gas, electric

**Emergency Contacts:**
- Gas, electric, water emergency lines
- Fire and police non-emergency

**Access Codes:**
- Restricted view (Manager only)
- Requires authentication

---

# 9. COMMUNICATION

## 9.1 Messages Inbox

**Tabs:**
- All
- Unread (count)
- Tenants
- Owners
- Team
- Vendors

**Conversation List:**
- Contact name with unread indicator
- Subject/preview
- Time

**Message Thread:**
- Contact info and context
- Message history
- Reply input
- Attachment options

## 9.2 Compose Message

**To Field:**
- Search contacts
- Quick select (All tenants at property/Team/Owner)

**Related Work Order:**
- Optional work order link

**Subject and Message:**
- Subject line
- Message body
- Attachments

**Options:**
- Send copy to owner
- Add to work order notes

**Template Selection:**
- Pre-built templates

## 9.3 Notification Templates

**Available Templates:**
- Arrival Notification
- Job Completed
- Reschedule Notice
- Parts on Order

**Template Variables:**
- tenant_name
- property_address
- work_order_title
- work_order_id
- technician_name
- arrival_time
- original_date
- new_date
- eta_date

---

# 10. REPORTS & ANALYTICS

## 10.1 Reports Dashboard

**Date Range Selector**

**Report Tabs:**
- Performance
- Costs
- Time Tracking
- Inventory
- Vendor

## 10.2 Performance Report

**Overview Stats:**
- Total Orders
- Completed
- Completion Rate
- Tenant Rating

**Response Time by Priority:**
- Bar chart showing actual vs target

**Work Orders by Category:**
- Horizontal bar chart with counts and percentages

## 10.3 Cost Analysis Report

**Cost Summary:**
- Total Spend
- Parts & Materials
- Vendor Services
- Labor (In-house)
- Trends vs previous period

**Cost by Property:**
- Bar chart with percentages

**Cost by Category:**
- Bar chart with percentages

**Top 5 Expensive Work Orders:**
- Table with WO#, description, property, cost

**Trend Chart:**
- Monthly maintenance costs over 6 months

## 10.4 Technician Performance Report

**Team Leaderboard:**
- Rank
- Name
- Jobs
- Avg Time
- First Fix Rate
- Rating
- Hours

**Individual Detail:**
- Stats cards
- Jobs by category breakdown
- Skills utilized
- Time breakdown (on-site/travel/admin)
- Recent tenant feedback

## 10.5 Property Maintenance Report

**Property Selector**
**Period Selector**

**Property Summary:**
- Address and details
- Total orders
- Total cost
- Average per month
- Average orders per unit

**Work Order History by Unit:**
- Unit
- Order count
- Cost
- Top issue
- Last service
- Warning flags for recurring issues

**Recurring Issues Identified:**
- Issue description
- Recommendation
- Estimated cost

---

# 11. PROFILE & SETTINGS

## 11.1 Profile View

**Photo and Header:**
- Profile photo
- Name and role
- Member since
- Rating

**Contact Information:**
- Email
- Work phone
- Personal phone
- Emergency contact

**Employment Details:**
- Role
- Organization
- Start date
- Employee ID
- Reports to

**Skills & Certifications:**
- Skills with proficiency levels
- Certifications with expiration dates
- Expiration warnings

**All-Time Stats:**
- Jobs completed
- First-fix rate
- Hours logged
- Rating

## 11.2 Settings

**Tabs:**
- Account
- Notifications
- Availability
- Privacy
- App

**Notifications Settings:**
- Work Orders (email/push/SMS toggles)
  - New assigned
  - Emergency
  - Updated
  - Canceled
- Schedule
  - Daily summary
  - Changes
  - Upcoming appointment
- Inventory
  - Low stock
  - Order status
- Messages
  - From tenant
  - From owner
  - From team
- Quiet Hours
  - Enable toggle
  - From/to times
  - Allow emergency option

**Availability Settings:**
- Default working hours per day
- On-call settings
  - Available for rotation
  - Rotation schedule
  - Next on-call dates
- Maximum daily jobs
- Maximum service radius

---

# 12. AI ASSISTANT INTEGRATION

## 12.1 AI Features

| Feature | Description |
|---------|-------------|
| Smart Triage | Analyzes requests to categorize priority and type |
| Parts Prediction | Suggests likely parts needed |
| Route Optimization | Calculates most efficient daily route |
| Time Estimation | Predicts job duration |
| Diagnostic Assistant | Provides troubleshooting steps |
| Report Generation | Creates summaries and identifies trends |

## 12.2 AI Chat Assistant

**Capabilities:**
- Diagnose issues based on symptoms
- Find parts and specifications
- Look up property information
- Generate reports
- Answer maintenance questions

**Context-Aware Responses:**
- Property-specific equipment info
- Installation dates and service history
- Common causes for issues
- Parts availability and location
- Service manual references

**Quick Actions:**
- View Manual
- Create Work Order
- Reserve Parts

## 12.3 Smart Work Order Triage

**Incoming Request Display:**
- From (tenant info)
- Property and unit
- Submission time
- Message content
- Attachments

**AI Analysis:**
- Confidence percentage
- Recommended priority with reason
- Category assignment
- Likely causes with confidence
- Recommended response time
- Suggested assignment
- Suggested parts
- Immediate tenant instructions

**Actions:**
- Accept AI recommendations
- Customize (priority/assignee)
- Option toggles (send instructions/reserve parts/notify owner)
- Create Work Order

---

# 13. MOBILE EXPERIENCE

## 13.1 Mobile App Features

**Dashboard:**
- Today's jobs
- Stats
- Alerts

**Work Orders:**
- View details
- Start/stop timer
- Log time
- Add parts
- Take photos

**Schedule:**
- Daily view
- Route map
- Navigation

**Camera:**
- Take photos
- Scan QR/barcode
- Before/after

**Inventory:**
- Check stock
- Use parts
- Request order

**Messages:**
- Chat/SMS
- Call tenant
- Templates

## 13.2 Offline Capabilities

- View assigned work orders
- Log time and notes (syncs when online)
- Take and store photos
- Access cached property documents
- View inventory levels

## 13.3 Mobile Navigation

**Bottom Navigation:**
- Home (Dashboard)
- Orders (Work order list)
- Schedule (Calendar/route)
- Messages (Inbox)
- Me (Profile/settings)

## 13.4 Mobile-Specific Features

- One-tap navigation to property
- Route optimization with turn-by-turn
- Offline maps for properties
- GPS-based automatic clock-in
- Camera integration for photos
- Barcode scanning for parts

---

# 14. API ENDPOINTS

## 14.1 Work Orders API

```
BASE URL: https://api.nomerlo.com/v1/maintenance

GET    /work-orders                    List all work orders
GET    /work-orders/:id                Get work order details
POST   /work-orders                    Create new work order
PUT    /work-orders/:id                Update work order
DELETE /work-orders/:id                Delete work order

GET    /work-orders/:id/activity       Get activity log
POST   /work-orders/:id/notes          Add note
POST   /work-orders/:id/photos         Upload photo
POST   /work-orders/:id/parts          Add parts

POST   /work-orders/:id/assign         Assign work order
POST   /work-orders/:id/start          Start timer
POST   /work-orders/:id/pause          Pause timer
POST   /work-orders/:id/complete       Complete work order

Query Parameters:
- status: new|assigned|in_progress|on_hold|completed|closed
- priority: emergency|high|normal|low|scheduled
- category: plumbing|electrical|hvac|appliance|general|exterior|pest|safety
- property_id, assignee_id, date_from, date_to, page, limit
```

## 14.2 Schedule API

```
GET    /schedule                       Get calendar view
GET    /schedule/today                 Get today's schedule
GET    /schedule/availability          Get team availability
PUT    /schedule/availability          Update availability

POST   /schedule/events                Create event
PUT    /schedule/events/:id            Update event
DELETE /schedule/events/:id            Delete event

GET    /schedule/route                 Get optimized route
POST   /schedule/route/optimize        Generate optimized route

GET    /pm-schedules                   List PM schedules
POST   /pm-schedules                   Create PM schedule
PUT    /pm-schedules/:id               Update PM schedule
DELETE /pm-schedules/:id               Delete PM schedule
POST   /pm-schedules/:id/generate      Generate work orders
```

## 14.3 Inventory API

```
GET    /inventory                      List inventory items
GET    /inventory/:id                  Get item details
POST   /inventory                      Add item
PUT    /inventory/:id                  Update item
DELETE /inventory/:id                  Delete item

GET    /inventory/low-stock            Get low stock items
GET    /inventory/:id/history          Get usage history
POST   /inventory/:id/adjust           Adjust quantity

GET    /inventory/orders               List orders
POST   /inventory/orders               Create order
PUT    /inventory/orders/:id           Update order
```

## 14.4 Vendors API

```
GET    /vendors                        List vendors
GET    /vendors/:id                    Get vendor details
POST   /vendors                        Add vendor
PUT    /vendors/:id                    Update vendor
DELETE /vendors/:id                    Delete vendor

GET    /vendors/:id/jobs               Get vendor jobs
GET    /vendors/:id/invoices           Get vendor invoices
GET    /vendors/:id/performance        Get performance metrics

GET    /invoices                       List invoices
GET    /invoices/:id                   Get invoice details
POST   /invoices                       Submit invoice (vendor)
PUT    /invoices/:id/approve           Approve invoice
PUT    /invoices/:id/dispute           Dispute invoice
PUT    /invoices/:id/pay               Mark paid
```

## 14.5 Reports API

```
GET    /reports/performance            Performance report
GET    /reports/costs                  Cost analysis
GET    /reports/time-tracking          Time tracking
GET    /reports/inventory              Inventory report
GET    /reports/property/:id           Property report
GET    /reports/technician/:id         Technician report
GET    /reports/vendor/:id             Vendor report

Query: date_from, date_to, property_id, format (json|pdf|csv)
```

## 14.6 AI Assistant API

```
POST   /ai/triage                      AI triage analysis
POST   /ai/diagnose                    Diagnostic suggestions
POST   /ai/chat                        Chat with assistant
GET    /ai/parts-suggestion/:wo_id     Suggested parts
GET    /ai/time-estimate/:wo_id        Time estimate
POST   /ai/report-summary              Generate summary
```

---

# 15. DATA MODELS

## 15.1 Work Order

```typescript
interface WorkOrder {
  id: string;
  order_number: string;
  organization_id: string;
  property_id: string;
  unit_id?: string;
  
  title: string;
  description: string;
  category: WorkOrderCategory;
  subcategory?: string;
  location?: string;
  
  priority: Priority;
  status: WorkOrderStatus;
  
  requester_type: 'tenant' | 'owner' | 'staff' | 'system';
  requester_id?: string;
  assigned_to_type?: 'staff' | 'vendor';
  assigned_to_id?: string;
  
  scheduled_date?: Date;
  scheduled_time_start?: string;
  scheduled_time_end?: string;
  estimated_duration_minutes?: number;
  
  started_at?: Date;
  completed_at?: Date;
  closed_at?: Date;
  resolution_type?: ResolutionType;
  resolution_notes?: string;
  
  labor_cost?: number;
  parts_cost?: number;
  vendor_cost?: number;
  total_cost?: number;
  
  entry_permission: boolean;
  entry_instructions?: string;
  
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

enum WorkOrderCategory {
  PLUMBING, ELECTRICAL, HVAC, APPLIANCE, 
  GENERAL, EXTERIOR, PEST, SAFETY
}

enum Priority {
  EMERGENCY, HIGH, NORMAL, LOW, SCHEDULED
}

enum WorkOrderStatus {
  NEW, ASSIGNED, IN_PROGRESS, ON_HOLD,
  REVIEW_PENDING, COMPLETED, CLOSED, CANCELED
}

enum ResolutionType {
  FULLY_RESOLVED, PARTIALLY_RESOLVED,
  UNABLE_TO_RESOLVE, TENANT_CANCELED, DUPLICATE
}
```

## 15.2 Time Entry

```typescript
interface TimeEntry {
  id: string;
  work_order_id: string;
  user_id: string;
  
  entry_type: 'work' | 'travel' | 'break' | 'admin';
  started_at: Date;
  ended_at?: Date;
  duration_minutes?: number;
  notes?: string;
  
  created_at: Date;
  updated_at: Date;
}
```

## 15.3 Parts Usage

```typescript
interface PartsUsage {
  id: string;
  work_order_id: string;
  inventory_item_id: string;
  
  quantity: number;
  unit_cost: number;
  total_cost: number;
  
  added_by: string;
  added_at: Date;
}
```

## 15.4 Inventory Item

```typescript
interface InventoryItem {
  id: string;
  organization_id: string;
  
  name: string;
  sku: string;
  description?: string;
  category: string;
  
  quantity_on_hand: number;
  minimum_stock_level: number;
  unit_of_measure: string;
  unit_cost: number;
  
  storage_location?: string;
  supplier_id?: string;
  supplier_part_number?: string;
  reorder_url?: string;
  
  alert_on_low_stock: boolean;
  alert_on_out_of_stock: boolean;
  
  created_at: Date;
  updated_at: Date;
}
```

## 15.5 Vendor

```typescript
interface Vendor {
  id: string;
  organization_id: string;
  
  business_name: string;
  business_type: string;
  service_category: string;
  services_offered: string[];
  
  primary_contact_name: string;
  phone: string;
  emergency_phone?: string;
  email: string;
  address?: string;
  
  license_number: string;
  license_state: string;
  license_expiration: Date;
  
  insurance_certificate_url?: string;
  insurance_coverage_amount: number;
  insurance_expiration: Date;
  has_workers_comp: boolean;
  
  payment_terms: string;
  tax_id?: string;
  w9_document_url?: string;
  
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  
  total_jobs: number;
  average_rating: number;
  average_response_hours: number;
  
  created_at: Date;
  updated_at: Date;
}
```

## 15.6 Vendor Invoice

```typescript
interface VendorInvoice {
  id: string;
  organization_id: string;
  vendor_id: string;
  work_order_id: string;
  invoice_number: string;
  
  service_date: Date;
  submitted_at: Date;
  
  labor_hours?: number;
  labor_rate?: number;
  labor_total?: number;
  parts_total?: number;
  other_charges?: number;
  
  subtotal: number;
  tax?: number;
  total: number;
  
  status: 'pending' | 'approved' | 'disputed' | 'paid';
  
  invoice_document_url?: string;
  receipts_urls?: string[];
  
  approved_at?: Date;
  approved_by?: string;
  paid_at?: Date;
  
  dispute_reason?: string;
  notes?: string;
  
  created_at: Date;
  updated_at: Date;
}
```

## 15.7 Maintenance Staff

```typescript
interface MaintenanceStaff {
  id: string;
  user_id: string;
  organization_id: string;
  
  role: 'manager' | 'technician' | 'helper';
  employee_id?: string;
  
  skills: Skill[];
  certifications: Certification[];
  
  default_schedule: WeeklySchedule;
  is_on_call_eligible: boolean;
  on_call_rotation?: string;
  max_daily_jobs?: number;
  service_radius_miles?: number;
  
  total_jobs_completed: number;
  average_rating: number;
  first_time_fix_rate: number;
  total_hours_logged: number;
  
  phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  status: 'active' | 'on_leave' | 'inactive';
  
  created_at: Date;
  updated_at: Date;
}

interface Skill {
  category: string;
  level: 'basic' | 'skilled' | 'advanced' | 'expert';
}

interface Certification {
  name: string;
  issuing_body?: string;
  license_number?: string;
  issued_date?: Date;
  expiration_date?: Date;
  document_url?: string;
}
```

## 15.8 PM Schedule

```typescript
interface PMSchedule {
  id: string;
  organization_id: string;
  
  name: string;
  description?: string;
  
  property_ids: string[];
  unit_ids?: string[];
  equipment_type?: string;
  
  frequency_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'custom';
  frequency_interval?: number;
  frequency_days?: number[];
  
  work_order_template: {
    title: string;
    description: string;
    category: WorkOrderCategory;
    priority: Priority;
    estimated_duration_minutes: number;
    parts_needed?: string[];
    checklist?: string[];
  };
  
  default_assignee_type?: 'staff' | 'vendor';
  default_assignee_id?: string;
  
  is_active: boolean;
  last_generated_at?: Date;
  next_due_date?: Date;
  
  created_at: Date;
  updated_at: Date;
}
```

---

# APPENDIX A: MOBILE BOTTOM NAVIGATION

| Icon | Label | Destination |
|------|-------|-------------|
| Home | Home | Dashboard, today's overview |
| Orders | Orders | Work order list, create, filters |
| Calendar | Schedule | Calendar view, route planner |
| Chat | Messages | Inbox, compose, templates |
| User | Me | Profile, settings, help |

---

# APPENDIX B: NOTIFICATION TYPES

| Type | Channel | Description |
|------|---------|-------------|
| Emergency Work Order | Push + SMS | New emergency assigned |
| New Work Order | Push | New work order assigned |
| Schedule Change | Push | Job rescheduled |
| Message from Tenant | Push | Tenant message |
| Message from Owner | Push | Owner message |
| Parts Order Ready | Push | Parts arrived |
| Low Stock Alert | Email | Below minimum |
| Daily Schedule | Email | Morning summary |
| Weekly Report | Email | Performance summary |
| Invoice Approved | Email | Vendor invoice approved |
| Certification Expiring | Email | 30-day warning |

---

# APPENDIX C: KEYBOARD SHORTCUTS (Web)

| Shortcut | Action |
|----------|--------|
| N | Create new work order |
| S | Open search |
| D | Go to dashboard |
| W | Go to work orders |
| C | Go to calendar |
| I | Go to inventory |
| M | Go to messages |
| ? | Show shortcuts |
| Esc | Close modal |
| Ctrl+Enter | Submit form |

---

**END OF DOCUMENT**

*Version 1.0 - January 2026*
*Nomerlo Maintenance Portal Complete Documentation*

---

# APPENDIX D: DETAILED WIREFRAMES

## D.1 Manager Dashboard Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ☰  NOMERLO MAINTENANCE                            🔔 3  👤 Mike (Manager)  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Good morning, Mike!                            Tuesday, January 27, 2026   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  TODAY'S OVERVIEW                                                   │   │
│  │  ━━━━━━━━━━━━━━━━                                                   │   │
│  │                                                                     │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │   │
│  │  │    12     │ │     3     │ │     2     │ │     7     │           │   │
│  │  │   Open    │ │ Emergency │ │ Scheduled │ │ Completed │           │   │
│  │  │   Orders  │ │  Priority │ │   Today   │ │ This Week │           │   │
│  │  │    ↑2     │ │    ↑1     │ │           │ │    ↓3     │           │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────┬──────────────────────────────────┐   │
│  │  🚨 EMERGENCY ORDERS             │  👥 TEAM STATUS                  │   │
│  │  ━━━━━━━━━━━━━━━━━━              │  ━━━━━━━━━━━━━                   │   │
│  │                                  │                                  │   │
│  │  ┌────────────────────────────┐  │  Mike Johnson (You)              │   │
│  │  │ 🔴 #WO-2847                │  │  ● Available    2 jobs today     │   │
│  │  │ Water Heater - No hot water│  │                                  │   │
│  │  │ Sunset Apts, Unit 3B       │  │  Sarah Chen                      │   │
│  │  │ ⏱️ Created 45 min ago      │  │  ● On Job      Unit 6A           │   │
│  │  │ [Assign] [View Details]    │  │                                  │   │
│  │  └────────────────────────────┘  │  Tom Wilson                      │   │
│  │                                  │  ● En Route    Oak House         │   │
│  │  ┌────────────────────────────┐  │                                  │   │
│  │  │ 🔴 #WO-2849                │  │  ──────────────────              │   │
│  │  │ Electrical - Outlet sparking│  │                                  │   │
│  │  │ Palm Gardens, Unit 2A      │  │  ProFix HVAC (Vendor)            │   │
│  │  │ ⏱️ Created 30 min ago      │  │  ● Scheduled   10:30 AM          │   │
│  │  │ [Assign] [View Details]    │  │                                  │   │
│  │  └────────────────────────────┘  │  [View All Team]                 │   │
│  │                                  │                                  │   │
│  └──────────────────────────────────┴──────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────┬──────────────────────────────────┐   │
│  │  📅 TODAY'S SCHEDULE             │  ⚠️ ALERTS                       │   │
│  │  ━━━━━━━━━━━━━━━━━               │  ━━━━━━━━                        │   │
│  │                                  │                                  │   │
│  │  8:00   🔴 Water Heater          │  📦 LOW INVENTORY                │   │
│  │         Sunset Apts 3B           │  • Toilet flappers (2 left)      │   │
│  │         Est: 2 hrs | Assigned: - │  • 60W bulbs (5 left)            │   │
│  │                                  │  • Faucet washers (3 left)       │   │
│  │  10:30  🟡 HVAC Service          │  [Order Supplies]                │   │
│  │         Palm Gardens 6A          │                                  │   │
│  │         Est: 1.5 hrs | ProFix    │  📄 PENDING APPROVALS            │   │
│  │                                  │  • Vendor invoice #INV-445       │   │
│  │  1:00   🟢 Faucet Repair         │    $450.00 - HVAC repair         │   │
│  │         Sunset Apts 4A           │  [Review]                        │   │
│  │         Est: 45 min | Tom        │                                  │   │
│  │                                  │  📋 INSPECTIONS DUE              │   │
│  │  [View Full Schedule]            │  • Sunset Apts - Fire ext.       │   │
│  │                                  │    Due in 5 days                 │   │
│  └──────────────────────────────────┴──────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  📊 WEEKLY PERFORMANCE                                              │   │
│  │  ━━━━━━━━━━━━━━━━━━━━                                               │   │
│  │                                                                     │   │
│  │  Completion Rate          Response Time         Tenant Satisfaction │   │
│  │  ┌─────────────────┐     ┌─────────────────┐   ┌─────────────────┐ │   │
│  │  │      94%        │     │    4.2 hrs      │   │     4.7/5       │ │   │
│  │  │  ████████████░░ │     │   ↓ 0.8 hrs    │   │    ★★★★★       │ │   │
│  │  │   ↑3% vs last   │     │   vs last week  │   │    ↑0.2        │ │   │
│  │  └─────────────────┘     └─────────────────┘   └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## D.2 Work Orders List Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WORK ORDERS                                         [+ Create Work Order]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [All] [Emergency 3] [Open 12] [In Progress 5] [On Hold 2]          │   │
│  │  [Scheduled 8] [Completed] [Closed]                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🔍 Search work orders...                                           │   │
│  │                                                                     │   │
│  │  Filters: [Property ▼] [Category ▼] [Assignee ▼] [Date Range ▼]    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ☐  │ #WO-2851     │ Plumbing      │ Pipe burst         │ 🔴 EMER  │   │
│  │     │ 123 Main St  │ Tom Wilson    │ 45 min ago         │ NEW      │   │
│  │     └──────────────────────────────────────────────────────────────│   │
│  │                                                                     │   │
│  │  ☐  │ #WO-2850     │ Electrical    │ Outlet sparking    │ 🔴 EMER  │   │
│  │     │ Palm Gardens │ Unassigned    │ 1 hour ago         │ NEW      │   │
│  │     └──────────────────────────────────────────────────────────────│   │
│  │                                                                     │   │
│  │  ☐  │ #WO-2849     │ HVAC          │ Water heater       │ 🔴 EMER  │   │
│  │     │ Sunset 3B    │ Unassigned    │ 1.5 hours ago      │ NEW      │   │
│  │     └──────────────────────────────────────────────────────────────│   │
│  │                                                                     │   │
│  │  ☐  │ #WO-2848     │ Appliance     │ Fridge not cooling │ 🟡 HIGH  │   │
│  │     │ Sunset 5C    │ Tom Wilson    │ Yesterday          │ ASSIGNED │   │
│  │     └──────────────────────────────────────────────────────────────│   │
│  │                                                                     │   │
│  │  ☐  │ #WO-2846     │ HVAC          │ AC not cooling     │ 🟡 HIGH  │   │
│  │     │ Palm 6A      │ ProFix HVAC   │ 2 days ago         │ SCHEDULED│   │
│  │     └──────────────────────────────────────────────────────────────│   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Showing 1-5 of 22 work orders                         [← Prev] [Next →]   │
│                                                                             │
│  Bulk Actions: [Assign Selected ▼] [Change Priority ▼] [Export]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## D.3 Work Order Detail Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Work Orders                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  WORK ORDER #WO-2851                                                        │
│  ━━━━━━━━━━━━━━━━━━━━                                                        │
│                                                                             │
│  ┌──────────────────────────────────┬──────────────────────────────────┐   │
│  │  Plumbing - Pipe burst           │  Status: 🔴 EMERGENCY            │   │
│  └──────────────────────────────────┴──────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Overview] [Activity] [Time & Parts] [Photos] [Communication]      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────┬──────────────────────────────────┐   │
│  │  DETAILS                         │  ASSIGNMENT                      │   │
│  │  ━━━━━━━━                        │  ━━━━━━━━━━                       │   │
│  │                                  │                                  │   │
│  │  Property:                       │  Assigned To:                    │   │
│  │  123 Main Street                 │  ┌────────────────────────────┐ │   │
│  │  Austin, TX 78701                │  │ Tom Wilson            ▼   │ │   │
│  │                                  │  └────────────────────────────┘ │   │
│  │  Location: Basement              │                                  │   │
│  │                                  │  Scheduled:                      │   │
│  │  Owner:                          │  ┌────────────────────────────┐ │   │
│  │  John Smith                      │  │ Today, 8:00 AM        📅  │ │   │
│  │  📞 (512) 555-0123               │  └────────────────────────────┘ │   │
│  │                                  │                                  │   │
│  │  Tenant:                         │  Estimated Duration:             │   │
│  │  Maria Garcia                    │  ┌────────────────────────────┐ │   │
│  │  📞 (512) 555-0187               │  │ 2 hours               ▼   │ │   │
│  │                                  │  └────────────────────────────┘ │   │
│  │  Entry Permission:               │                                  │   │
│  │  ✓ Tenant allows entry when away │  [Reassign] [Reschedule]         │   │
│  └──────────────────────────────────┴──────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  DESCRIPTION                                                        │   │
│  │  ━━━━━━━━━━━━                                                       │   │
│  │                                                                     │   │
│  │  Tenant reported water leaking from the ceiling below the upstairs │   │
│  │  bathroom. The leak started this morning around 6 AM and is        │   │
│  │  getting worse. Water is pooling on the basement floor.            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SUGGESTED PARTS                        AI-Generated                │   │
│  │  ━━━━━━━━━━━━━━━━                                                   │   │
│  │                                                                     │   │
│  │  ☑️ PVC pipe fittings (1/2" and 3/4")     In Stock: 12              │   │
│  │  ☑️ PVC cement and primer                 In Stock: 3               │   │
│  │  ☑️ Pipe repair clamp                     In Stock: 5               │   │
│  │                                                                     │   │
│  │  [Reserve Selected Parts]                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │  [📍 Navigate]  [📞 Call Tenant]  [💬 Message]  [▶️ Start Job]   │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## D.4 In-Progress Work Order Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WORK ORDER #WO-2851 - IN PROGRESS                              ⏱️ 01:23:45│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🔴 Pipe burst                                                      │   │
│  │  123 Main Street, Basement                                          │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │                     TIMER RUNNING                             │ │   │
│  │  │                       01:23:45                                │ │   │
│  │  │                                                               │ │   │
│  │  │  [⏸️ Pause]   [☕ Break]   [⏹️ Complete Job]                   │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────┬──────────────────────────────────┐   │
│  │  📝 WORK LOG                     │  📦 PARTS USED                   │   │
│  │  ━━━━━━━━━━                      │  ━━━━━━━━━━━                      │   │
│  │                                  │                                  │   │
│  │  + Add log entry                 │  + Add parts                     │   │
│  │                                  │                                  │   │
│  │  ┌────────────────────────────┐  │  ┌────────────────────────────┐ │   │
│  │  │ 8:15 AM                    │  │  │ PVC Pipe 1/2" (2 ft)       │ │   │
│  │  │ Arrived at property, met   │  │  │ Qty: 1    Cost: $4.50      │ │   │
│  │  │ tenant Maria.              │  │  │                   [Remove] │ │   │
│  │  └────────────────────────────┘  │  └────────────────────────────┘ │   │
│  │                                  │                                  │   │
│  │  ┌────────────────────────────┐  │  ┌────────────────────────────┐ │   │
│  │  │ 8:25 AM                    │  │  │ PVC Cement                 │ │   │
│  │  │ Located leak - cracked     │  │  │ Qty: 1    Cost: $8.00      │ │   │
│  │  │ pipe at elbow joint.       │  │  │                   [Remove] │ │   │
│  │  └────────────────────────────┘  │  └────────────────────────────┘ │   │
│  │                                  │                                  │   │
│  │                                  │  Total Parts: $15.50             │   │
│  └──────────────────────────────────┴──────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  📸 PHOTOS                                              [+ Add Photo]│   │
│  │  ━━━━━━━━                                                           │   │
│  │                                                                     │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                │   │
│  │  │         │  │         │  │         │  │         │                │   │
│  │  │ Before  │  │ Damage  │  │ Repair  │  │  +      │                │   │
│  │  │         │  │         │  │ in prog │  │         │                │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [📞 Call Tenant]  [💬 Message Owner]  [🆘 Request Help]           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## D.5 Inventory List Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  INVENTORY                                    [+ Add Item]  [📥 Import CSV] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [All Items] [Low Stock ⚠️ 5] [Out of Stock 1] [Ordered 3]          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🔍 Search parts...     Category: [All ▼]    Location: [All ▼]      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ITEM                   CATEGORY      IN STOCK   MIN   LOCATION     │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │   │
│  │                                                                     │   │
│  │  ⚠️ Toilet Flappers     Plumbing         2       10    Shelf A-1    │   │
│  │     Universal 2"                                                    │   │
│  │     SKU: PLM-001        Cost: $3.50     [Order] [Edit] [History]   │   │
│  │                                                                     │   │
│  │  ⚠️ 60W LED Bulbs       Electrical       5       15    Shelf B-2    │   │
│  │     Daylight                                                        │   │
│  │     SKU: ELC-015        Cost: $4.00     [Order] [Edit] [History]   │   │
│  │                                                                     │   │
│  │  ✓ PVC Pipe 1/2"        Plumbing        12        5    Shelf A-3    │   │
│  │     10ft lengths                                                    │   │
│  │     SKU: PLM-020        Cost: $4.50     [Order] [Edit] [History]   │   │
│  │                                                                     │   │
│  │  ✓ HVAC Filters 20x25   HVAC           30       20    Storage Rm   │   │
│  │     MERV 11                                                         │   │
│  │     SKU: HVC-050        Cost: $15.00    [Order] [Edit] [History]   │   │
│  │                                                                     │   │
│  │  🔴 Garbage Disposal    Appliances       0        2    Storage Rm   │   │
│  │     1/2 HP                                                          │   │
│  │     SKU: APP-010        Cost: $125.00   [Order] [Edit] [History]   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  INVENTORY VALUE: $4,523.50        ITEMS BELOW MIN: 5               │   │
│  │  [Generate Reorder Report]         [Export Inventory]               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## D.6 Vendor List Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VENDORS                                                      [+ Add Vendor]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [All Vendors] [Active 12] [Pending 2] [Inactive 3]                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │  🏢 ProFix HVAC Services                          ★ 4.9 (23)  │ │   │
│  │  │  ────────────────────────────────────────────────────────────  │ │   │
│  │  │  Category: HVAC                    Status: ✓ Active            │ │   │
│  │  │  Contact: John Martinez            License: HVAC-12345-TX      │ │   │
│  │  │  📞 (512) 555-0150                 Insurance: Valid to 12/2026 │ │   │
│  │  │                                                               │ │   │
│  │  │  Jobs Completed: 23    |    Avg Response: 2.5 hrs              │ │   │
│  │  │  YTD Spend: $8,450     |    Last Job: Jan 25, 2026             │ │   │
│  │  │                                                               │ │   │
│  │  │  [View Profile]  [Assign Job]  [Message]  [View Invoices]     │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │  🏢 Sparks Electric Co.                           ★ 4.7 (15)  │ │   │
│  │  │  ────────────────────────────────────────────────────────────  │ │   │
│  │  │  Category: Electrical              Status: ✓ Active            │ │   │
│  │  │  Contact: Sarah Sparks             License: ELE-67890-TX       │ │   │
│  │  │  📞 (512) 555-0175                 Insurance: Valid to 06/2026 │ │   │
│  │  │                                                               │ │   │
│  │  │  Jobs Completed: 15    |    Avg Response: 3.2 hrs              │ │   │
│  │  │  YTD Spend: $3,200     |    Last Job: Jan 20, 2026             │ │   │
│  │  │                                                               │ │   │
│  │  │  [View Profile]  [Assign Job]  [Message]  [View Invoices]     │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## D.7 Performance Report Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  REPORTS                                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Date Range: [ January 2026 ▼ ]              [Generate Report]       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Performance] [Costs] [Time Tracking] [Inventory] [Vendor]         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  PERFORMANCE OVERVIEW - January 2026                                │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                 │   │
│  │                                                                     │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │   │
│  │  │    45     │ │    42     │ │   93%     │ │   4.7/5   │           │   │
│  │  │  Total    │ │ Completed │ │Completion │ │  Tenant   │           │   │
│  │  │  Orders   │ │           │ │   Rate    │ │  Rating   │           │   │
│  │  │   ↑12%    │ │   ↑15%    │ │   ↑3%     │ │   ↑0.2    │           │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │   │
│  │                                                                     │   │
│  │  RESPONSE TIME BY PRIORITY                                          │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  Emergency   ████████░░░░░░░░░░░░░░░░░░░░  2.1 hrs (Target: 4)│   │   │
│  │  │  High        ██████████████░░░░░░░░░░░░░░  8.5 hrs (Target: 24)│   │   │
│  │  │  Normal      ████████████████████░░░░░░░░  28 hrs (Target: 72) │   │   │
│  │  │  Low         ██████████████████████████░░  4.2 days (Target: 7)│   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  WORK ORDERS BY CATEGORY                                            │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  Plumbing      ████████████████████░░░░░░░░░░  18 (40%)      │   │   │
│  │  │  Electrical    ██████████░░░░░░░░░░░░░░░░░░░░   9 (20%)      │   │   │
│  │  │  HVAC          ████████░░░░░░░░░░░░░░░░░░░░░░   7 (16%)      │   │   │
│  │  │  Appliances    ██████░░░░░░░░░░░░░░░░░░░░░░░░   5 (11%)      │   │   │
│  │  │  General       ██████░░░░░░░░░░░░░░░░░░░░░░░░   6 (13%)      │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [Download PDF]  [Export CSV]  [Schedule Report]  [Share]                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## D.8 Mobile Dashboard Wireframe

```
┌─────────────────────┐
│ ≡  NOMERLO    🔔 2  │
├─────────────────────┤
│                     │
│ Good morning, Tom!  │
│ Tue, Jan 27         │
│                     │
├─────────────────────┤
│ TODAY'S JOBS        │
│ ┌─────────────────┐ │
│ │  5 Jobs         │ │
│ │  1 Emergency    │ │
│ │  4.5 hrs est.   │ │
│ └─────────────────┘ │
│                     │
├─────────────────────┤
│ NEXT UP             │
│ ┌─────────────────┐ │
│ │ 🔴 8:00 AM      │ │
│ │ Pipe burst      │ │
│ │ 123 Main St     │ │
│ │                 │ │
│ │ [Navigate]      │ │
│ │ [Start Job]     │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ 🟡 10:30 AM     │ │
│ │ Fridge repair   │ │
│ │ Sunset Apts 5C  │ │
│ └─────────────────┘ │
│                     │
│ +3 more jobs        │
│                     │
├─────────────────────┤
│ 🏠  📋  📅  💬  👤  │
│Home Orders Cal Msg Me│
└─────────────────────┘
```

## D.9 AI Chat Assistant Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AI MAINTENANCE ASSISTANT                                            ✕     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🤖 Hi Mike! I'm your maintenance assistant. I can help with:       │   │
│  │                                                                     │   │
│  │  • Diagnosing issues based on symptoms                              │   │
│  │  • Finding parts and specifications                                 │   │
│  │  • Looking up property information                                  │   │
│  │  • Generating reports                                               │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  👤 The tenant at Sunset 3B says their water heater isn't          │   │
│  │     producing hot water. What should I check first?                 │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  🤖 For a water heater not producing hot water at Sunset 3B:        │   │
│  │                                                                     │   │
│  │     📋 INITIAL CHECKS:                                              │   │
│  │     1. Check if pilot light is lit (gas) or breaker (electric)     │   │
│  │     2. Verify thermostat setting (should be 120-140°F)              │   │
│  │     3. Check for error codes on display                             │   │
│  │                                                                     │   │
│  │     📍 PROPERTY INFO:                                               │   │
│  │     • Unit 3B has a Rheem PROG50-38N (gas, 50 gal)                 │   │
│  │     • Installed: March 2022                                         │   │
│  │     • Last service: Nov 2025                                        │   │
│  │                                                                     │   │
│  │     📦 PARTS YOU MAY NEED:                                          │   │
│  │     • Thermocouple - In stock (Shelf A-5)                          │   │
│  │     • Gas valve - Need to order                                     │   │
│  │                                                                     │   │
│  │  Quick Actions:                                                     │   │
│  │  [📄 View Manual] [📋 Create Work Order] [📦 Reserve Parts]         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Type a message...                                          [Send]  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**END OF WIREFRAMES APPENDIX**
