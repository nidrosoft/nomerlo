"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import {
    Plus,
    ChevronDown,
    SearchMd,
    Mail01,
    UserPlus01,
} from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { Table, TableCard } from "@/components/application/table/table";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import {
    ApplicationCard,
    ApplicationFilterModal,
    InviteApplicantModal,
    AddApplicantModal,
    type ApplicationData,
    type ApplicationFilters,
} from "@/components/applications";
import { PropertyToolbar } from "@/components/dashboard/properties";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

// Demo applications data
const demoApplications: ApplicationData[] = [
    {
        id: "1",
        applicant: { firstName: "John", lastName: "Martinez", email: "john.martinez@email.com", phone: "(512) 555-0199" },
        status: "submitted",
        propertyName: "Main Street Apartments",
        unitName: "Unit B",
        rentAmount: 1500,
        desiredMoveIn: Date.now() + 7 * 24 * 60 * 60 * 1000,
        income: 6500,
        screeningStatus: "pending",
        submittedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
    {
        id: "2",
        applicant: { firstName: "Sarah", lastName: "Williams", email: "sarah.w@email.com", phone: "(512) 555-0188" },
        status: "under_review",
        propertyName: "Main Street Apartments",
        unitName: "Unit B",
        rentAmount: 1500,
        desiredMoveIn: Date.now() + 21 * 24 * 60 * 60 * 1000,
        income: 5800,
        creditScore: 720,
        backgroundCheckPassed: true,
        screeningStatus: "completed",
        submittedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
        id: "3",
        applicant: { firstName: "Mike", lastName: "Chen", email: "mike.chen@email.com", phone: "(512) 555-0177" },
        status: "approved",
        propertyName: "Main Street Apartments",
        unitName: "Unit C",
        rentAmount: 1800,
        desiredMoveIn: Date.now() + 4 * 24 * 60 * 60 * 1000,
        income: 7200,
        creditScore: 780,
        backgroundCheckPassed: true,
        screeningStatus: "completed",
        submittedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    },
    {
        id: "4",
        applicant: { firstName: "Emily", lastName: "Johnson", email: "emily.j@email.com", phone: "(512) 555-0166" },
        status: "screening",
        propertyName: "Oak Street Condos",
        unitName: "Unit 4A",
        rentAmount: 2200,
        desiredMoveIn: Date.now() + 30 * 24 * 60 * 60 * 1000,
        income: 8500,
        screeningStatus: "in_progress",
        submittedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
        id: "5",
        applicant: { firstName: "David", lastName: "Brown", email: "david.b@email.com", phone: "(512) 555-0155" },
        status: "denied",
        propertyName: "Sunset Apartments",
        unitName: "Unit 12",
        rentAmount: 1400,
        desiredMoveIn: Date.now() + 14 * 24 * 60 * 60 * 1000,
        income: 3200,
        creditScore: 580,
        backgroundCheckPassed: true,
        screeningStatus: "completed",
        submittedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    },
];

const initialFilters: ApplicationFilters = {
    statuses: [],
    properties: [],
    minIncome: "",
    maxIncome: "",
    minCreditScore: "",
    hasPets: null,
    screeningComplete: null,
};

// Status options for the select dropdown
const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "submitted", label: "New" },
    { id: "under_review", label: "In Review" },
    { id: "screening", label: "Screening" },
    { id: "approved", label: "Approved" },
    { id: "denied", label: "Denied" },
];

// Status badge color mapping
const getStatusBadgeColor = (status: string): "success" | "warning" | "gray" | "brand" | "error" => {
    const colors: Record<string, "success" | "warning" | "gray" | "brand" | "error"> = {
        submitted: "brand",
        under_review: "warning",
        screening: "warning",
        approved: "success",
        conditionally_approved: "success",
        denied: "error",
        withdrawn: "gray",
        expired: "gray",
    };
    return colors[status] || "gray";
};

// Helper function for date formatting
const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

// Status label mapping
const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        submitted: "New",
        under_review: "In Review",
        screening: "Screening",
        approved: "Approved",
        conditionally_approved: "Conditional",
        denied: "Denied",
        withdrawn: "Withdrawn",
        expired: "Expired",
    };
    return labels[status] || status;
};

