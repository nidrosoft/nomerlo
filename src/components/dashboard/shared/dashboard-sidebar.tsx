"use client";

import type { FC, ReactNode } from "react";
import { useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import {
    Category,
    Building,
    Calendar as CalendarIcon,
    ArrowLeft2,
    ArrowRight2,
    Card,
    DocumentText,
    FolderOpen,
    DirectInbox,
    Message,
    Chart,
    ReceiptText,
    Setting2,
    People,
    ClipboardTick,
    Wallet,
    MessageQuestion,
} from "iconsax-react";
import type { IconProps } from "iconsax-react";
import { Link as AriaLink, Pressable } from "react-aria-components";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import { MobileNavigationHeader } from "@/components/application/app-navigation/base-components/mobile-header";
import { cx, sortCx } from "@/utils/cx";

// Type for Iconsax icon components
type IconsaxIcon = FC<IconProps>;

// ============================================================================
// Types
// ============================================================================

export interface DashboardNavItem {
    label: string;
    href: string;
    icon: IconsaxIcon;
    badge?: ReactNode;
    badgeColor?: "brand" | "error" | "warning" | "success" | "gray";
}

export interface DashboardNavSection {
    label: string;
    items: DashboardNavItem[];
}

export type PortalType = "owner" | "tenant" | "maintenance" | "admin";

// ============================================================================
// Context for sidebar state
// ============================================================================

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

// ============================================================================
// Navigation Configurations
// ============================================================================

const OWNER_NAVIGATION: DashboardNavSection[] = [
    {
        label: "Main",
        items: [
            { label: "Dashboard", href: "/owner", icon: Category },
            { label: "Properties", href: "/owner/properties", icon: Building, badge: "3" },
            { label: "Applications", href: "/owner/applications", icon: ClipboardTick, badge: "5", badgeColor: "error" },
            { label: "Tenants", href: "/owner/tenants", icon: People, badge: "10" },
            { label: "Calendar", href: "/owner/calendar", icon: CalendarIcon },
            { label: "Messages", href: "/owner/messages", icon: Message, badge: "2", badgeColor: "error" },
        ],
    },
    {
        label: "Financial",
        items: [
            { label: "Billing Center", href: "/owner/billing", icon: Card },
            { label: "Expenses", href: "/owner/expenses", icon: ReceiptText },
            { label: "Subscription", href: "/owner/settings/billing", icon: Wallet },
        ],
    },
    {
        label: "Operations",
        items: [
            { label: "Maintenance", href: "/owner/maintenance", icon: Setting2, badge: "3", badgeColor: "error" },
            { label: "Reports", href: "/owner/reports", icon: Chart },
            { label: "Listings", href: "/owner/listings", icon: DirectInbox },
            { label: "Leases", href: "/owner/leases", icon: DocumentText },
        ],
    },
];

const TENANT_NAVIGATION: DashboardNavSection[] = [
    {
        label: "Main",
        items: [
            { label: "Dashboard", href: "/tenant", icon: Category },
            { label: "My Lease", href: "/tenant/lease", icon: DocumentText },
            { label: "Payments", href: "/tenant/payments", icon: Card },
            { label: "Messages", href: "/tenant/messages", icon: Message, badge: "1", badgeColor: "error" },
        ],
    },
    {
        label: "Services",
        items: [
            { label: "Maintenance", href: "/tenant/maintenance", icon: Setting2 },
            { label: "Documents", href: "/tenant/documents", icon: FolderOpen },
            { label: "Community", href: "/tenant/community", icon: People },
        ],
    },
];

const MAINTENANCE_NAVIGATION: DashboardNavSection[] = [
    {
        label: "Main",
        items: [
            { label: "Dashboard", href: "/maintenance", icon: Category },
            { label: "Work Orders", href: "/maintenance/work-orders", icon: Setting2, badge: "8", badgeColor: "error" },
            { label: "Schedule", href: "/maintenance/schedule", icon: CalendarIcon },
        ],
    },
    {
        label: "Resources",
        items: [
            { label: "Inventory", href: "/maintenance/inventory", icon: FolderOpen },
            { label: "Vendors", href: "/maintenance/vendors", icon: People },
            { label: "Reports", href: "/maintenance/reports", icon: Chart },
        ],
    },
];

const ADMIN_NAVIGATION: DashboardNavSection[] = [
    {
        label: "Overview",
        items: [
            { label: "Dashboard", href: "/admin", icon: Category },
            { label: "Analytics", href: "/admin/analytics", icon: Chart },
        ],
    },
    {
        label: "Management",
        items: [
            { label: "Owners", href: "/admin/owners", icon: People },
            { label: "Subscriptions", href: "/admin/subscriptions", icon: Card },
            { label: "Support", href: "/admin/support", icon: MessageQuestion },
        ],
    },
    {
        label: "Settings",
        items: [
            { label: "Settings", href: "/admin/settings", icon: Setting2 },
        ],
    },
];

// ============================================================================
// Styles
// ============================================================================

const navItemStyles = sortCx({
    root: "group relative flex w-full cursor-pointer items-center rounded-xl bg-transparent outline-focus-ring transition duration-100 ease-linear select-none hover:bg-white/10 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 px-3 py-2",
    rootSelected: "bg-white hover:bg-gray-100 text-gray-900 rounded-xl",
});

// ============================================================================
// Components
// ============================================================================

// Slim nav item button with tooltip
interface SlimNavItemProps {
    item: DashboardNavItem;
    isActive: boolean;
}

function SlimNavItem({ item, isActive }: SlimNavItemProps) {
    const Icon = item.icon;
    const hasBadge = !!item.badge;

    const getBadgeStyles = () => {
        switch (item.badgeColor) {
            case "error":
                return "bg-red-500 text-white";
            case "warning":
                return "bg-yellow-500 text-white";
            case "success":
                return "bg-green-500 text-white";
            case "brand":
                return "bg-brand-primary text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <Tooltip title={item.label} placement="right">
            <Pressable>
                <a
                    href={item.href}
                    aria-label={item.label}
                    className={cx(
                        "relative flex size-10 cursor-pointer items-center justify-center rounded-lg bg-transparent outline-focus-ring transition-colors select-none hover:bg-white/10 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2",
                        isActive && "bg-white hover:bg-gray-100"
                    )}
                >
                    <Icon 
                        size={20} 
                        color={isActive ? "#111827" : "#9ca3af"} 
                        variant="Bulk"
                    />
                    {hasBadge && (
                        <span className={cx(
                            "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-sm",
                            getBadgeStyles()
                        )}>
                            {item.badge}
                        </span>
                    )}
                </a>
            </Pressable>
        </Tooltip>
    );
}

// Expanded nav item
interface NavItemProps {
    item: DashboardNavItem;
    isActive: boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
    const Icon = item.icon;

    const getBadgeStyles = (color?: string, active?: boolean) => {
        if (active) {
            return "bg-gray-200 text-gray-800";
        }
        switch (color) {
            case "error":
                return "bg-red-500 text-white";
            case "warning":
                return "bg-yellow-500 text-white";
            case "success":
                return "bg-emerald-500 text-white";
            case "brand":
                return "bg-brand-primary text-white";
            default:
                return "bg-gray-600 text-white";
        }
    };

    return (
        <AriaLink
            href={item.href}
            className={cx(navItemStyles.root, isActive && navItemStyles.rootSelected)}
            aria-current={isActive ? "page" : undefined}
        >
            <span className="mr-2 flex shrink-0">
                <Icon
                    size={20}
                    color={isActive ? "#111827" : "#9ca3af"}
                    variant="Bulk"
                />
            </span>
            <span
                className={cx(
                    "flex-1 truncate text-md font-medium",
                    isActive ? "text-gray-900" : "text-gray-300 group-hover:text-white"
                )}
            >
                {item.label}
            </span>
            {item.badge && (
                <span
                    className={cx(
                        "ml-3 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                        getBadgeStyles(item.badgeColor, isActive)
                    )}
                >
                    {item.badge}
                </span>
            )}
        </AriaLink>
    );
}

// Collapse toggle button
interface CollapseButtonProps {
    isCollapsed: boolean;
    onClick: () => void;
}

function CollapseButton({ isCollapsed, onClick }: CollapseButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-600 bg-gray-700 shadow-xs transition-colors hover:bg-gray-600"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            {isCollapsed ? (
                <ArrowRight2 size={14} color="#d1d5db" variant="Bold" />
            ) : (
                <ArrowLeft2 size={14} color="#d1d5db" variant="Bold" />
            )}
        </button>
    );
}

