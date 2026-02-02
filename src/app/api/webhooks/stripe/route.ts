import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    // Coming soon: Stripe webhook handler
    return NextResponse.json({ message: 'Webhook received' })
}
