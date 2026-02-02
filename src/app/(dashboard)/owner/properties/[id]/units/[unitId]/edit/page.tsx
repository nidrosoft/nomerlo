interface Props {
    params: Promise<{ id: string; unitId: string }>
}

export default async function EditUnitPage({ params }: Props) {
    const { id, unitId } = await params
    
    return (
        <div>
            <h1 className="text-3xl font-bold">Edit Unit: {unitId}</h1>
            <p className="mt-2 text-muted-foreground">Property: {id}</p>
            <p className="mt-4 text-muted-foreground">Coming soon...</p>
        </div>
    )
}
