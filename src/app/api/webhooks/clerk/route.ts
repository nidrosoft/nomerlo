import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    // Coming soon: Clerk webhook handler
    return NextResponse.json({ message: 'Webhook received' })
}
