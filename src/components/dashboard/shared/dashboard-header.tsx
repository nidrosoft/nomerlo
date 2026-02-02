"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Bell01, ChevronDown, LogOut01, Settings01, User01, HelpCircle } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

type PortalType = "owner" | "tenant" | "maintenance" | "admin";

interface DashboardHeaderProps {
    portalType: PortalType;
}

// ============================================================================
// User Dropdown Menu
// ============================================================================

interface UserDropdownProps {
    portalType: PortalType;
}

function UserDropdown({ portalType }: UserDropdownProps) {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [isOpen, setIsOpen] = useState(false);

    const getBasePath = (): string => {
        switch (portalType) {
            case "owner":
                return "/owner";
            case "tenant":
                return "/tenant";
            case "maintenance":
                return "/maintenance";
            default:
                return "/owner";
        }
    };

    const basePath = getBasePath();

    const handleSignOut = () => {
        signOut({ redirectUrl: "/" });
    };

    const menuItems = [
        {
            label: "Profile",
            href: `${basePath}/settings/profile`,
            icon: User01,
        },
        {
            label: "Settings",
            href: `${basePath}/settings`,
            icon: Settings01,
        },
        {
            label: "Help & Support",
            href: `${basePath}/support`,
            icon: HelpCircle,
        },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-secondary_subtle focus:outline-none focus:ring-2 focus:ring-brand-solid focus:ring-offset-2"
            >
                <Avatar
                    src={user?.imageUrl}
                    size="sm"
                    alt={user?.fullName || "User"}
                    status="online"
                />
                <div className="hidden text-left md:block">
                    <p className="text-sm font-semibold text-primary">
                        {user?.fullName || "User"}
                    </p>
                    <p className="text-xs text-tertiary">
                        {user?.primaryEmailAddress?.emailAddress || ""}
                    </p>
                </div>
                <ChevronDown
                    className={cx(
                        "hidden size-4 text-fg-quaternary transition-transform md:block",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-secondary bg-white py-1 shadow-lg">
                        {/* User Info Header */}
                        <div className="border-b border-secondary px-4 py-3">
                            <p className="text-sm font-semibold text-primary">
                                {user?.fullName || "User"}
                            </p>
                            <p className="text-xs text-tertiary">
                                {user?.primaryEmailAddress?.emailAddress || ""}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            {menuItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-secondary transition-colors hover:bg-secondary_subtle hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="size-4 text-fg-quaternary" />
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-secondary py-1">
                            <button
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-secondary transition-colors hover:bg-secondary_subtle hover:text-primary"
                            >
                                <LogOut01 className="size-4 text-fg-quaternary" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ============================================================================
// Notification Bell
// ============================================================================

interface NotificationBellProps {
    count?: number;
}

function NotificationBell({ count = 0 }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center rounded-lg p-2 text-fg-quaternary transition-colors hover:bg-secondary_subtle hover:text-fg-quaternary_hover focus:outline-none focus:ring-2 focus:ring-brand-solid focus:ring-offset-2"
            >
                <Bell01 className="size-5" />
                {count > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-error-solid text-[10px] font-semibold text-white">
                        {count > 9 ? "9+" : count}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-80 origin-top-right rounded-xl border border-secondary bg-white shadow-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-secondary px-4 py-3">
                            <h3 className="text-sm font-semibold text-primary">
                                Notifications
                            </h3>
                            {count > 0 && (
                                <Badge size="sm" type="pill-color" color="brand">
                                    {count} new
                                </Badge>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="max-h-80 overflow-y-auto">
                            {count === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Bell01 className="mb-2 size-8 text-fg-disabled" />
                                    <p className="text-sm text-tertiary">
                                        No new notifications
                                    </p>
                                </div>
                            ) : (
                                <div className="py-2">
                                    {/* Placeholder notifications */}
                                    <div className="flex gap-3 px-4 py-3 transition-colors hover:bg-secondary_subtle">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-brand-secondary">
                                            <Bell01 className="size-4 text-brand-solid" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-primary">
                                                New maintenance request
                                            </p>
                                            <p className="text-xs text-tertiary">
                                                2 minutes ago
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-secondary p-2">
                            <a
                                href="#"
                                className="block rounded-lg py-2 text-center text-sm font-medium text-brand-primary transition-colors hover:bg-secondary_subtle"
                                onClick={() => setIsOpen(false)}
                            >
                                View all notifications
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ============================================================================
// Main Dashboard Header Component
// ============================================================================

export function DashboardHeader({ portalType }: DashboardHeaderProps) {
    // Mock notification count - replace with real data
    const notificationCount = 3;

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-secondary bg-white px-4 lg:px-8">
            {/* Right side - Notifications & User */}
            <div className="flex items-center gap-2">
                <NotificationBell count={notificationCount} />
                <div className="mx-2 h-6 w-px bg-secondary" />
                <UserDropdown portalType={portalType} />
            </div>
        </header>
    );
}
