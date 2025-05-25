import { NextResponse } from 'next/server';
import { createPayPayOrder } from '@/services/paypayService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, totalAmount, orderId } = body;

    console.log('PayPay create order request:', { items, totalAmount, orderId });

    // PayPayの決済URLを作成
    const paymentUrl = await createPayPayOrder(items, totalAmount, orderId);

    return NextResponse.json({ 
      success: true, 
      url: paymentUrl 
    });

  } catch (error) {
    console.error('PayPay create order API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'PayPay決済の準備中にエラーが発生しました。';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
} 