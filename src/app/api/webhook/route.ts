// app/api/webhook/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { addOrder } from '@/firebase/orderService'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const config = {
  api: {
      bodyParser: false
  }
}

// 2. Webhook ハンドラ
export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { error: 'No request body' },
        { status: 400 }
      )
    }
    
    // リクエストボディを取得
    const sig = request.headers.get('stripe-signature');
    const rawBody = await request.text();
    const buf = Buffer.from(rawBody);

    let event;
    try {
      if (!sig) throw new Error("No signature provided")
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Bad Request")
      console.log(err)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // 各イベントタイプのデバッグ出力
    console.log('イベントタイプ:', event.type)

    // checkout.session.completedイベントの処理
    if (event.type === 'checkout.session.completed') {
      console.log('決済完了イベントを処理します!')
      const session = event.data.object as Stripe.Checkout.Session
      
      // セッションから顧客情報と注文内容を取得
      const customerEmail = session.customer_email || ''
      
      // 顧客情報をメタデータから取得（Stripeチェックアウト作成時に保存しておく）
      const metadata = session.metadata || {}
      const customerName = metadata.customerName || ''
      const customerPhone = metadata.customerPhone || ''
      const shippingInfo = metadata.shippingInfo ? JSON.parse(metadata.shippingInfo) : {}
      
      // メタデータから商品詳細情報を取得
      const itemsDetails = metadata.itemsDetails ? JSON.parse(metadata.itemsDetails) : []
      
      console.log('metadata', metadata)
      console.log('itemsDetails', itemsDetails)
      
      if (!customerEmail) {
        console.error('Missing customer information in checkout session.')
        return NextResponse.json(
          { error: 'Missing customer information.' },
          { status: 400 }
        )
      }
      
      // Stripeから商品情報を取得
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      
      // 注文アイテムの作成（メタデータの詳細情報と連携）
      const orderItems = lineItems.data.map((item, index) => {
        // 商品情報のベース
        const orderItem = {
          productId: typeof item.price?.product === 'string' ? item.price.product : '',
          name: item.description || '',
          price: item.amount_total ? item.amount_total : 0, // 単位は円
          quantity: item.quantity || 0,
        };
        
        // 対応する詳細情報を探す
        const itemDetail = itemsDetails.find((detail: any) => 
          detail.name === orderItem.name && 
          detail.quantity === orderItem.quantity
        );
        
        // 詳細情報があれば追加
        if (itemDetail) {
          return {
            ...orderItem,
            image: itemDetail.image || undefined,
            size: itemDetail.size || undefined
          };
        }
        
        return orderItem;
      });
      
      console.log('注文データを作成します:', customerName, customerEmail)
      
      // 注文データを作成
      const orderData = {
        customer: customerName,
        email: customerEmail,
        phone: customerPhone,
        total: session.amount_total ? session.amount_total: 0, // 単位は円
        items: orderItems,
        address: {
          postalCode: shippingInfo.postalCode || '',
          prefecture: shippingInfo.prefecture || '',
          city: shippingInfo.city || '',
          line1: shippingInfo.line1 || '',
          line2: shippingInfo.line2 || '',
        },
        paymentMethod: metadata.paymentMethod || 'クレジットカード',
      }
      
      try {
        // 注文データをFirestoreに保存
        console.log('Firestoreに注文を保存します')
        const result = await addOrder(orderData)
        console.log('注文保存成功:', result)
      } catch (saveError) {
        console.error('注文保存エラー:', saveError)
      }
      
      return NextResponse.json({ received: true })
    }
    
    // payment_intent.succeededイベントも処理するなら追加
    if (event.type === 'payment_intent.succeeded') {
      console.log('payment_intent.succeededイベントを受信しました')
      // 必要に応じて処理を追加
    }
    
    // その他のイベントは単に受信確認を返す
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed.' },
      { status: 500 }
    )
  }
}
