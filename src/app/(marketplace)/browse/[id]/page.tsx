interface Props {
    params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: Props) {
    const { id } = await params
    
    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold">Listing Detail: {id}</h1>
            <p className="mt-4 text-muted-foreground">Coming soon...</p>
        </div>
    )
}
