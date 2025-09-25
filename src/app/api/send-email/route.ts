import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '@/services/emailService';
import { OrderData } from '@/types/Storage';

export async function POST(request: NextRequest) {
  try {
    const { orderData, orderId }: { orderData: OrderData; orderId: string } = await request.json();
    
    console.log('Email API called for order:', orderId);
    
    // メール送信（並行処理）
    const emailPromises = [
      sendOrderConfirmationEmail({ orderData, orderId }),
      sendAdminNotificationEmail({ orderData, orderId })
    ];
    
    await Promise.all(emailPromises);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order confirmation emails sent successfully' 
    });
  } catch (error) {
    console.error('Email sending error in API:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send emails' 
      },
      { status: 500 }
    );
  }
}