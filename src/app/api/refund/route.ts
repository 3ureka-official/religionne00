import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getOrderById, updateOrderRefund } from '@/firebase/orderService'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(request: Request) {
  try {
    const { orderId, amount } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: '注文IDが必要です' },
        { status: 400 }
      )
    }
    
    // 注文データを取得
    const order = await getOrderById(orderId)
    
    if (!order) {
      return NextResponse.json(
        { error: '注文が見つかりません' },
        { status: 404 }
      )
    }
    
    // 既に返金済みの場合は返金不可
    if (order.status === 'refunded' || order.refundedAmount) {
      return NextResponse.json(
        { error: 'この注文は既に返金済みです' },
        { status: 400 }
      )
    }
    
    // 返金額を決定（amountが指定されていない場合は全額返金）
    const refundAmount = amount ? Math.min(amount, order.total) : order.total
    
    // 代引き決済の場合はStripe APIを呼ばずに直接返金処理
    if (order.paymentMethod === 'cod') {
      // 返金情報を注文データに保存
      await updateOrderRefund(orderId, refundAmount, 'refunded')
      
      return NextResponse.json({
        success: true,
        refundAmount,
        message: '返金が完了しました（代引き決済）'
      })
    }
    
    // Stripe決済（credit、paypay）の場合
    if (order.paymentMethod !== 'credit' && order.paymentMethod !== 'paypay') {
      return NextResponse.json(
        { error: 'この決済方法は返金に対応していません' },
        { status: 400 }
      )
    }
    
    // PaymentIntent IDがない場合は返金不可
    if (!order.paymentIntentId) {
      return NextResponse.json(
        { error: '決済情報が見つかりません' },
        { status: 400 }
      )
    }
    
    // Stripeで返金を実行
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: refundAmount, // 金額は最小単位（JPYの場合は円単位）
      reason: 'requested_by_customer',
    })
    
    // 返金情報を注文データに保存
    await updateOrderRefund(orderId, refundAmount, 'refunded')
    
    return NextResponse.json({
      success: true,
      refundId: refund.id,
      refundAmount,
      message: '返金が完了しました'
    })
  } catch (error) {
    console.error('Refund error:', error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `返金エラー: ${error.message}` },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '返金処理中にエラーが発生しました' },
      { status: 500 }
    )
  }
}

