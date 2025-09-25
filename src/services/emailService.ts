import { Resend } from 'resend';
import { OrderData } from '@/types/Storage';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  orderData: OrderData;
  orderId: string;
}

// 環境に応じた送信者アドレスを取得
const getFromEmail = () => {
  // 本番環境（NODE_ENV=production または VERCEL_ENV=production）
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return process.env.FROM_EMAIL || 'noreply@yourdomain.com';
  } else {
    // 開発・プレビュー環境ではResendのテスト用アドレスを使用
    return 'onboarding@resend.dev';
  }
};

const getAdminEmail = () => {
  // 本番環境
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
  } else {
    // 開発・プレビュー環境では開発者のメールアドレスを使用
    return process.env.DEV_ADMIN_EMAIL || 'your-email@gmail.com';
  }
};

// 環境情報をログ出力
const logEnvironmentInfo = () => {
  console.log('Email Service Environment Info:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    fromEmail: getFromEmail(),
    adminEmail: getAdminEmail(),
    hasResendKey: !!process.env.RESEND_API_KEY,
  });
};

export const sendOrderConfirmationEmail = async ({ orderData, orderId }: EmailData) => {
  try {
    logEnvironmentInfo();
    console.log(`Attempting to send email to: ${orderData.email} for order: ${orderId}`);
    
    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: orderData.email,
      subject: `ご注文確認 - 注文番号: ${orderId}`,
      html: generateOrderEmailHTML(orderData, orderId),
    });

    if (error) {
      console.error('Email sending failed:', {
        orderId,
        email: orderData.email,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }

    console.log('Email sent successfully:', {
      orderId,
      email: orderData.email,
      messageId: data?.id,
      timestamp: new Date().toISOString(),
    });

    return data;
  } catch (error) {
    console.error('Detailed email error:', {
      orderId,
      email: orderData.email,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

export const sendAdminNotificationEmail = async ({ orderData, orderId }: EmailData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: getAdminEmail(),
      subject: `新しい注文 - 注文番号: ${orderId}`,
      html: generateAdminEmailHTML(orderData, orderId),
    });

    if (error) {
      console.error('Admin notification email error:', error);
      throw error;
    }

    console.log('Admin notification email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    throw error;
  }
};

const generateOrderEmailHTML = (orderData: OrderData, orderId: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ご注文確認</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 18px;">ご注文いただきありがとうございます。</h2>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>注文番号: </span> 
            <span>${orderId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>お客様名: </span> 
            <span>${orderData.customer}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>メールアドレス: </span> 
            <span>${orderData.email}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>注文日時: </span> 
            <span>${new Date().toLocaleString('ja-JP')}</span>
          </div>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">注文内容</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">商品名</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">数量</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">価格</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items.map(item => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${item.name}${item.size ? ` (${item.size})` : ''}</td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">${item.quantity}</td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;">¥${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #dee2e6;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>小計:</span>
              <span>¥${(orderData.total - orderData.shippingFee).toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>送料:</span>
              <span>¥${orderData.shippingFee.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: #2c3e50;">
              <span>合計:</span>
              <span>¥${orderData.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">お支払い・配送情報</h3>
          <p><strong>お支払い方法:</strong> ${orderData.paymentMethod === 'credit' ? 'クレジットカード' : '代金引換'}</p>
          
          <h4 style="color: #2c3e50; margin-top: 20px; margin-bottom: 10px;">配送先</h4>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
            <p style="margin: 0;">〒${orderData.address.postalCode}</p>
            <p style="margin: 5px 0 0 0;">${orderData.address.prefecture}${orderData.address.city}${orderData.address.line1}</p>
            ${orderData.address.line2 ? `<p style="margin: 5px 0 0 0;">${orderData.address.line2}</p>` : ''}
          </div>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
          <p style="margin: 0; color: #1565c0; font-size: 14px;">
            商品の発送準備が整い次第、改めて発送メールをお送りいたします。<br>
            ご質問がございましたら、${process.env.FROM_EMAIL || 'noreply@yourdomain.com'}までお問い合わせください。
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAdminEmailHTML = (orderData: OrderData, orderId: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>新しい注文</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="margin-bottom: 20px; font-size: 18px;">新しい注文が入りました。</h2>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>注文番号:</strong> ${orderId}</p>
          <p><strong>注文日時:</strong> ${new Date().toLocaleString('ja-JP')}</p>
          <p><strong>合計金額:</strong> ¥${orderData.total.toLocaleString()}</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">お客様情報</h3>
          <p><strong>お名前:</strong> ${orderData.customer}</p>
          <p><strong>メールアドレス:</strong> ${orderData.email}</p>
          <p><strong>電話番号:</strong> ${orderData.phone}</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">配送先</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
            <p style="margin: 0;">〒${orderData.address.postalCode}</p>
            <p style="margin: 5px 0 0 0;">${orderData.address.prefecture}${orderData.address.city}${orderData.address.line1}</p>
            ${orderData.address.line2 ? `<p style="margin: 5px 0 0 0;">${orderData.address.line2}</p>` : ''}
          </div>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">注文内容</h3>
          <ul style="padding-left: 20px;">
            ${orderData.items.map(item => `
              <li style="margin-bottom: 8px;">
                ${item.name}${item.size ? ` (${item.size})` : ''} - 数量: ${item.quantity} - ¥${(item.price * item.quantity).toLocaleString()}
              </li>
            `).join('')}
          </ul>
          
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
            <p><strong>送料:</strong> ¥${orderData.shippingFee.toLocaleString()}</p>
            <p><strong>お支払い方法:</strong> ${orderData.paymentMethod === 'credit' ? 'クレジットカード' : '代金引換'}</p>
            <p style="font-size: 18px; font-weight: bold; color: #28a745;"><strong>合計:</strong> ¥${orderData.total.toLocaleString()}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" 
             style="background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            管理画面で詳細を確認
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
};