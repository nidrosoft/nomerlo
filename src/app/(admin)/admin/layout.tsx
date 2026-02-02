"use client";

import { DashboardSidebar } from "@/components/dashboard/shared/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/shared/dashboard-header";

export default function AdminPortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-svh w-full flex-col bg-secondary">
            <DashboardSidebar portalType="admin" />
            <div className="flex flex-1 flex-col lg:pl-[288px]">
                <DashboardHeader portalType="admin" />
                <main className="flex-1 px-4 pb-4 lg:px-6 lg:pb-6">{children}</main>
            </div>
        </div>
    );
}
