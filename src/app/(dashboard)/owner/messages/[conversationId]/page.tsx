interface Props {
    params: Promise<{ conversationId: string }>
}

export default async function ConversationPage({ params }: Props) {
    const { conversationId } = await params
    
    return (
        <div>
            <h1 className="text-3xl font-bold">Conversation: {conversationId}</h1>
            <p className="mt-4 text-muted-foreground">Coming soon...</p>
        </div>
    )
}
