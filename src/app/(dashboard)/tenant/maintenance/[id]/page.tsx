interface Props {
    params: Promise<{ id: string }>
}

export default async function TenantMaintenanceDetailPage({ params }: Props) {
    const { id } = await params
    
    return (
        <div>
            <h1 className="text-3xl font-bold">Request: {id}</h1>
            <p className="mt-4 text-muted-foreground">Coming soon...</p>
        </div>
    )
}
