import { NextRequest, NextResponse } from 'next/server';
import { sendShippingNotificationEmail } from '@/services/emailService';
import { getOrderById } from '@/firebase/orderService';

export async function POST(request: NextRequest) {
  try {
    const { orderId }: { orderId: string } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('Shipping email API called for order:', orderId);
    
    // Firebaseから注文情報を取得
    const order = await getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // 注文データをEmailData形式に変換
    const orderData = {
      customer: order.customer,
      email: order.email,
      phone: order.phone || '', // undefinedの場合は空文字列
      total: order.total,
      shippingFee: order.shippingFee,
      items: order.items,
      address: {
        postalCode: order.address.postalCode,
        prefecture: order.address.prefecture,
        city: order.address.city,
        line1: order.address.line1,
        line2: order.address.line2 || '' // undefinedの場合は空文字列
      },
      paymentMethod: order.paymentMethod
    };

    // 配送完了通知メールを送信
    await sendShippingNotificationEmail({ orderData, orderId });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Shipping notification email sent successfully' 
    });
  } catch (error) {
    console.error('Shipping email sending error in API:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send shipping notification email' 
      },
      { status: 500 }
    );
  }
} 