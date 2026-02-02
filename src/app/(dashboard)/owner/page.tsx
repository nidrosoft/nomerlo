"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { parseDate } from "@internationalized/date";
import { 
    SearchLg, 
    Building07, 
    Users01, 
    CreditCard02, 
    Tool02, 
    ChevronDown,
    File06,
    PieChart03,
    MessageSquare01,
    ClipboardCheck,
    Zap,
} from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { MetricChangeIndicator, MetricsChart04 } from "@/components/application/metrics/metrics";
import { PaginationCardMinimal } from "@/components/application/pagination/pagination";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot, Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { ActionItemsWidget } from "@/components/dashboard/widgets/action-items-widget";
import { MaintenanceRequestsWidget } from "@/components/dashboard/widgets/maintenance-requests-widget";

// Helper functions for formatting
const formatCurrency = (amount: number): string => amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (timestamp: number): string =>
    new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

// Chart data for revenue
const revenueData = [
    { date: new Date(2025, 0, 2), A: 12500 },
    { date: new Date(2025, 0, 4), A: 13200 },
    { date: new Date(2025, 0, 6), A: 12800 },
    { date: new Date(2025, 0, 8), A: 14500 },
    { date: new Date(2025, 0, 10), A: 13900 },
    { date: new Date(2025, 0, 12), A: 15200 },
    { date: new Date(2025, 0, 14), A: 14800 },
    { date: new Date(2025, 0, 16), A: 15500 },
    { date: new Date(2025, 0, 18), A: 16200 },
    { date: new Date(2025, 0, 20), A: 15800 },
    { date: new Date(2025, 0, 22), A: 16800 },
    { date: new Date(2025, 0, 24), A: 17200 },
    { date: new Date(2025, 0, 26), A: 18100 },
    { date: new Date(2025, 0, 28), A: 17800 },
    { date: new Date(2025, 0, 30), A: 18500 },
];

// Recent activity data
const recentActivities = [
    {
        id: "#MNT-001",
        date: new Date(2025, 0, 16).getTime(),
        status: "open",
        type: "Maintenance",
        description: "HVAC repair needed",
        property: {
            name: "Sunset Apartments",
            unit: "Unit 2B",
            avatarUrl: undefined,
        },
    },
    {
        id: "#PAY-4521",
        date: new Date(2025, 0, 16).getTime(),
        status: "completed",
        type: "Payment",
        description: "Rent payment received",
        property: {
            name: "Oak Street Condos",
            unit: "Unit 5A",
        },
    },
    {
        id: "#APP-892",
        date: new Date(2025, 0, 15).getTime(),
        status: "pending",
        type: "Application",
        description: "New application submitted",
        property: {
            name: "Downtown Lofts",
            unit: "Unit 12",
        },
    },
    {
        id: "#LEA-234",
        date: new Date(2025, 0, 14).getTime(),
        status: "completed",
        type: "Lease",
        description: "Lease renewal signed",
        property: {
            name: "Sunset Apartments",
            unit: "Unit 4C",
        },
    },
    {
        id: "#MNT-002",
        date: new Date(2025, 0, 14).getTime(),
        status: "in_progress",
        type: "Maintenance",
        description: "Plumbing inspection",
        property: {
            name: "Oak Street Condos",
            unit: "Unit 3B",
        },
    },
];

const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
    }
    return name.charAt(0);
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "completed":
            return "success";
        case "open":
        case "pending":
            return "warning";
        case "in_progress":
            return "brand";
        default:
            return "gray";
    }
};