export default function ApplicationsPage() {
    // State
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedTab, setSelectedTab] = useState<string>("all");
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filters, setFilters] = useState<ApplicationFilters>(initialFilters);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "submittedAt",
        direction: "descending",
    });

    // Fetch applications from Convex
    const convexApplications = useQuery(api.applications.queries.listApplications, {});
    const applicationStats = useQuery(api.applications.queries.getApplicationStats, {});

    // Check if data is still loading (undefined means loading, empty array means no data)
    const isLoading = convexApplications === undefined;

    // Transform Convex applications to display format
    const dbApplications: ApplicationData[] = useMemo(() => {
        if (!convexApplications) return [];
        return convexApplications.map((app) => ({
            id: app._id,
            applicant: {
                firstName: app.applicant.firstName,
                lastName: app.applicant.lastName,
                email: app.applicant.email,
                phone: app.applicant.phone,
            },
            status: app.status as ApplicationData["status"],
            propertyName: app.property?.name || "Unknown Property",
            unitName: app.unit?.name || app.unit?.unitNumber || "Unknown Unit",
            rentAmount: app.listing?.rentAmount || 0,
            desiredMoveIn: app.desiredMoveIn,
            income: app.employment.income,
            creditScore: app.creditScore,
            backgroundCheckPassed: app.backgroundCheckPassed,
            screeningStatus: app.screeningStatus as ApplicationData["screeningStatus"],
            submittedAt: app.submittedAt,
        }));
    }, [convexApplications]);

    // Use database applications, or demo data ONLY if query finished with empty results
    // Never show demo data while loading to prevent flash
    const allApplications = useMemo(() => {
        // Still loading - return empty to show loading state
        if (isLoading) return [];
        // Query completed - use real data, or demo if truly empty
        return dbApplications.length > 0 ? dbApplications : demoApplications;
    }, [dbApplications, isLoading]);

    // Stats for tabs - show 0s while loading to prevent showing demo data counts
    const stats = useMemo(() => {
        if (isLoading) {
            return { all: 0, new: 0, review: 0, approved: 0, denied: 0 };
        }
        const s = applicationStats || {
            total: allApplications.length,
            submitted: allApplications.filter((a) => a.status === "submitted").length,
            underReview: allApplications.filter((a) => a.status === "under_review" || a.status === "screening").length,
            approved: allApplications.filter((a) => a.status === "approved" || a.status === "conditionally_approved").length,
            denied: allApplications.filter((a) => a.status === "denied").length,
        };
        return {
            all: s.total,
            new: s.submitted,
            review: s.underReview + (s.screening || 0),
            approved: s.approved + (s.conditionallyApproved || 0),
            denied: s.denied,
        };
    }, [applicationStats, allApplications, isLoading]);

    // Filter count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.statuses.length > 0) count++;
        if (filters.properties.length > 0) count++;
        if (filters.minIncome || filters.maxIncome) count++;
        if (filters.minCreditScore) count++;
        if (filters.hasPets !== null) count++;
        if (filters.screeningComplete !== null) count++;
        return count;
    }, [filters]);

    // Filter and sort applications
    const filteredApplications = useMemo(() => {
        let result = [...allApplications];

        // Filter by tab
        if (selectedTab !== "all") {
            const tabStatusMap: Record<string, string[]> = {
                new: ["submitted"],
                review: ["under_review", "screening"],
                approved: ["approved", "conditionally_approved"],
                denied: ["denied"],
            };
            const allowedStatuses = tabStatusMap[selectedTab] || [];
            if (allowedStatuses.length > 0) {
                result = result.filter((a) => allowedStatuses.includes(a.status));
            }
        }

        // Filter by status dropdown
        if (statusFilter !== "all") {
            result = result.filter((a) => a.status === statusFilter);
        }

        // Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((a) =>
                `${a.applicant.firstName} ${a.applicant.lastName}`.toLowerCase().includes(query) ||
                a.applicant.email.toLowerCase().includes(query) ||
                a.propertyName.toLowerCase().includes(query)
            );
        }

        // Apply modal filters
        if (filters.statuses.length > 0) {
            result = result.filter((a) => filters.statuses.includes(a.status));
        }
        if (filters.minIncome) {
            result = result.filter((a) => a.income >= parseInt(filters.minIncome));
        }
        if (filters.maxIncome) {
            result = result.filter((a) => a.income <= parseInt(filters.maxIncome));
        }
        if (filters.minCreditScore) {
            result = result.filter((a) => (a.creditScore || 0) >= parseInt(filters.minCreditScore));
        }
        if (filters.screeningComplete === true) {
            result = result.filter((a) => a.screeningStatus === "completed");
        } else if (filters.screeningComplete === false) {
            result = result.filter((a) => a.screeningStatus !== "completed");
        }

        return result;
    }, [allApplications, selectedTab, statusFilter, searchQuery, filters]);

    // Sort for table view
    const sortedApplications = useMemo(() => {
        return filteredApplications.toSorted((a, b) => {
            const col = sortDescriptor.column as keyof ApplicationData;
            let first: any = a[col];
            let second: any = b[col];

            // Handle nested applicant properties
            if (col === "applicant") {
                first = `${a.applicant.firstName} ${a.applicant.lastName}`;
                second = `${b.applicant.firstName} ${b.applicant.lastName}`;
            }

            if (typeof first === "number" && typeof second === "number") {
                return sortDescriptor.direction === "ascending" ? first - second : second - first;
            }

            if (typeof first === "string" && typeof second === "string") {
                const result = first.localeCompare(second);
                return sortDescriptor.direction === "ascending" ? result : -result;
            }

            return 0;
        });
    }, [filteredApplications, sortDescriptor]);

    // Property options for filter
    const propertyOptions = useMemo(() => {
        const properties = new Map<string, string>();
        allApplications.forEach((a) => {
            properties.set(a.propertyName, a.propertyName);
        });
        return Array.from(properties.entries()).map(([id, name]) => ({ id, name }));
    }, [allApplications]);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Applications</h1>
                    <p className="text-md text-tertiary">
                        Review and manage rental applications
                    </p>
                </div>
                <Dropdown.Root>
                    <Button color="primary" size="md" iconLeading={Plus} iconTrailing={ChevronDown}>
                        Actions
                    </Button>
                    <Dropdown.Popover className="w-48">
                        <Dropdown.Menu>
                            <Dropdown.Item icon={Mail01} onAction={() => setIsInviteModalOpen(true)}>
                                <span className="pr-4">Invite Applicant</span>
                            </Dropdown.Item>
                            <Dropdown.Item icon={UserPlus01} onAction={() => setIsAddModalOpen(true)}>
                                <span className="pr-4">Add Applicant</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown.Root>
            </div>

            {/* Card View Layout */}
            {viewMode === "grid" && (
                <>
                    {/* Toolbar - View toggle, results count, filter button, sort */}
                    <PropertyToolbar
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        totalResults={allApplications.length}
                        filteredResults={filteredApplications.length}
                        activeFilterCount={activeFilterCount}
                        onFilterClick={() => setIsFilterModalOpen(true)}
                    />

                    {/* Status Filter Tabs for Card View */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: "all", label: "All", count: stats.all },
                            { id: "new", label: "New", count: stats.new },
                            { id: "review", label: "In Review", count: stats.review },
                            { id: "approved", label: "Approved", count: stats.approved },
                            { id: "denied", label: "Denied", count: stats.denied },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    selectedTab === tab.id
                                        ? "bg-brand-primary text-white"
                                        : "bg-secondary text-secondary hover:bg-tertiary"
                                }`}
                            >
                                {tab.label}
                                <span className={`rounded-full px-2 py-0.5 text-xs ${
                                    selectedTab === tab.id
                                        ? "bg-white/20 text-white"
                                        : "bg-primary text-tertiary"
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Applications Grid */}
                    {isLoading ? (
                        // Loading indicator
                        <div className="flex items-center justify-center rounded-2xl border border-secondary bg-primary py-20">
                            <LoadingIndicator type="line-simple" size="md" label="Loading applications..." />
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-secondary bg-primary py-16">
                            <div className="mb-4 rounded-full bg-secondary p-4">
                                <Mail01 className="size-8 text-tertiary" />
                            </div>
                            <h3 className="text-lg font-medium text-primary">No applications found</h3>
                            <p className="mt-1 text-center text-secondary">
                                {searchQuery || activeFilterCount > 0
                                    ? "Try adjusting your filters or search query"
                                    : "Applications will appear here when prospects apply to your listings"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredApplications.map((application) => (
                                <ApplicationCard
                                    key={application.id}
                                    application={application}
                                    viewMode="grid"
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Table View Layout - Like Listings Page */}
            {viewMode === "list" && (
                <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-2xl">
                    {/* Header bar */}
                    <div className="flex gap-4 px-5 pt-3 pb-2.5">
                        <p className="text-sm font-semibold text-primary">All Applications</p>
                    </div>

                    {/* Summary section with filters */}
                    <div className="flex flex-col items-start gap-4 rounded-t-xl border-b border-secondary bg-primary p-5 ring-1 ring-secondary lg:flex-row">
                        <div className="flex flex-1 flex-col gap-3">
                            <p className="text-display-sm font-semibold text-primary">{filteredApplications.length}</p>
                            <div className="flex items-center gap-4">
                                <Input
                                    className="w-full md:w-80"
                                    size="sm"
                                    aria-label="Search applications"
                                    placeholder="Search by name, email, or property..."
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

                        <div className="flex items-center gap-4">
                            {/* View Toggle */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`rounded-full border p-3 transition-colors ${
                                        viewMode === "grid"
                                            ? "border-primary bg-primary text-fg-primary shadow-sm"
                                            : "border-secondary text-tertiary hover:bg-secondary"
                                    }`}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <rect x="3" y="3" width="7" height="7" rx="1" />
                                        <rect x="14" y="3" width="7" height="7" rx="1" />
                                        <rect x="3" y="14" width="7" height="7" rx="1" />
                                        <rect x="14" y="14" width="7" height="7" rx="1" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`rounded-full border p-3 transition-colors ${
                                        viewMode === "list"
                                            ? "border-primary bg-primary text-fg-primary shadow-sm"
                                            : "border-secondary text-tertiary hover:bg-secondary"
                                    }`}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <line x1="3" y1="12" x2="21" y2="12" />
                                        <line x1="3" y1="18" x2="21" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <Tabs className="w-auto" selectedKey={selectedTab} onSelectionChange={(value) => setSelectedTab(value as string)}>
                                <TabList
                                    type="button-minimal"
                                    items={[
                                        { id: "all", label: "All" },
                                        { id: "new", label: "New" },
                                        { id: "review", label: "In Review" },
                                        { id: "approved", label: "Approved" },
                                        { id: "denied", label: "Denied" },
                                    ]}
                                />
                            </Tabs>
                        </div>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        // Loading indicator for table
                        <div className="flex items-center justify-center bg-primary py-20">
                            <LoadingIndicator type="line-simple" size="md" label="Loading applications..." />
                        </div>
                    ) : (
                        <Table
                            aria-label="Applications"
                            selectionMode="multiple"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                            className="bg-primary"
                        >
                            <Table.Header className="bg-primary">
                                <Table.Head id="applicant" label="Applicant" isRowHeader className="w-full" />
                                <Table.Head id="propertyName" label="Property" className="max-lg:hidden" />
                                <Table.Head id="rentAmount" label="Rent" />
                                <Table.Head id="status" label="Status" />
                                <Table.Head id="income" label="Income" className="max-md:hidden" />
                                <Table.Head id="desiredMoveIn" label="Move-in" className="max-md:hidden" />
                                <Table.Head id="submittedAt" label="Submitted" className="max-md:hidden" />
                                <Table.Head id="actions" label="" />
                            </Table.Header>

                            <Table.Body items={sortedApplications}>
                                {(app) => (
                                    <Table.Row id={app.id}>
                                        {/* Applicant with Avatar */}
                                        <Table.Cell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-sm font-semibold text-brand-primary">
                                                    {app.applicant.firstName[0]}{app.applicant.lastName[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium text-primary">
                                                        {app.applicant.firstName} {app.applicant.lastName}
                                                    </p>
                                                    <p className="text-sm text-tertiary">{app.applicant.email}</p>
                                                </div>
                                            </div>
                                        </Table.Cell>

                                        {/* Property */}
                                        <Table.Cell className="max-lg:hidden">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-primary">{app.unitName}</span>
                                                <span className="text-sm text-tertiary">{app.propertyName}</span>
                                            </div>
                                        </Table.Cell>

                                        {/* Rent */}
                                        <Table.Cell className="text-nowrap">
                                            <span className="font-medium text-primary">
                                                ${app.rentAmount.toLocaleString()}/mo
                                            </span>
                                        </Table.Cell>

                                        {/* Status */}
                                        <Table.Cell>
                                            <BadgeWithDot
                                                color={getStatusBadgeColor(app.status)}
                                                type="pill-color"
                                                size="sm"
                                            >
                                                {getStatusLabel(app.status)}
                                            </BadgeWithDot>
                                        </Table.Cell>

                                        {/* Income */}
                                        <Table.Cell className="max-md:hidden">
                                            <span className="text-primary">${app.income.toLocaleString()}/mo</span>
                                        </Table.Cell>

                                        {/* Move-in */}
                                        <Table.Cell className="max-md:hidden">
                                            <span className="text-tertiary">{formatDate(app.desiredMoveIn)}</span>
                                        </Table.Cell>

                                        {/* Submitted */}
                                        <Table.Cell className="max-md:hidden">
                                            <span className="text-tertiary">{formatDate(app.submittedAt)}</span>
                                        </Table.Cell>

                                        {/* Actions */}
                                        <Table.Cell className="px-4">
                                            <Link
                                                href={`/owner/applications/${app.id}`}
                                                className="text-sm font-medium text-brand-primary hover:underline"
                                            >
                                                View
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    )}

                    {/* Empty State */}
                    {!isLoading && sortedApplications.length === 0 && (
                        <div className="flex flex-col items-center justify-center bg-primary py-12 text-center">
                            <Mail01 className="mb-3 size-10 text-fg-disabled" />
                            <h3 className="text-lg font-medium text-primary">No applications found</h3>
                            <p className="mt-1 text-sm text-tertiary">
                                {searchQuery || statusFilter !== "all"
                                    ? "Try adjusting your search or filter"
                                    : "Applications will appear here when prospects apply"}
                            </p>
                        </div>
                    )}
                </TableCard.Root>
            )}

            {/* Modals */}
            <ApplicationFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                onFiltersChange={setFilters}
                onApply={() => setIsFilterModalOpen(false)}
                onReset={() => setFilters(initialFilters)}
                propertyOptions={propertyOptions}
            />

            <InviteApplicantModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />

            <AddApplicantModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
