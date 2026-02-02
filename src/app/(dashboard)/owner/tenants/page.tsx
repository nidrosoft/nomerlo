"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import {
    Plus,
    SearchMd,
    Users01,
    Home02,
    CreditCard02,
    AlertCircle,
    Eye,
    Mail01,
    Edit01,
    Trash01,
    RefreshCw01,
} from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { MetricsChart04 } from "@/components/application/metrics/metrics";
import { Table, TableCard } from "@/components/application/table/table";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { TenantCard, InviteTenantModal, type TenantData } from "@/components/tenants";
import { PropertyToolbar } from "@/components/dashboard/properties";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

// Demo tenants data
const demoTenants: TenantData[] = [
    {
        id: "1",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        phone: "(512) 555-0101",
        status: "current",
        propertyName: "Main Street Apartments",
        unitName: "Unit A",
        leaseStart: Date.now() - 180 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() + 185 * 24 * 60 * 60 * 1000,
        monthlyRent: 1500,
        currentBalance: 0,
        lastPaymentDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
        lastPaymentAmount: 1500,
        portalStatus: "active",
    },
    {
        id: "2",
        firstName: "Mike",
        lastName: "Chen",
        email: "mike.chen@email.com",
        phone: "(512) 555-0102",
        status: "current",
        propertyName: "Main Street Apartments",
        unitName: "Unit C",
        leaseStart: Date.now() - 330 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() + 35 * 24 * 60 * 60 * 1000,
        monthlyRent: 1800,
        currentBalance: 1800,
        portalStatus: "active",
    },
    {
        id: "3",
        firstName: "Lisa",
        lastName: "Park",
        email: "lisa.park@email.com",
        phone: "(512) 555-0103",
        status: "current",
        propertyName: "Main Street Apartments",
        unitName: "Unit D",
        leaseStart: Date.now() - 300 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() + 65 * 24 * 60 * 60 * 1000,
        monthlyRent: 1600,
        currentBalance: 0,
        lastPaymentDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
        lastPaymentAmount: 1600,
        moveOutDate: Date.now() + 32 * 24 * 60 * 60 * 1000,
        portalStatus: "active",
    },
    {
        id: "4",
        firstName: "Tom",
        lastName: "Wilson",
        email: "tom.wilson@email.com",
        phone: "(512) 555-0104",
        status: "current",
        propertyName: "Oak Street Condos",
        unitName: "Unit 2A",
        leaseStart: Date.now() - 200 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() + 165 * 24 * 60 * 60 * 1000,
        monthlyRent: 2200,
        currentBalance: 0,
        lastPaymentDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
        lastPaymentAmount: 2200,
        portalStatus: "active",
    },
    {
        id: "5",
        firstName: "Emma",
        lastName: "Davis",
        email: "emma.davis@email.com",
        phone: "(512) 555-0105",
        status: "current",
        propertyName: "Oak Street Condos",
        unitName: "Unit 3B",
        leaseStart: Date.now() - 90 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() + 275 * 24 * 60 * 60 * 1000,
        monthlyRent: 2100,
        currentBalance: 0,
        lastPaymentDate: Date.now() - 1 * 24 * 60 * 60 * 1000,
        lastPaymentAmount: 2100,
        portalStatus: "active",
    },
    {
        id: "6",
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@email.com",
        phone: "(512) 555-0106",
        status: "current",
        propertyName: "Sunset Apartments",
        unitName: "Unit 5A",
        leaseStart: Date.now() - 150 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() + 215 * 24 * 60 * 60 * 1000,
        monthlyRent: 1400,
        currentBalance: 0,
        lastPaymentDate: Date.now() - 4 * 24 * 60 * 60 * 1000,
        lastPaymentAmount: 1400,
        portalStatus: "invited",
    },
    {
        id: "7",
        firstName: "Jennifer",
        lastName: "Garcia",
        email: "jennifer.garcia@email.com",
        phone: "(512) 555-0107",
        status: "current",
        propertyName: "Sunset Apartments",
        unitName: "Unit 4C",
        leaseStart: Date.now() - 250 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() + 115 * 24 * 60 * 60 * 1000,
        monthlyRent: 1550,
        currentBalance: 200,
        lastPaymentDate: Date.now() - 40 * 24 * 60 * 60 * 1000,
        lastPaymentAmount: 1550,
        portalStatus: "active",
    },
    {
        id: "8",
        firstName: "James",
        lastName: "Martinez",
        email: "james.martinez@email.com",
        phone: "(512) 555-0108",
        status: "past",
        propertyName: "Main Street Apartments",
        unitName: "Unit B",
        leaseStart: Date.now() - 400 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() - 35 * 24 * 60 * 60 * 1000,
        monthlyRent: 1500,
        currentBalance: 0,
        lastPaymentDate: Date.now() - 40 * 24 * 60 * 60 * 1000,
        lastPaymentAmount: 1500,
        portalStatus: "disabled",
    },
    {
        id: "9",
        firstName: "Amanda",
        lastName: "Taylor",
        email: "amanda.taylor@email.com",
        phone: "(512) 555-0109",
        status: "current",
        propertyName: "Downtown Lofts",
        unitName: "Loft 12",
        leaseStart: Date.now() - 60 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() + 305 * 24 * 60 * 60 * 1000,
        monthlyRent: 2800,
        currentBalance: 0,
        lastPaymentDate: Date.now() - 6 * 24 * 60 * 60 * 1000,
        lastPaymentAmount: 2800,
        portalStatus: "active",
    },
    {
        id: "10",
        firstName: "Robert",
        lastName: "Anderson",
        email: "robert.anderson@email.com",
        phone: "(512) 555-0110",
        status: "current",
        propertyName: "Downtown Lofts",
        unitName: "Loft 8",
        leaseStart: Date.now() - 120 * 24 * 60 * 60 * 1000,
        leaseEnd: Date.now() + 245 * 24 * 60 * 60 * 1000,
        monthlyRent: 2600,
        currentBalance: 0,
        lastPaymentDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
        lastPaymentAmount: 2600,
        portalStatus: "active",
    },
];

