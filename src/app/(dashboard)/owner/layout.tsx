"use client";

import { DashboardSidebar } from "@/components/dashboard/shared/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/shared/dashboard-header";
import { FloatingSupportWidget } from "@/components/dashboard/shared/floating-support-widget";

export default function OwnerDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar portalType="owner" />
            <div className="flex min-w-0 flex-1 flex-col">
                <DashboardHeader portalType="owner" />
                <main className="flex-1 bg-[#F7F7F7] px-4 py-8 lg:px-8">
                    {children}
                </main>
            </div>
            <FloatingSupportWidget portalType="owner" />
        </div>
    )
}
