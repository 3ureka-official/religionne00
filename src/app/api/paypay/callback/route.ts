import { NextResponse } from 'next/server';
import { getPayPayPaymentDetails } from '@/services/paypayService';
import { updateOrderStatus } from '@/firebase/orderService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paypay_payment_id');
    const orderId = searchParams.get('order_id');

    if (!paymentId || !orderId) {
      console.error('Missing payment ID or order ID in callback');
      return NextResponse.json(
        { error: '決済IDまたは注文IDが見つかりません' },
        { status: 400 }
      );
    }

    console.log('PayPay callback received:', { paymentId, orderId });

    // PayPayの決済状況を確認
    const paymentResponse = await getPayPayPaymentDetails(paymentId);
    const paymentDetails = paymentResponse.BODY.data;
    
    console.log('PayPay payment details:', paymentDetails);

    // 決済が成功している場合、注文ステータスを更新
    if (paymentDetails.status === 'COMPLETED') {
      await updateOrderStatus(orderId, 'processing');
      console.log(`Order ${orderId} status updated to 'processing' after PayPay payment`);
      
      return NextResponse.json({ 
        success: true, 
        message: 'PayPay決済が完了しました',
        orderId: orderId 
      });
    } else {
      console.error('PayPay payment not completed:', paymentDetails);
      return NextResponse.json(
        { error: 'PayPay決済が完了していません' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('PayPay callback API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'PayPay決済の確認中にエラーが発生しました。';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
} 