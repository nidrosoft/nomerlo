import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { DashboardThemeProvider } from "@/components/providers/dashboard-theme-provider";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <DashboardThemeProvider>
            <div className="dashboard-theme min-h-screen">
                {children}
            </div>
        </DashboardThemeProvider>
    );
}
