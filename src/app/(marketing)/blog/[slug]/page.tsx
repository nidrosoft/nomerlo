interface Props {
    params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    
    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold">Blog Post: {slug}</h1>
            <p className="mt-4 text-muted-foreground">Coming soon...</p>
        </div>
    )
}
