export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen">
            {/* Marketplace Header - Coming Soon */}
            <main>{children}</main>
            {/* Marketplace Footer - Coming Soon */}
        </div>
    )
}
