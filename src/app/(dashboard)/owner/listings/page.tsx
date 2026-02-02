"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import {
    Plus,
    Eye,
    Edit01,
    BarChartSquare02,
    PauseCircle,
    PlayCircle,
    Mail01,
    Users01,
    ClipboardCheck,
    SearchMd,
    Trash01,
    Link01,
    Calendar,
} from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { MetricsChart04 } from "@/components/application/metrics/metrics";
import { Table, TableCard } from "@/components/application/table/table";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

// Status options for the select dropdown
const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "active", label: "Active" },
    { id: "paused", label: "Paused" },
    { id: "draft", label: "Draft" },
    { id: "rented", label: "Rented" },
];

// Demo listings (will be replaced by Convex data when available)
const demoListings = [
    {
        id: "1",
        title: "Modern Downtown Apartment",
        property: "Sunset Apartments",
        unit: "Unit 4B",
        rent: 2500,
        status: "active",
        views: 342,
        inquiries: 18,
        applications: 5,
        publishedAt: "2024-01-15",
    },
    {
        id: "2",
        title: "Cozy Studio Near Park",
        property: "Park View Complex",
        unit: "Studio 2A",
        rent: 1800,
        status: "paused",
        views: 256,
        inquiries: 12,
        applications: 3,
        publishedAt: "2024-01-18",
    },
    {
        id: "3",
        title: "Spacious Family Home",
        property: "Oak Street House",
        unit: "Main House",
        rent: 3200,
        status: "rented",
        views: 189,
        inquiries: 8,
        applications: 2,
        publishedAt: "2024-01-10",
    },
    {
        id: "4",
        title: "Luxury Penthouse Suite",
        property: "The Heights",
        unit: "PH-1",
        rent: 5500,
        status: "draft",
        views: 0,
        inquiries: 0,
        applications: 0,
        publishedAt: null,
    },
];

// Status badge color mapping
const getStatusBadgeColor = (status: string): "success" | "warning" | "gray" | "brand" => {
    const colors: Record<string, "success" | "warning" | "gray" | "brand"> = {
        active: "success",
        paused: "warning",
        draft: "gray",
        rented: "brand",
    };
    return colors[status] || "gray";
};