export default function TenantsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });

    // Fetch tenants from Convex
    const convexTenants = useQuery(api.tenants.queries.listTenants, {});

    // Check if data is still loading
    const isLoading = convexTenants === undefined;

    // Transform Convex tenants to display format
    const dbTenants: TenantData[] = useMemo(() => {
        if (!convexTenants) return [];
        return convexTenants.map((tenant) => ({
            id: tenant._id,
            firstName: tenant.firstName,
            lastName: tenant.lastName,
            email: tenant.email,
            phone: tenant.phone,
            status: tenant.status as TenantData["status"],
            propertyName: tenant.property?.name || "Unknown Property",
            unitName: tenant.unit?.name || tenant.unit?.unitNumber || "Unknown Unit",
            leaseStart: tenant.lease?.startDate,
            leaseEnd: tenant.lease?.endDate,
            monthlyRent: tenant.lease?.monthlyRent || 0,
            currentBalance: tenant.currentBalance || 0,
            lastPaymentDate: tenant.lastPaymentDate,
            lastPaymentAmount: tenant.lastPaymentAmount,
            moveOutDate: tenant.moveOutDate,
            portalStatus: tenant.portalStatus as TenantData["portalStatus"],
        }));
    }, [convexTenants]);

    // Use database tenants, or demo data ONLY if query finished with empty results
    const allTenants = useMemo(() => {
        if (isLoading) return [];
        return dbTenants.length > 0 ? dbTenants : demoTenants;
    }, [dbTenants, isLoading]);

    // Filter tenants
    const filteredTenants = useMemo(() => {
        return allTenants.filter((tenant) => {
            const matchesSearch =
                `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tenant.phone.includes(searchQuery);

            const isMovingOut = tenant.status === "current" && tenant.moveOutDate && 
                (tenant.moveOutDate - Date.now()) / (1000 * 60 * 60 * 24) <= 60;

            const matchesTab =
                selectedTab === "all" ||
                (selectedTab === "active" && tenant.status === "current" && !isMovingOut) ||
                (selectedTab === "moving_out" && isMovingOut) ||
                (selectedTab === "past" && tenant.status === "past");

            return matchesSearch && matchesTab;
        });
    }, [allTenants, searchQuery, selectedTab]);

    // Calculate stats - show 0s while loading
    const stats = useMemo(() => {
        if (isLoading) {
            return { total: 0, active: 0, movingOut: 0, past: 0, withBalance: 0 };
        }
        const active = allTenants.filter((t) => t.status === "current").length;
        const movingOut = allTenants.filter((t) => {
            if (t.status !== "current" || !t.moveOutDate) return false;
            return (t.moveOutDate - Date.now()) / (1000 * 60 * 60 * 24) <= 60;
        }).length;
        const past = allTenants.filter((t) => t.status === "past").length;
        const withBalance = allTenants.filter((t) => t.currentBalance > 0).length;
        return { total: allTenants.length, active, movingOut, past, withBalance };
    }, [allTenants, isLoading]);

    // Tab items
    const tabItems = [
        { id: "all", label: `All (${stats.total})` },
        { id: "active", label: `Active (${stats.active - stats.movingOut})` },
        { id: "moving_out", label: `Moving Out (${stats.movingOut})` },
        { id: "past", label: `Past (${stats.past})` },
    ];

    // Generate chart data
    const generateChartData = (baseValue: number) => {
        const data = [];
        for (let i = 0; i < 8; i++) {
            const variance = 1 + (Math.random() - 0.5) * 0.3;
            data.push({ value: Math.round(baseValue * variance * (0.8 + (i * 0.03))) });
        }
        return data;
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Tenants</h1>
                    <p className="text-md text-tertiary">Manage your tenants and their leases</p>
                </div>
                <Button
                    color="primary"
                    size="md"
                    iconLeading={Plus}
                    onClick={() => setIsInviteModalOpen(true)}
                >
                    Invite Tenant
                </Button>
            </div>

            {/* Metrics Cards */}
            <div className="flex flex-col gap-5 md:flex-row md:flex-wrap lg:gap-6">
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title={stats.active.toString()}
                    subtitle="Active Tenants"
                    icon={Users01}
                    change="+2"
                    changeTrend="positive"
                    changeDescription="this month"
                    chartData={generateChartData(stats.active)}
                />
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title={stats.movingOut.toString()}
                    subtitle="Moving Out"
                    icon={Home02}
                    change={stats.movingOut > 0 ? "Needs attention" : "None"}
                    changeTrend={stats.movingOut > 0 ? "negative" : "positive"}
                    changeDescription="next 60 days"
                    chartData={generateChartData(stats.movingOut || 1)}
                />
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title={`$${(allTenants.reduce((sum, t) => sum + t.monthlyRent, 0)).toLocaleString()}`}
                    subtitle="Monthly Revenue"
                    icon={CreditCard02}
                    change="+5.2%"
                    changeTrend="positive"
                    changeDescription="vs last month"
                    chartData={generateChartData(18000)}
                />
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title={stats.withBalance.toString()}
                    subtitle="Outstanding Balance"
                    icon={AlertCircle}
                    change={stats.withBalance > 0 ? `${stats.withBalance} tenants` : "All current"}
                    changeTrend={stats.withBalance > 0 ? "negative" : "positive"}
                    changeDescription="with balance due"
                    chartData={generateChartData(stats.withBalance || 1)}
                />
            </div>

            {/* Toolbar */}
            <PropertyToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalCount={filteredTenants.length}
                label="tenants"
            />

            {/* Tabs */}
            <div className="rounded-xl border border-secondary bg-primary p-1">
                <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
                    <TabList type="button-minimal" items={tabItems.map((t) => ({ id: t.id, label: t.label }))} />
                </Tabs>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-secondary bg-primary py-20">
                    <LoadingIndicator type="line-simple" size="md" label="Loading tenants..." />
                </div>
            ) : viewMode === "grid" ? (
                <TenantGridView tenants={filteredTenants} />
            ) : (
                <TenantTableView
                    tenants={filteredTenants}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                />
            )}

            {/* Empty State */}
            {!isLoading && filteredTenants.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-secondary bg-primary py-16 text-center">
                    <Users01 className="mb-3 size-12 text-fg-disabled" />
                    <h3 className="text-lg font-medium text-primary">No tenants found</h3>
                    <p className="mt-1 text-sm text-tertiary">
                        {searchQuery ? "Try adjusting your search" : "Invite your first tenant to get started"}
                    </p>
                    {!searchQuery && (
                        <Button
                            color="primary"
                            size="md"
                            className="mt-4"
                            iconLeading={Plus}
                            onClick={() => setIsInviteModalOpen(true)}
                        >
                            Invite Tenant
                        </Button>
                    )}
                </div>
            )}

            {/* Invite Modal */}
            <InviteTenantModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
}

// Grid View Component
function TenantGridView({ tenants }: { tenants: TenantData[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tenants.map((tenant) => (
                <TenantCard key={tenant.id} tenant={tenant} />
            ))}
        </div>
    );
}

// Table View Component
function TenantTableView({
    tenants,
    sortDescriptor,
    onSortChange,
}: {
    tenants: TenantData[];
    sortDescriptor: SortDescriptor;
    onSortChange: (descriptor: SortDescriptor) => void;
}) {
    const getStatusBadgeColor = (status: string, moveOutDate?: number): "success" | "warning" | "gray" | "error" => {
        if (status === "current" && moveOutDate) {
            const daysUntil = (moveOutDate - Date.now()) / (1000 * 60 * 60 * 24);
            if (daysUntil > 0 && daysUntil <= 60) return "warning";
        }
        const colors: Record<string, "success" | "warning" | "gray" | "error"> = {
            current: "success",
            applicant: "warning",
            past: "gray",
            evicted: "error",
        };
        return colors[status] || "gray";
    };

    const getStatusLabel = (status: string, moveOutDate?: number): string => {
        if (status === "current" && moveOutDate) {
            const daysUntil = (moveOutDate - Date.now()) / (1000 * 60 * 60 * 24);
            if (daysUntil > 0 && daysUntil <= 60) return "Moving Out";
        }
        const labels: Record<string, string> = {
            current: "Active",
            applicant: "Applicant",
            past: "Past",
            evicted: "Evicted",
        };
        return labels[status] || status;
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

    const formatDate = (timestamp: number) =>
        new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const getInitials = (firstName: string, lastName: string) =>
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    return (
        <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-2xl">
            <Table
                aria-label="Tenants"
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                onSortChange={onSortChange}
                className="bg-primary"
            >
                <Table.Header className="bg-primary">
                    <Table.Head id="name" label="Tenant" isRowHeader className="w-full" />
                    <Table.Head id="property" label="Property/Unit" className="max-lg:hidden" />
                    <Table.Head id="rent" label="Rent" />
                    <Table.Head id="balance" label="Balance" className="max-md:hidden" />
                    <Table.Head id="lease" label="Lease Ends" className="max-md:hidden" />
                    <Table.Head id="status" label="Status" />
                    <Table.Head id="actions" label="" />
                </Table.Header>

                <Table.Body items={tenants}>
                    {(tenant) => (
                        <Table.Row id={tenant.id}>
                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary text-sm font-medium text-brand-primary">
                                        {getInitials(tenant.firstName, tenant.lastName)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-primary">
                                            {tenant.firstName} {tenant.lastName}
                                        </p>
                                        <p className="text-sm text-tertiary">{tenant.email}</p>
                                    </div>
                                </div>
                            </Table.Cell>
                            <Table.Cell className="max-lg:hidden">
                                <div>
                                    <p className="text-sm text-primary">{tenant.unitName}</p>
                                    <p className="text-sm text-tertiary">{tenant.propertyName}</p>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="font-medium text-primary">{formatCurrency(tenant.monthlyRent)}/mo</span>
                            </Table.Cell>
                            <Table.Cell className="max-md:hidden">
                                <span className={tenant.currentBalance > 0 ? "text-error-primary font-medium" : "text-success-primary"}>
                                    {tenant.currentBalance > 0 ? formatCurrency(tenant.currentBalance) : "Current"}
                                </span>
                            </Table.Cell>
                            <Table.Cell className="max-md:hidden">
                                {tenant.leaseEnd ? formatDate(tenant.leaseEnd) : "—"}
                            </Table.Cell>
                            <Table.Cell>
                                <BadgeWithDot
                                    color={getStatusBadgeColor(tenant.status, tenant.moveOutDate)}
                                    type="pill-color"
                                    size="sm"
                                >
                                    {getStatusLabel(tenant.status, tenant.moveOutDate)}
                                </BadgeWithDot>
                            </Table.Cell>
                            <Table.Cell className="px-4">
                                <div className="flex items-center justify-end">
                                    <Dropdown.Root>
                                        <Dropdown.DotsButton />
                                        <Dropdown.Popover className="w-min">
                                            <Dropdown.Menu>
                                                <Dropdown.Item href={`/owner/tenants/${tenant.id}`} icon={Eye}>
                                                    <span className="pr-4">View</span>
                                                </Dropdown.Item>
                                                <Dropdown.Item icon={Mail01}>
                                                    <span className="pr-4">Message</span>
                                                </Dropdown.Item>
                                                <Dropdown.Item icon={Edit01}>
                                                    <span className="pr-4">Edit</span>
                                                </Dropdown.Item>
                                                {tenant.portalStatus === "invited" && (
                                                    <Dropdown.Item icon={RefreshCw01}>
                                                        <span className="pr-4">Resend Invite</span>
                                                    </Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown.Root>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
}
