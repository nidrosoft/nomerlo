"use client";

import { useState, useMemo, useCallback } from "react";
import {
    ClipboardCheck,
    MessageSquare01,
    Tool02,
    File06,
    ChevronRight,
    Inbox01,
} from "@untitledui/icons";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

type TabType = "all" | "applications" | "messages" | "maintenance" | "leases";

interface ActionItem {
    id: string;
    type: TabType;
    title: string;
    subtitle: string;
    href: string;
    priority: "high" | "medium" | "low";
    count?: number;
}

// ============================================================================
// Mock Data
// ============================================================================

const actionItems: ActionItem[] = [
    {
        id: "1",
        type: "applications",
        title: "5 New Applications",
        subtitle: "Waiting for your review",
        href: "/owner/applications",
        priority: "high",
        count: 5,
    },
    {
        id: "2",
        type: "messages",
        title: "2 Unread Messages",
        subtitle: "From tenants",
        href: "/owner/messages",
        priority: "high",
        count: 2,
    },
    {
        id: "3",
        type: "maintenance",
        title: "3 Maintenance Requests",
        subtitle: "1 new, 2 in progress",
        href: "/owner/maintenance",
        priority: "medium",
        count: 3,
    },
    {
        id: "4",
        type: "leases",
        title: "1 Lease Expiring Soon",
        subtitle: "Sarah Johnson - Feb 28, 2026",
        href: "/owner/leases",
        priority: "medium",
        count: 1,
    },
];

// ============================================================================
// Tab Configuration
// ============================================================================

const tabs: { id: TabType; label: string; icon: typeof ClipboardCheck }[] = [
    { id: "all", label: "All", icon: Inbox01 },
    { id: "applications", label: "Applications", icon: ClipboardCheck },
    { id: "messages", label: "Messages", icon: MessageSquare01 },
    { id: "maintenance", label: "Maintenance", icon: Tool02 },
    { id: "leases", label: "Leases", icon: File06 },
];

// ============================================================================
// Priority Colors
// ============================================================================

const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
        case "high":
            return "bg-error-solid";
        case "medium":
            return "bg-warning-solid";
        case "low":
            return "bg-brand-solid";
    }
};

const getTypeColor = (type: TabType) => {
    switch (type) {
        case "applications":
            return "bg-brand-solid";
        case "messages":
            return "bg-error-solid";
        case "maintenance":
            return "bg-warning-solid";
        case "leases":
            return "bg-success-solid";
        default:
            return "bg-brand-solid";
    }
};

// ============================================================================
// Action Item Component
// ============================================================================

interface ActionItemRowProps {
    item: ActionItem;
}

function ActionItemRow({ item }: ActionItemRowProps) {
    return (
        <a
            href={item.href}
            className="flex items-start gap-3 rounded-lg border border-secondary bg-primary py-2 pl-2 pr-3 transition-colors hover:bg-secondary_subtle"
        >
            {/* Colored left border */}
            <div
                className={cx(
                    "h-full min-h-[40px] w-1 shrink-0 rounded-full",
                    getTypeColor(item.type)
                )}
            />

            {/* Content */}
            <div className="flex flex-1 items-center gap-2">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">{item.title}</p>
                    <p className="text-xs text-tertiary">{item.subtitle}</p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-fg-quaternary" />
            </div>
        </a>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export function ActionItemsWidget() {
    const [activeTab, setActiveTab] = useState<TabType>("all");

    // Memoize filtered items to prevent recalculation on every render
    const filteredItems = useMemo(() =>
        activeTab === "all"
            ? actionItems
            : actionItems.filter((item) => item.type === activeTab),
        [activeTab]
    );

    // Memoize tab counts to prevent recalculation
    const tabCounts = useMemo(() => {
        const counts: Record<TabType, number> = {
            all: actionItems.reduce((sum, item) => sum + (item.count || 0), 0),
            applications: 0,
            messages: 0,
            maintenance: 0,
            leases: 0,
        };
        actionItems.forEach((item) => {
            if (item.type !== "all") {
                counts[item.type] += item.count || 0;
            }
        });
        return counts;
    }, []);

    const getTabCount = useCallback((tabId: TabType) => tabCounts[tabId], [tabCounts]);

    return (
        <div className="flex flex-col rounded-2xl border border-secondary bg-primary p-3 shadow-xs">
            {/* Header */}
            <div className="mb-3 flex items-center gap-2 px-1">
                <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid">
                    <Inbox01 className="size-4 text-white" />
                </div>
                <span className="text-base font-medium text-primary">Action Items</span>
            </div>

            {/* Subtitle */}
            <p className="mb-3 px-1 text-sm text-tertiary">
                Tasks requiring your attention
            </p>

            {/* Tabs */}
            <div className="mb-3 flex border-b border-secondary">
                {tabs.map((tab) => {
                    const count = getTabCount(tab.id);
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cx(
                                "flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "border-brand-solid text-brand-primary"
                                    : "border-transparent text-tertiary hover:text-secondary"
                            )}
                        >
                            <tab.icon className="size-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            {count > 0 && (
                                <span
                                    className={cx(
                                        "flex size-5 items-center justify-center rounded-full text-xs font-semibold",
                                        isActive
                                            ? "bg-brand-solid text-white"
                                            : "bg-secondary text-tertiary"
                                    )}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Item List */}
            <div className="flex flex-col gap-3">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <ActionItemRow key={item.id} item={item} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Inbox01 className="mb-2 size-8 text-fg-disabled" />
                        <p className="text-sm text-tertiary">No items in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
}
