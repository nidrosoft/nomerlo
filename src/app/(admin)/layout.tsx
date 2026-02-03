// Force dynamic rendering for authenticated admin pages
export const dynamic = 'force-dynamic';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Admin Sidebar - Coming Soon */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}
