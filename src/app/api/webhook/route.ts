// app/api/webhook/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { updateOrderStatus, getOrderById } from '@/firebase/orderService'
// import { sendOrderConfirmationEmail } from '@/services/emailService'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const config = {
  api: {
      bodyParser: false
  }
}

// Webhook ハンドラ
export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.text();
    const rawBody = Buffer.from(body);
    const sig = request.headers.get('stripe-signature');

    let event;
    try {
      if (!sig) {
        console.error('Webhook Error: No signature provided.');
        throw new Error("No signature provided")
      }
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Bad Request")
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    console.log('Webhook Event Received:', event.type, event.id);

    // checkout.session.completedイベントの処理
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Processing checkout.session.completed for session ID:', session.id)

      const orderId = session.metadata?.orderId || session.metadata?.id;

      if (!orderId) {
        console.error('Webhook Error: Missing orderId in session metadata for session ID:', session.id);
        return NextResponse.json({ error: 'Missing orderId in metadata' }, { status: 400 });
      }
      console.log('Order ID from metadata:', orderId);

      try {
        const order = await getOrderById(orderId);
        if (!order) {
          console.error(`Webhook Error: Order not found in Firestore for orderId: ${orderId}, session ID: ${session.id}`);
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status === 'processing' || order.status === 'shipped') {
          console.log(`Order ${orderId} is already processed. Status: ${order.status}. Skipping update.`);
          return NextResponse.json({ received: true, message: 'Order already processed' });
        }

        await updateOrderStatus(orderId, 'processing');
        console.log(`Order ${orderId} status updated to 'processing'.`);

        return NextResponse.json({ received: true, message: 'Order status updated to processing' });

      } catch (dbError) {
        console.error(`Webhook DB Error for orderId ${orderId}, session ID ${session.id}:`, dbError);
        return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
      }
    }
    
    // payment_intent.succeededイベントも処理するなら追加
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent Succeeded:', paymentIntent.id);
    }
    
    // その他のイベントは単に受信確認を返す
    console.log('Webhook event type not explicitly handled, returning received: true');
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Unhandled Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Webhook handler failed.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
