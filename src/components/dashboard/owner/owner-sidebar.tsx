"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
    LayoutDashboard,
    Building2,
    FileText,
    Users,
    Calendar,
    MessageSquare,
    CreditCard,
    Receipt,
    Scroll,
    Wrench,
    BarChart3,
    Megaphone,
    FileSignature,
    HelpCircle,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    ChevronDown,
} from "lucide-react";
import { cx } from "@/utils/cx";

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: "red" | "yellow" | "green";
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const NAVIGATION: NavSection[] = [
    {
        title: "Main",
        items: [
            { name: "Dashboard", href: "/owner", icon: LayoutDashboard },
            { name: "Properties", href: "/owner/properties", icon: Building2, badge: 3 },
            { name: "Applications", href: "/owner/applications", icon: FileText, badge: 5, badgeColor: "red" },
            { name: "Tenants", href: "/owner/tenants", icon: Users, badge: 10 },
            { name: "Calendar", href: "/owner/calendar", icon: Calendar },
            { name: "Messages", href: "/owner/messages", icon: MessageSquare, badge: 2, badgeColor: "red" },
        ],
    },
    {
        title: "Financial",
        items: [
            { name: "Billing Center", href: "/owner/billing", icon: CreditCard },
            { name: "Expenses", href: "/owner/expenses", icon: Receipt },
            { name: "Subscription", href: "/owner/settings/billing", icon: Scroll },
        ],
    },
    {
        title: "Operations",
        items: [
            { name: "Maintenance", href: "/owner/maintenance", icon: Wrench, badge: 3, badgeColor: "red" },
            { name: "Reports", href: "/owner/reports", icon: BarChart3 },
            { name: "Listings", href: "/owner/listings", icon: Megaphone },
            { name: "Leases", href: "/owner/leases", icon: FileSignature },
        ],
    },
];

const BOTTOM_NAV: NavItem[] = [
    { name: "Help & Support", href: "/owner/help", icon: HelpCircle },
    { name: "Settings", href: "/owner/settings", icon: Settings },
    { name: "Profile", href: "/owner/settings/profile", icon: User },
];

export function OwnerSidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/owner") {
            return pathname === "/owner";
        }
        return pathname?.startsWith(href);
    };

    const getBadgeClasses = (color?: "red" | "yellow" | "green") => {
        switch (color) {
            case "red":
                return "bg-error-primary text-white";
            case "yellow":
                return "bg-warning-primary text-warning-primary";
            case "green":
                return "bg-success-primary text-white";
            default:
                return "bg-secondary text-tertiary";
        }
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-secondary px-4">
                <a href="/owner" className="text-xl font-bold text-primary">
                    nomerlo.
                </a>
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-lg p-2 text-tertiary hover:bg-primary_hover lg:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* User info */}
            <div className="border-b border-secondary p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary text-sm font-semibold text-brand-solid">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-primary">
                            {user?.fullName || "Owner"}
                        </p>
                        <p className="truncate text-xs text-tertiary">
                            Growth Plan · 4 units
                        </p>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-tertiary" />
                </div>
            </div>

            {/* Navigation sections */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {NAVIGATION.map((section) => (
                    <div key={section.title} className="mb-6">
                        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-tertiary">
                            {section.title}
                        </h3>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            className={cx(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                active
                                                    ? "bg-brand-secondary text-brand-solid"
                                                    : "text-secondary hover:bg-primary_hover hover:text-primary"
                                            )}
                                        >
                                            <item.icon
                                                className={cx(
                                                    "h-5 w-5 flex-shrink-0",
                                                    active ? "text-brand-solid" : "text-fg-quaternary"
                                                )}
                                            />
                                            <span className="flex-1">{item.name}</span>
                                            {item.badge !== undefined && (
                                                <span
                                                    className={cx(
                                                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                                                        getBadgeClasses(item.badgeColor)
                                                    )}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom navigation */}
            <div className="border-t border-secondary px-3 py-4">
                <ul className="space-y-1">
                    {BOTTOM_NAV.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    className={cx(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        active
                                            ? "bg-brand-secondary text-brand-solid"
                                            : "text-secondary hover:bg-primary_hover hover:text-primary"
                                    )}
                                >
                                    <item.icon
                                        className={cx(
                                            "h-5 w-5 flex-shrink-0",
                                            active ? "text-brand-solid" : "text-fg-quaternary"
                                        )}
                                    />
                                    <span>{item.name}</span>
                                </a>
                            </li>
                        );
                    })}
                    <li>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-primary_hover hover:text-primary">
                            <LogOut className="h-5 w-5 flex-shrink-0 text-fg-quaternary" />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-lg bg-primary p-2 shadow-lg ring-1 ring-secondary lg:hidden"
            >
                <Menu className="h-5 w-5 text-secondary" />
            </button>

            {/* Mobile sidebar backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={cx(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-primary transition-transform duration-300 lg:hidden",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent />
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden w-64 flex-shrink-0 border-r border-secondary bg-primary lg:flex lg:flex-col">
                <SidebarContent />
            </aside>
        </>
    );
}
