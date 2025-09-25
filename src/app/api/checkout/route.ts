import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(request: Request) {
  try {
    const { items, email, shippingFee, orderId } = await request.json()
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'jpy',
          product_data: { name: item.name },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shippingFee, currency: 'jpy' },
          display_name: '配送料',
        },
      }],
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/complete`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/confirm`,
      metadata: { orderId },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe session creation error:', error)
    return NextResponse.json(
      { error: 'セッション作成に失敗しました' },
      { status: 500 }
    )
  }
} 