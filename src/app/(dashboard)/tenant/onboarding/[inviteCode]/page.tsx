interface Props {
    params: Promise<{ inviteCode: string }>
}

export default async function TenantInvitePage({ params }: Props) {
    const { inviteCode } = await params
    
    return (
        <div>
            <h1 className="text-4xl font-bold">Tenant Invitation</h1>
            <p className="mt-4 text-muted-foreground">Invite Code: {inviteCode}</p>
            <p className="mt-2 text-muted-foreground">Coming soon...</p>
        </div>
    )
}
