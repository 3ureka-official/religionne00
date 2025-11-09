// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrderById, updateOrderStatus, updateOrderPaymentIntentId } from '@/firebase/orderService';
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

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          });
          
          const session = sessions.data[0];
          if (session?.metadata?.orderId) {
            // セッションメタデータからorderIdを取得
            const orderId = session.metadata.orderId;
            const paymentMethod = session.metadata.paymentMethod || 'credit';
            
            // 既存の注文を取得
            const order = await getOrderById(orderId);
            
            if (order) {
              // PaymentIntent IDを保存
              await updateOrderPaymentIntentId(orderId, paymentIntent.id);
              
              // 注文ステータスを'processing'に更新
              await updateOrderStatus(orderId, 'processing');
              
              // 注文データを準備（メール送信用）
              const orderData = {
                customer: order.customer,
                email: order.email,
                phone: order.phone || '',
                total: order.total,
                shippingFee: order.shippingFee,
                items: order.items,
                address: {
                  ...order.address,
                  line2: order.address.line2 || ''
                },
                paymentMethod: paymentMethod
              };

              try {
                await Promise.all([
                  sendOrderConfirmationEmail({ orderData, orderId }),
                  sendAdminNotificationEmail({ orderData, orderId })
                ]);
              } catch (emailError) {
                console.error('Email sending failed:', emailError);
              }
              
              return NextResponse.json({
                received: true,
                message: 'Payment succeeded, order updated and confirmed'
              });
            } else {
              console.error(`Order not found: ${orderId}`);
            }
          }
        } catch (error) {
          console.error('Error processing payment_intent.succeeded:', error);
        }
        
        break;
      }

      default:
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
 