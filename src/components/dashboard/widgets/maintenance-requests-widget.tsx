"use client";

import { 
    Droplets01,
    Thermometer01,
    Lightbulb02,
    Key01,
    Tool02,
    ChevronRight,
    AlertCircle,
} from "@untitledui/icons";
import type { FC, SVGProps } from "react";
import { Table } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

type MaintenanceCategory = "plumbing" | "hvac" | "electrical" | "lock" | "appliance" | "other";
type UrgencyLevel = "urgent" | "normal" | "low";
type RequestStatus = "new" | "in_progress" | "completed";

interface MaintenanceRequest {
    id: string;
    title: string;
    unit: string;
    property: string;
    category: MaintenanceCategory;
    urgency: UrgencyLevel;
    status: RequestStatus;
    submittedAt: Date;
    href?: string;
}

// ============================================================================
// Configuration
// ============================================================================

// Icon mapping for each category
const categoryIcons: Record<MaintenanceCategory, FC<SVGProps<SVGSVGElement>>> = {
    plumbing: Droplets01,
    hvac: Thermometer01,
    electrical: Lightbulb02,
    lock: Key01,
    appliance: Tool02,
    other: Tool02,
};

// Icon background colors
const categoryIconBg: Record<MaintenanceCategory, string> = {
    plumbing: "bg-brand-secondary",
    hvac: "bg-warning-secondary",
    electrical: "bg-success-secondary",
    lock: "bg-error-secondary",
    appliance: "bg-secondary",
    other: "bg-secondary",
};

// Icon foreground colors
const categoryIconFg: Record<MaintenanceCategory, string> = {
    plumbing: "text-brand-primary",
    hvac: "text-warning-primary",
    electrical: "text-success-primary",
    lock: "text-error-primary",
    appliance: "text-fg-quaternary",
    other: "text-fg-quaternary",
};

// Urgency badge colors
const urgencyColors: Record<UrgencyLevel, "error" | "warning" | "gray"> = {
    urgent: "error",
    normal: "warning",
    low: "gray",
};

// Status badge colors
const statusColors: Record<RequestStatus, "error" | "brand" | "success"> = {
    new: "error",
    in_progress: "brand",
    completed: "success",
};

// Status display labels
const statusLabels: Record<RequestStatus, string> = {
    new: "New",
    in_progress: "In Progress",
    completed: "Completed",
};

// ============================================================================
// Mock Data
// ============================================================================

const mockMaintenanceRequests: MaintenanceRequest[] = [
    {
        id: "MNT-001",
        title: "Leaky faucet",
        unit: "Unit C",
        property: "Oak Street Condos",
        category: "plumbing",
        urgency: "urgent",
        status: "new",
        submittedAt: new Date(2026, 0, 27, 14, 30),
        href: "/owner/maintenance/MNT-001",
    },
    {
        id: "MNT-002",
        title: "HVAC not cooling",
        unit: "Unit B",
        property: "Main St Apartments",
        category: "hvac",
        urgency: "normal",
        status: "in_progress",
        submittedAt: new Date(2026, 0, 25, 9, 15),
        href: "/owner/maintenance/MNT-002",
    },
    {
        id: "MNT-003",
        title: "Broken blinds",
        unit: "Unit A",
        property: "Downtown Lofts",
        category: "other",
        urgency: "low",
        status: "new",
        submittedAt: new Date(2026, 0, 24, 16, 45),
        href: "/owner/maintenance/MNT-003",
    },
];

// ============================================================================
// Helper Functions
// ============================================================================

function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

// ============================================================================
// Main Widget Component
// ============================================================================

interface MaintenanceRequestsWidgetProps {
    requests?: MaintenanceRequest[];
    className?: string;
}

export function MaintenanceRequestsWidget({ 
    requests = mockMaintenanceRequests,
    className,
}: MaintenanceRequestsWidgetProps) {
    const totalCount = requests.length;
    const urgentCount = requests.filter(r => r.urgency === "urgent").length;

    return (
        <div className={cx("flex flex-col overflow-hidden rounded-2xl border border-secondary bg-primary shadow-xs", className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                        <Tool02 className="size-4 text-white" />
                    </div>
                    <span className="text-base font-medium text-primary">Maintenance Requests</span>
                    {urgentCount > 0 && (
                        <div className="flex items-center gap-1">
                            <AlertCircle className="size-3.5 text-error-primary" />
                            <span className="text-xs font-medium text-error-primary">
                                {urgentCount} urgent
                            </span>
                        </div>
                    )}
                </div>
                <a 
                    href="/owner/maintenance" 
                    className="text-sm font-medium text-brand-primary hover:underline"
                >
                    View All ({totalCount})
                </a>
            </div>

            {/* Table */}
            <Table aria-label="Maintenance requests" selectionMode="none" className="bg-primary">
                <Table.Header bordered={false}>
                    <Table.Head id="issue" label="Issue" isRowHeader className="w-full pl-4" />
                    <Table.Head id="date" label="Date" />
                    <Table.Head id="urgency" label="Urgency" />
                    <Table.Head id="status" label="Status" />
                    <Table.Head id="actions" label="" />
                </Table.Header>

                <Table.Body items={requests}>
                    {(request) => {
                        const Icon = categoryIcons[request.category];
                        
                        return (
                            <Table.Row 
                                id={request.id} 
                                href={request.href}
                                className="h-16 cursor-pointer"
                            >
                                {/* Issue - Icon + Title + Unit */}
                                <Table.Cell className="pl-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cx(
                                                "flex size-10 shrink-0 items-center justify-center rounded-full",
                                                categoryIconBg[request.category]
                                            )}
                                        >
                                            <Icon className={cx("size-5", categoryIconFg[request.category])} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-primary">
                                                {request.title}
                                            </p>
                                            <p className="text-xs text-tertiary">
                                                {request.unit}
                                            </p>
                                        </div>
                                    </div>
                                </Table.Cell>

                                {/* Date */}
                                <Table.Cell>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-tertiary whitespace-nowrap">
                                            {formatDate(request.submittedAt)}
                                        </span>
                                        <span className="text-xs text-tertiary">
                                            {formatTime(request.submittedAt)}
                                        </span>
                                    </div>
                                </Table.Cell>

                                {/* Urgency Badge */}
                                <Table.Cell>
                                    <Badge
                                        size="sm"
                                        type="pill-color"
                                        color={urgencyColors[request.urgency]}
                                        className="capitalize"
                                    >
                                        {request.urgency}
                                    </Badge>
                                </Table.Cell>

                                {/* Status Badge */}
                                <Table.Cell>
                                    <Badge
                                        size="sm"
                                        type="pill-color"
                                        color={statusColors[request.status]}
                                    >
                                        {statusLabels[request.status]}
                                    </Badge>
                                </Table.Cell>

                                {/* Chevron */}
                                <Table.Cell className="pr-4">
                                    <ChevronRight className="size-5 text-fg-quaternary" />
                                </Table.Cell>
                            </Table.Row>
                        );
                    }}
                </Table.Body>
            </Table>

            {/* Empty State */}
            {requests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Tool02 className="mb-2 size-8 text-fg-disabled" />
                    <p className="text-sm text-tertiary">No maintenance requests</p>
                </div>
            )}
        </div>
    );
}

export type { MaintenanceRequest, MaintenanceCategory, UrgencyLevel, RequestStatus };
