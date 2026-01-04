import { NextRequest, NextResponse } from 'next/server';
import { WebhookBody } from '@/lib/n8n/config';
import {
    processFeedback,
    processNewsletter,
    processBooking,
    processTicket,
    processChat,
    processPurchase
} from '@/lib/n8n/actions';

export async function POST(req: NextRequest) {
    try {
        const body: WebhookBody = await req.json();
        console.log('[Unified Webhook] JSON Body:', JSON.stringify(body, null, 2));
        const { action } = body;

        console.log(`[Unified Webhook] Received action: ${action}`);

        switch (action) {
            case 'feedback':
                const feedbackResult = await processFeedback(body);
                return NextResponse.json(feedbackResult);
            case 'newsletter':
                const newsletterResult = await processNewsletter(body);
                return NextResponse.json(newsletterResult);
            case 'booking':
                const bookingResult = await processBooking(body);
                return NextResponse.json(bookingResult);
            case 'ticket':
                const ticketResult = await processTicket(body);
                return NextResponse.json(ticketResult);
            case 'chat':
                const chatResult = await processChat(body);
                return NextResponse.json(chatResult);
            case 'purchase':
                const purchaseResult = await processPurchase(body);
                return NextResponse.json(purchaseResult);
            default:
                console.error(`[Unified Webhook] Unknown action: ${action}`);
                return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
        }

    } catch (error: any) {
        console.error('[Unified Webhook] CRITICAL Error:', error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