export default function OwnerDashboardPage() {
    const { user } = useUser();
    const [selectedTab, setSelectedTab] = useState<string>("custom");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "date",
        direction: "descending",
    });

    const sortedActivities = useMemo(() => {
        return recentActivities.toSorted((a, b) => {
            const first = a[sortDescriptor.column as keyof typeof a];
            const second = b[sortDescriptor.column as keyof typeof b];

            if (typeof first === "number" && typeof second === "number") {
                return sortDescriptor.direction === "ascending" ? first - second : second - first;
            }

            if (typeof first === "string" && typeof second === "string") {
                const result = first.localeCompare(second);
                return sortDescriptor.direction === "ascending" ? result : -result;
            }

            return 0;
        });
    }, [sortDescriptor]);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="flex flex-col gap-8">
            {/* Page header */}
            <div className="flex flex-col gap-5">
                <div className="relative flex flex-col gap-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-primary">
                                Welcome back, {user?.firstName || "there"}
                            </h1>
                            <p className="text-md text-tertiary">{formattedDate}</p>
                        </div>
                        <div className="flex gap-3">
                            <Input 
                                className="md:w-80" 
                                size="sm" 
                                shortcut 
                                aria-label="Search" 
                                placeholder="Search" 
                                icon={SearchLg} 
                            />
                            <Dropdown.Root>
                                <Button color="primary" size="md" iconLeading={Zap} iconTrailing={ChevronDown}>
                                    <span className="max-sm:hidden">Quick Actions</span>
                                </Button>
                                <Dropdown.Popover className="w-56">
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="/owner/properties/new" icon={Building07} label="Add Property" />
                                        <Dropdown.Item href="/owner/listings/new" icon={File06} label="Create Listing" />
                                        <Dropdown.Item href="/owner/tenants/invite" icon={Users01} label="Invite Tenant" />
                                        <Dropdown.Separator />
                                        <Dropdown.Item href="/owner/reports" icon={PieChart03} label="View Reports" />
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown.Root>
                        </div>
                    </div>
                </div>

                {/* Date filter tabs */}
                <div className="flex justify-between gap-6">
                    <Tabs className="w-auto" selectedKey={selectedTab} onSelectionChange={(value) => setSelectedTab(value as string)}>
                        <TabList
                            type="button-minimal"
                            items={[
                                { id: "custom", label: "Custom" },
                                {
                                    id: "12months",
                                    label: (
                                        <>
                                            <span className="max-md:hidden">12 months</span>
                                            <span className="md:hidden">12m</span>
                                        </>
                                    ),
                                },
                                {
                                    id: "30days",
                                    label: (
                                        <>
                                            <span className="max-md:hidden">30 days</span>
                                            <span className="md:hidden">30d</span>
                                        </>
                                    ),
                                },
                                {
                                    id: "7days",
                                    label: (
                                        <>
                                            <span className="max-md:hidden">7 days</span>
                                            <span className="md:hidden">7d</span>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </Tabs>

                    <div className="max-lg:hidden">
                        <DateRangePicker
                            defaultValue={{
                                start: parseDate("2025-01-01"),
                                end: parseDate("2025-01-30"),
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="flex flex-col gap-5 md:flex-row md:flex-wrap lg:gap-6">
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title="$18,500"
                    subtitle="Monthly Revenue"
                    icon={CreditCard02}
                    change="12.4%"
                    changeTrend="positive"
                    changeDescription="vs last month"
                    chartData={[
                        { value: 12500 },
                        { value: 13200 },
                        { value: 14500 },
                        { value: 15200 },
                        { value: 15800 },
                        { value: 16800 },
                        { value: 17200 },
                        { value: 18500 },
                    ]}
                />
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title="3"
                    subtitle="Properties"
                    icon={Building07}
                    change="+1"
                    changeTrend="positive"
                    changeDescription="this month"
                    chartData={[
                        { value: 2 },
                        { value: 2 },
                        { value: 2 },
                        { value: 2 },
                        { value: 2 },
                        { value: 3 },
                        { value: 3 },
                        { value: 3 },
                    ]}
                />
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title="10"
                    subtitle="Active Tenants"
                    icon={Users01}
                    change="+2"
                    changeTrend="positive"
                    changeDescription="new this month"
                    chartData={[
                        { value: 6 },
                        { value: 7 },
                        { value: 7 },
                        { value: 8 },
                        { value: 8 },
                        { value: 9 },
                        { value: 10 },
                        { value: 10 },
                    ]}
                />
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title="3"
                    subtitle="Open Requests"
                    icon={Tool02}
                    change="1 urgent"
                    changeTrend="negative"
                    changeDescription="needs attention"
                    chartData={[
                        { value: 5 },
                        { value: 4 },
                        { value: 4 },
                        { value: 3 },
                        { value: 2 },
                        { value: 3 },
                        { value: 3 },
                        { value: 3 },
                    ]}
                />
            </div>

            {/* Revenue chart */}
            <div className="flex flex-col gap-0.5 rounded-xl bg-secondary_subtle shadow-xs ring-1 ring-secondary ring-inset">
                <div className="flex gap-4 px-5 pt-3 pb-2">
                    <p className="text-sm font-semibold text-primary">Revenue</p>
                </div>
                <div className="flex flex-col gap-5 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    <div className="flex flex-col items-start gap-4 lg:flex-row">
                        <div className="flex flex-1 flex-col gap-3">
                            <p className="text-display-sm font-semibold text-primary">$18,500</p>
                            <div className="flex gap-2">
                                <MetricChangeIndicator value="12.4%" trend="positive" type="simple" />
                                <p className="text-sm font-medium text-tertiary">vs last 30 days</p>
                            </div>
                        </div>

                        <Tabs defaultSelectedKey="30days" className="w-auto">
                            <TabList
                                type="button-minimal"
                                items={[
                                    {
                                        id: "12months",
                                        label: (
                                            <>
                                                <span className="max-md:hidden">12 months</span>
                                                <span className="md:hidden">12m</span>
                                            </>
                                        ),
                                    },
                                    {
                                        id: "30days",
                                        label: (
                                            <>
                                                <span className="max-md:hidden">30 days</span>
                                                <span className="md:hidden">30d</span>
                                            </>
                                        ),
                                    },
                                    {
                                        id: "7days",
                                        label: (
                                            <>
                                                <span className="max-md:hidden">7 days</span>
                                                <span className="md:hidden">7d</span>
                                            </>
                                        ),
                                    },
                                ]}
                            />
                        </Tabs>
                    </div>

                    <div className="flex h-54 flex-col gap-1.5 lg:h-60">
                        <ResponsiveContainer className="h-full">
                            <AreaChart data={revenueData} className="text-tertiary [&_.recharts-text]:text-xs">
                                <defs>
                                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="currentColor" className="text-utility-gray-500" stopOpacity="0.8" />
                                        <stop offset="80%" stopColor="currentColor" className="text-utility-gray-500" stopOpacity="0" />
                                    </linearGradient>

                                    <pattern id="verticalLines" width="8" height="100%" fill="url(#gradient)" patternUnits="userSpaceOnUse">
                                        <line
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="100%"
                                            stroke="currentColor"
                                            className="text-utility-gray-200"
                                            strokeWidth="1.5"
                                        />
                                    </pattern>
                                </defs>

                                <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />

                                <XAxis hide dataKey="date" />

                                <RechartsTooltip
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleString(undefined, {
                                            month: "short",
                                            day: "2-digit",
                                            year: "numeric",
                                        })
                                    }
                                    content={<ChartTooltipContent />}
                                    cursor={{
                                        className: "stroke-utility-brand-600 stroke-2",
                                    }}
                                />

                                <Area
                                    isAnimationActive={false}
                                    className="text-utility-brand-600 [&_.recharts-area-area]:translate-y-[6px] [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]"
                                    dataKey="A"
                                    type="linear"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    fill="url(#verticalLines)"
                                    fillOpacity={1}
                                    activeDot={{
                                        className: "fill-bg-primary stroke-utility-brand-600 stroke-2",
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                        <ul className="mt-auto flex justify-between px-2 lg:px-6">
                            <li className="text-xs text-tertiary">Jan 2</li>
                            <li className="hidden text-xs text-tertiary md:block">Jan 6</li>
                            <li className="text-xs text-tertiary">Jan 10</li>
                            <li className="hidden text-xs text-tertiary md:block">Jan 14</li>
                            <li className="text-xs text-tertiary">Jan 18</li>
                            <li className="hidden text-xs text-tertiary md:block">Jan 22</li>
                            <li className="text-xs text-tertiary">Jan 26</li>
                            <li className="hidden text-xs text-tertiary md:block">Jan 30</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Rent Collection & Action Items - 2 column layout */}
            <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
                {/* Rent Collection Widget */}
                <div className="flex flex-col rounded-xl border border-secondary bg-primary shadow-xs">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-secondary px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                                <CreditCard02 className="size-4 text-white" />
                            </div>
                            <span className="text-base font-medium text-primary">Rent Collection</span>
                        </div>
                        <span className="text-sm text-tertiary">January 2026</span>
                    </div>
                    <div className="flex flex-col gap-4 p-5">
                        {/* Progress bar */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-display-xs font-semibold text-primary">$15,250</span>
                                <span className="text-sm text-tertiary">of $17,950</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                <div className="h-full rounded-full bg-brand-solid" style={{ width: "85%" }} />
                            </div>
                            <span className="text-sm font-medium text-brand-primary">85% collected</span>
                        </div>

                        {/* Status breakdown - Circle visualization */}
                        <div className="flex items-center gap-4">
                            {/* Overlapping circles */}
                            <div className="relative h-[160px] w-[190px] shrink-0">
                                {/* Paid - Largest circle (bottom layer) */}
                                <div className="absolute left-0 top-0 flex size-[115px] flex-col items-center justify-center rounded-full bg-success-solid text-white">
                                    <span className="text-xs font-medium opacity-90">Paid</span>
                                    <span className="text-xl font-bold">83%</span>
                                </div>
                                {/* Pending - Medium circle */}
                                <div className="absolute left-[80px] top-[75px] flex size-[80px] flex-col items-center justify-center rounded-full bg-brand-solid text-white">
                                    <span className="text-[10px] font-medium opacity-90">Pending</span>
                                    <span className="text-base font-bold">8%</span>
                                </div>
                                {/* Late - Small circle */}
                                <div className="absolute left-[100px] top-[5px] flex size-[62px] flex-col items-center justify-center rounded-full bg-warning-solid text-white">
                                    <span className="text-[10px] font-medium opacity-90">Late</span>
                                    <span className="text-sm font-bold">8%</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-1 flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-success-solid" />
                                        <span className="text-sm text-secondary">Paid</span>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">10</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-warning-solid" />
                                        <span className="text-sm text-secondary">Late</span>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">1</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-brand-solid" />
                                        <span className="text-sm text-secondary">Pending</span>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">1</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-fg-disabled" />
                                        <span className="text-sm text-secondary">Unpaid</span>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">0</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-2 flex gap-3">
                            <Button color="secondary" size="sm" className="flex-1">
                                Send Reminders
                            </Button>
                            <Button color="secondary" size="sm" className="flex-1" href="/owner/billing">
                                View All Payments
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Action Items Widget */}
                <ActionItemsWidget />
            </div>

            {/* Lease Expirations & Units Overview - 2 column layout */}
            <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
                {/* Upcoming Lease Expirations */}
                <div className="flex flex-col rounded-xl border border-secondary bg-primary shadow-xs">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-secondary px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                                <File06 className="size-4 text-white" />
                            </div>
                            <span className="text-base font-medium text-primary">Upcoming Lease Expirations</span>
                        </div>
                        <a href="/owner/leases" className="text-sm font-medium text-brand-primary hover:underline">
                            View All
                        </a>
                    </div>
                    <div className="flex flex-col divide-y divide-secondary">
                        {/* Lease 1 - Sarah Johnson */}
                        <div className="flex items-center px-5 py-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                <Avatar 
                                    src="https://www.untitledui.com/images/avatars/sienna-hewitt?fm=webp&q=80"
                                    initials="SJ"
                                    alt="Sarah Johnson"
                                    size="sm"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-primary">Sarah Johnson</p>
                                    <p className="truncate text-xs text-tertiary">Unit A - Main St Apartments</p>
                                </div>
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-sm text-secondary">Expires Feb 28, 2026</span>
                            </div>
                            <div className="flex flex-1 justify-end">
                                <button className="text-sm font-semibold text-brand-primary hover:underline">
                                    Send Renewal
                                </button>
                            </div>
                        </div>
                        {/* Lease 2 - Mike Chen */}
                        <div className="flex items-center px-5 py-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                <Avatar 
                                    initials="MC"
                                    alt="Mike Chen"
                                    size="sm"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-primary">Mike Chen</p>
                                    <p className="truncate text-xs text-tertiary">Unit 1 - Oak Ave Duplex</p>
                                </div>
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-sm text-secondary">Expires Apr 15, 2026</span>
                            </div>
                            <div className="flex flex-1 justify-end">
                                <button className="text-sm font-semibold text-brand-primary hover:underline">
                                    Send Renewal
                                </button>
                            </div>
                        </div>
                        {/* Lease 3 - Lisa Park */}
                        <div className="flex items-center px-5 py-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                <Avatar 
                                    src="https://www.untitledui.com/images/avatars/mathilde-lewis?fm=webp&q=80"
                                    initials="LP"
                                    alt="Lisa Park"
                                    size="sm"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-primary">Lisa Park</p>
                                    <p className="truncate text-xs text-tertiary">Riverside House</p>
                                </div>
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-sm text-secondary">Expires Jun 1, 2026</span>
                            </div>
                            <div className="flex flex-1 justify-end">
                                <button className="text-sm font-semibold text-brand-primary hover:underline">
                                    Send Renewal
                                </button>
                            </div>
                        </div>
                        {/* Lease 4 - Emma Wilson */}
                        <div className="flex items-center px-5 py-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                <Avatar 
                                    src="https://www.untitledui.com/images/avatars/ammar-foley?fm=webp&q=80"
                                    initials="EW"
                                    alt="Emma Wilson"
                                    size="sm"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-primary">Emma Wilson</p>
                                    <p className="truncate text-xs text-tertiary">Unit 3B - Sunset Apartments</p>
                                </div>
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-sm text-secondary">Expires Jul 15, 2026</span>
                            </div>
                            <div className="flex flex-1 justify-end">
                                <button className="text-sm font-semibold text-brand-primary hover:underline">
                                    Send Renewal
                                </button>
                            </div>
                        </div>
                        {/* Lease 5 - David Brown */}
                        <div className="flex items-center px-5 py-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                <Avatar 
                                    initials="DB"
                                    alt="David Brown"
                                    size="sm"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-primary">David Brown</p>
                                    <p className="truncate text-xs text-tertiary">Unit 2A - Oak Street Condos</p>
                                </div>
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-sm text-secondary">Expires Aug 30, 2026</span>
                            </div>
                            <div className="flex flex-1 justify-end">
                                <button className="text-sm font-semibold text-brand-primary hover:underline">
                                    Send Renewal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maintenance & Units Summary */}
                <div className="flex flex-col gap-5 lg:gap-6">
                    {/* Maintenance Requests Widget */}
                    <MaintenanceRequestsWidget />

                    {/* Units Overview */}
                    <div className="flex flex-col rounded-xl border border-secondary bg-primary shadow-xs">
                        <div className="flex items-center justify-between border-b border-secondary px-5 py-3">
                            <div className="flex items-center gap-2">
                                <Building07 className="size-4 text-fg-quaternary" />
                                <span className="text-sm font-semibold text-primary">Units Overview</span>
                            </div>
                            <a href="/owner/properties" className="text-sm font-medium text-brand-primary hover:underline">
                                Manage
                            </a>
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-secondary">
                            <div className="flex flex-col items-center gap-1 p-4">
                                <span className="text-display-xs font-semibold text-primary">12</span>
                                <span className="text-xs text-tertiary">Total Units</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 p-4">
                                <span className="text-display-xs font-semibold text-success-primary">10</span>
                                <span className="text-xs text-tertiary">Occupied</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 p-4">
                                <span className="text-display-xs font-semibold text-warning-primary">2</span>
                                <span className="text-xs text-tertiary">Vacant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity table */}
            <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-xl">
                <div className="flex gap-4 px-5 pt-3 pb-2.5">
                    <p className="text-sm font-semibold text-primary">Recent Activity</p>
                </div>

                <div className="flex flex-col items-start gap-4 rounded-t-xl border-b border-secondary bg-primary p-5 ring-1 ring-secondary lg:flex-row">
                    <div className="flex flex-1 flex-col gap-3">
                        <p className="text-display-sm font-semibold text-primary">{recentActivities.length}</p>
                        <div className="flex gap-2">
                            <MetricChangeIndicator value="2 new today" trend="positive" type="simple" />
                        </div>
                    </div>

                    <Tabs className="w-auto">
                        <TabList
                            type="button-minimal"
                            items={[
                                { id: "all", label: "All activity" },
                                { id: "payments", label: "Payments" },
                                { id: "maintenance", label: "Maintenance" },
                                { id: "applications", label: "Applications" },
                            ]}
                        />
                    </Tabs>
                </div>

                <Table
                    aria-label="Recent activity"
                    selectionMode="multiple"
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    className="bg-primary"
                >
                    <Table.Header className="bg-primary">
                        <Table.Head id="id" label="ID" isRowHeader className="w-full" />
                        <Table.Head id="type" label="Type" />
                        <Table.Head id="date" label="Date" />
                        <Table.Head id="status" label="Status" className="max-md:hidden" />
                        <Table.Head id="property" label="Property" className="max-md:hidden" />
                        <Table.Head id="actions" />
                    </Table.Header>

                    <Table.Body items={sortedActivities}>
                        {(activity) => (
                            <Table.Row id={activity.id}>
                                <Table.Cell className="font-medium! text-primary">{activity.id}</Table.Cell>
                                <Table.Cell>
                                    <Badge color="gray" type="pill-color" size="sm">
                                        {activity.type}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell className="text-nowrap">{formatDate(activity.date)}</Table.Cell>
                                <Table.Cell className="max-md:hidden">
                                    <BadgeWithDot
                                        color={getStatusColor(activity.status) as "success" | "warning" | "error" | "gray" | "brand"}
                                        type="pill-color"
                                        size="sm"
                                        className="capitalize"
                                    >
                                        {activity.status.replace("_", " ")}
                                    </BadgeWithDot>
                                </Table.Cell>
                                <Table.Cell className="text-nowrap max-md:hidden">
                                    <div className="flex w-max items-center gap-3">
                                        <Avatar
                                            src={activity.property.avatarUrl}
                                            initials={getInitials(activity.property.name)}
                                            alt={activity.property.name}
                                            size="md"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-primary">{activity.property.name}</p>
                                            <p className="text-sm text-tertiary">{activity.property.unit}</p>
                                        </div>
                                    </div>
                                </Table.Cell>

                                <Table.Cell className="px-4">
                                    <div className="flex items-center justify-end">
                                        <TableRowActionsDropdown />
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
                <PaginationCardMinimal align="right" page={1} total={3} />
            </TableCard.Root>

        </div>
    );
}
