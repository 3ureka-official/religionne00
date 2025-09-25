// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { addOrder } from '@/firebase/orderService';
import { sendAdminNotificationEmail, sendOrderConfirmationEmail } from "@/services/emailService";

export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  if (!sig) {
    console.error('Webhook Error: No signature provided.');
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      webhookSecret,
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `invalid_signature: ${errorMessage}` },
      { status: 400 },
    );
  }

  console.log('Webhook Event Received:', event.type, event.id);

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent Succeeded:', paymentIntent.id);
        
        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          });
          
          const session = sessions.data[0];
          if (session?.metadata?.orderData) {
            // セッションメタデータから注文データを復元
            const orderData = JSON.parse(session.metadata.orderData);
            
            // 決済成功時に初めて注文を作成
            const orderId = await addOrder(orderData, 'processing');
            console.log(`Order ${orderId} created and confirmed as processing`);

            try {
              await Promise.all([
                sendOrderConfirmationEmail({ orderData, orderId }),
                sendAdminNotificationEmail({ orderData, orderId })
              ]);
              console.log('Order confirmation emails sent successfully');
            } catch (emailError) {
              console.error('Email sending failed:', emailError);
            }
            
            return NextResponse.json({
              received: true,
              message: 'Payment succeeded, order created and confirmed'
            });
          }
        } catch (error) {
          console.error('Error processing payment_intent.succeeded:', error);
        }
        
        break;
      }

      default:
        console.log('Webhook event type not explicitly handled:', event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Webhook handler failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
 