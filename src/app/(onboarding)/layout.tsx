// Force dynamic rendering for authenticated onboarding pages
export const dynamic = 'force-dynamic';

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="dashboard-theme">
            {children}
        </div>
    )
}