// Helper function for date formatting
const formatDate = (dateString: string | null): string => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export default function OwnerListingsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "title",
        direction: "ascending",
    });

    // Fetch listings from Convex
    const convexListings = useQuery(api.listings.queries.listListings, {});

    // Check if data is still loading
    const isLoading = convexListings === undefined;

    // Transform Convex listings to display format
    const dbListings = useMemo(() => {
        if (!convexListings) return [];
        return convexListings.map((listing) => ({
            id: listing._id,
            title: listing.title,
            property: listing.property?.name || "Unknown Property",
            unit: listing.unit?.unitNumber || "N/A",
            rent: listing.rentAmount,
            status: listing.status,
            views: listing.viewCount,
            inquiries: listing.inquiryCount,
            applications: listing.applicationCount,
            publishedAt: listing.publishedAt
                ? new Date(listing.publishedAt).toISOString().split("T")[0]
                : null,
        }));
    }, [convexListings]);

    // Use database listings, or demo data ONLY if query finished with empty results
    const allListings = useMemo(() => {
        if (isLoading) return [];
        return dbListings.length > 0 ? dbListings : demoListings;
    }, [dbListings, isLoading]);

    // Filter listings based on search, status, and tab
    const filteredListings = useMemo(() => {
        return allListings.filter((listing) => {
            const matchesSearch =
                listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                listing.property.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
            const matchesTab = selectedTab === "all" || listing.status === selectedTab;
            return matchesSearch && matchesStatus && matchesTab;
        });
    }, [allListings, searchQuery, statusFilter, selectedTab]);

    // Sort listings
    const sortedListings = useMemo(() => {
        return filteredListings.toSorted((a, b) => {
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
    }, [filteredListings, sortDescriptor]);

    // Calculate stats - show 0s while loading
    const stats = useMemo(() => {
        if (isLoading) {
            return { activeCount: 0, totalViews: 0, totalInquiries: 0, totalApplications: 0 };
        }
        const activeCount = allListings.filter((l) => l.status === "active").length;
        const totalViews = allListings.reduce((sum, l) => sum + l.views, 0);
        const totalInquiries = allListings.reduce((sum, l) => sum + l.inquiries, 0);
        const totalApplications = allListings.reduce((sum, l) => sum + l.applications, 0);
        return { activeCount, totalViews, totalInquiries, totalApplications };
    }, [allListings, isLoading]);

    // Generate chart data for metrics - memoized to prevent recreation on every render
    const generateChartData = useCallback((baseValue: number, variance: number = 0.2) => {
        const data = [];
        for (let i = 0; i < 8; i++) {
            const randomVariance = 1 + (Math.random() - 0.5) * variance;
            data.push({ value: Math.round(baseValue * randomVariance * (0.7 + (i * 0.05))) });
        }
        return data;
    }, []);

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Listings</h1>
                    <p className="text-md text-tertiary">
                        Manage your property listings and track performance
                    </p>
                </div>
                <Link href="/owner/listings/new">
                    <Button color="primary" size="md" iconLeading={Plus}>
                        Create Listing
                    </Button>
                </Link>
            </div>

            {/* Metrics Cards - Same structure as dashboard */}
            <div className="flex flex-col gap-5 md:flex-row md:flex-wrap lg:gap-6">
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title={stats.activeCount.toString()}
                    subtitle="Active Listings"
                    icon={Mail01}
                    change="+1"
                    changeTrend="positive"
                    changeDescription="this week"
                    chartData={generateChartData(stats.activeCount)}
                />
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title={stats.totalViews.toLocaleString()}
                    subtitle="Total Views"
                    icon={Eye}
                    change="12.5%"
                    changeTrend="positive"
                    changeDescription="vs last month"
                    chartData={generateChartData(stats.totalViews)}
                />
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title={stats.totalInquiries.toString()}
                    subtitle="Total Inquiries"
                    icon={Users01}
                    change="+8"
                    changeTrend="positive"
                    changeDescription="this month"
                    chartData={generateChartData(stats.totalInquiries)}
                />
                <MetricsChart04
                    className="flex-1 md:min-w-[260px]"
                    title={stats.totalApplications.toString()}
                    subtitle="Applications"
                    icon={ClipboardCheck}
                    change="+3"
                    changeTrend="positive"
                    changeDescription="pending review"
                    chartData={generateChartData(stats.totalApplications)}
                />
            </div>

            {/* Listings Table - Same structure as dashboard Recent Activity */}
            <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-2xl">
                {/* Header bar */}
                <div className="flex gap-4 px-5 pt-3 pb-2.5">
                    <p className="text-sm font-semibold text-primary">All Listings</p>
                </div>

                {/* Summary section with filters */}
                <div className="flex flex-col items-start gap-4 rounded-t-xl border-b border-secondary bg-primary p-5 ring-1 ring-secondary lg:flex-row">
                    <div className="flex flex-1 flex-col gap-3">
                        <p className="text-display-sm font-semibold text-primary">{filteredListings.length}</p>
                        <div className="flex items-center gap-4">
                            <Input
                                className="w-full md:w-80"
                                size="sm"
                                aria-label="Search listings"
                                placeholder="Search listings..."
                                icon={SearchMd}
                                value={searchQuery}
                                onChange={(value) => setSearchQuery(value)}
                            />
                            <div className="w-40">
                                <Select
                                    selectedKey={statusFilter}
                                    onSelectionChange={(key) => setStatusFilter(key as string)}
                                    placeholder="All Status"
                                    items={statusOptions}
                                    aria-label="Filter by status"
                                >
                                    {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Tabs className="w-auto" selectedKey={selectedTab} onSelectionChange={(value) => setSelectedTab(value as string)}>
                        <TabList
                            type="button-minimal"
                            items={[
                                { id: "all", label: "All" },
                                { id: "active", label: "Active" },
                                { id: "paused", label: "Paused" },
                                { id: "draft", label: "Draft" },
                            ]}
                        />
                    </Tabs>
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center bg-primary py-20">
                        <LoadingIndicator type="line-simple" size="md" label="Loading listings..." />
                    </div>
                ) : (
                    <Table
                        aria-label="Listings"
                        selectionMode="multiple"
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                        className="bg-primary"
                    >
                        <Table.Header className="bg-primary">
                            <Table.Head id="title" label="Listing" isRowHeader className="w-full" />
                            <Table.Head id="property" label="Property" className="max-lg:hidden" />
                            <Table.Head id="rent" label="Rent" />
                            <Table.Head id="status" label="Status" />
                            <Table.Head id="views" label="Views" className="max-md:hidden" />
                            <Table.Head id="inquiries" label="Inquiries" className="max-md:hidden" />
                            <Table.Head id="applications" label="Apps" className="max-md:hidden" />
                            <Table.Head id="actions" label="" />
                        </Table.Header>

                        <Table.Body items={sortedListings}>
                            {(listing) => (
                                <Table.Row id={listing.id}>
                                    {/* Listing Title & Unit */}
                                    <Table.Cell>
                                        <div className="flex flex-col">
                                            <p className="max-w-[280px] truncate text-nowrap text-sm font-medium text-primary" title={listing.title}>
                                                {listing.title}
                                            </p>
                                            <p className="text-sm text-tertiary">{listing.unit}</p>
                                        </div>
                                    </Table.Cell>

                                    {/* Property */}
                                    <Table.Cell className="max-lg:hidden">
                                        <span className="max-w-[180px] truncate text-nowrap text-sm text-secondary" title={listing.property}>
                                            {listing.property}
                                        </span>
                                    </Table.Cell>

                                    {/* Rent */}
                                    <Table.Cell className="text-nowrap">
                                        <span className="font-medium text-primary">
                                            ${listing.rent.toLocaleString()}/mo
                                        </span>
                                    </Table.Cell>

                                    {/* Status */}
                                    <Table.Cell>
                                        <BadgeWithDot
                                            color={getStatusBadgeColor(listing.status)}
                                            type="pill-color"
                                            size="sm"
                                            className="capitalize"
                                        >
                                            {listing.status}
                                        </BadgeWithDot>
                                    </Table.Cell>

                                    {/* Views */}
                                    <Table.Cell className="max-md:hidden">
                                        <span className="text-tertiary">{listing.views}</span>
                                    </Table.Cell>

                                    {/* Inquiries */}
                                    <Table.Cell className="max-md:hidden">
                                        <span className="text-tertiary">{listing.inquiries}</span>
                                    </Table.Cell>

                                    {/* Applications */}
                                    <Table.Cell className="max-md:hidden">
                                        <span className="text-tertiary">{listing.applications}</span>
                                    </Table.Cell>

                                    {/* Actions Dropdown */}
                                    <Table.Cell className="px-4">
                                        <div className="flex items-center justify-end">
                                            <Dropdown.Root>
                                                <Dropdown.DotsButton />
                                                <Dropdown.Popover className="w-min">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href={`/owner/listings/${listing.id}`} icon={Eye}>
                                                            <span className="pr-4">View</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href={`/owner/listings/${listing.id}/edit`} icon={Edit01}>
                                                            <span className="pr-4">Edit</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href={`/owner/listings/${listing.id}/analytics`} icon={BarChartSquare02}>
                                                            <span className="pr-4">Analytics</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item icon={Link01}>
                                                            <span className="pr-4">Copy Link</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Separator />
                                                        <Dropdown.Item icon={listing.status === "active" ? PauseCircle : PlayCircle}>
                                                            <span className="pr-4">{listing.status === "active" ? "Pause" : "Activate"}</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item icon={Trash01} className="text-error-primary">
                                                            <span className="pr-4">Delete</span>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown.Popover>
                                            </Dropdown.Root>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                )}

                {/* Empty State */}
                {!isLoading && sortedListings.length === 0 && (
                    <div className="flex flex-col items-center justify-center bg-primary py-12 text-center">
                        <Mail01 className="mb-3 size-10 text-fg-disabled" />
                        <h3 className="text-lg font-medium text-primary">No listings found</h3>
                        <p className="mt-1 text-sm text-tertiary">
                            {searchQuery || statusFilter !== "all"
                                ? "Try adjusting your search or filter"
                                : "Create your first listing to get started"}
                        </p>
                        {!searchQuery && statusFilter === "all" && (
                            <Link href="/owner/listings/new" className="mt-4">
                                <Button color="primary" size="md" iconLeading={Plus}>
                                    Create Listing
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </TableCard.Root>
        </div>
    );
}