// ============================================================================
// Main Dashboard Sidebar Component
// ============================================================================

interface DashboardSidebarProps {
    portalType: PortalType;
    defaultCollapsed?: boolean;
}

export function DashboardSidebar({ portalType, defaultCollapsed = false }: DashboardSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    // Get navigation based on portal type
    const getNavigation = (): DashboardNavSection[] => {
        switch (portalType) {
            case "owner":
                return OWNER_NAVIGATION;
            case "tenant":
                return TENANT_NAVIGATION;
            case "maintenance":
                return MAINTENANCE_NAVIGATION;
            case "admin":
                return ADMIN_NAVIGATION;
            default:
                return OWNER_NAVIGATION;
        }
    };

    const getBasePath = (): string => {
        switch (portalType) {
            case "owner":
                return "/owner";
            case "tenant":
                return "/tenant";
            case "maintenance":
                return "/maintenance";
            case "admin":
                return "/admin";
            default:
                return "/owner";
        }
    };

    const navigation = getNavigation();
    const basePath = getBasePath();

    const isActive = (href: string) => {
        if (href === basePath) {
            return pathname === basePath;
        }
        return pathname?.startsWith(href);
    };

    const EXPANDED_WIDTH = 280;
    const COLLAPSED_WIDTH = 68;
    const currentWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

    // Expanded sidebar content
    const expandedContent = (
        <aside
            className="flex h-full w-full flex-col justify-between overflow-auto rounded-2xl bg-gray-950 pt-4 shadow-xs lg:pt-5"
        >
            {/* Logo and collapse button */}
            <div className="flex items-center justify-between gap-2 px-4 lg:px-5">
                <a href={basePath} className="flex items-center">
                    <span className="text-xl font-bold text-white">nomerlo.</span>
                </a>
                <CollapseButton isCollapsed={isCollapsed} onClick={() => setIsCollapsed(true)} />
            </div>

            {/* Navigation sections */}
            <ul className="mt-6 flex-1">
                {navigation.map((section) => (
                    <li key={section.label}>
                        <div className="px-5 pb-1">
                            <p className="text-xs font-bold uppercase text-gray-500">
                                {section.label}
                            </p>
                        </div>
                        <ul className="px-3 pb-5">
                            {section.items.map((item) => (
                                <li key={item.label} className="py-0.5">
                                    <NavItem item={item} isActive={isActive(item.href)} />
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

        </aside>
    );

    // Collapsed (slim) sidebar content
    const collapsedContent = (
        <aside className="flex h-full w-full flex-col justify-between overflow-auto rounded-2xl bg-gray-950 py-5 shadow-xs">
            {/* Logo */}
            <div className="flex flex-col items-center gap-4 px-3">
                <a href={basePath} className="flex items-center justify-center">
                    <span className="text-xl font-bold text-white">n.</span>
                </a>
                <CollapseButton isCollapsed={isCollapsed} onClick={() => setIsCollapsed(false)} />
            </div>

            {/* Navigation - flattened without section labels */}
            <ul className="mt-4 flex flex-1 flex-col gap-1 px-3">
                {navigation.flatMap((section) =>
                    section.items.map((item) => (
                        <li key={item.label}>
                            <SlimNavItem item={item} isActive={isActive(item.href)} />
                        </li>
                    ))
                )}
            </ul>

        </aside>
    );

    // Mobile expanded content (always expanded on mobile)
    const mobileContent = (
        <aside className="flex h-full w-full flex-col justify-between overflow-auto bg-gray-950 pt-4">
            {/* Logo */}
            <div className="px-4">
                <a href={basePath} className="flex items-center">
                    <span className="text-xl font-bold text-white">nomerlo.</span>
                </a>
            </div>

            {/* Navigation sections */}
            <ul className="mt-6 flex-1">
                {navigation.map((section) => (
                    <li key={section.label}>
                        <div className="px-5 pb-1">
                            <p className="text-xs font-bold uppercase text-gray-500">{section.label}</p>
                        </div>
                        <ul className="px-3 pb-5">
                            {section.items.map((item) => (
                                <li key={item.label} className="py-0.5">
                                    <NavItem item={item} isActive={isActive(item.href)} />
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

        </aside>
    );

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            {/* Mobile header navigation */}
            <MobileNavigationHeader>{mobileContent}</MobileNavigationHeader>

            {/* Desktop sidebar navigation - instant switch, no animation */}
            <div
                style={{ width: currentWidth }}
                className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:py-2 lg:pl-2"
            >
                <div className="h-full w-full">
                    {isCollapsed ? collapsedContent : expandedContent}
                </div>
            </div>

            {/* Placeholder for fixed sidebar */}
            <div
                style={{ paddingLeft: currentWidth + 8 }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </SidebarContext.Provider>
    );
}
