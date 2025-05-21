import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/services/stripeService';

// メールアドレスのバリデーション関数
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// 日本の電話番号バリデーション関数
const isValidJapanesePhoneNumber = (phone: string): boolean => {
  // 入力がない場合はfalseを返す
  if (!phone) return false;
  
  // ハイフンなしでの入力が前提
  // 数字のみであることを確認
  if (!/^\d+$/.test(phone)) {
    return false;
  }
  
  // 先頭が0で、10桁または11桁であることを確認
  return /^0\d{9,10}$/.test(phone);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerEmail, shippingFee, paymentMethod, customerInfo } = body;

    // バリデーション
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: '商品情報が正しくありません。' },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'メールアドレスが必要です。' },
        { status: 400 }
      );
    }

    // メールアドレスのバリデーション
    if (!isValidEmail(customerEmail)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください。' },
        { status: 400 }
      );
    }

    if (paymentMethod !== 'credit' && paymentMethod !== 'paypay') {
      return NextResponse.json(
        { error: '支払い方法が正しくありません。' },
        { status: 400 }
      );
    }

    // 顧客情報のバリデーション
    if (!customerInfo || !customerInfo.name || !customerInfo.postalCode || !customerInfo.address) {
      return NextResponse.json(
        { error: '顧客情報が不足しています。' },
        { status: 400 }
      );
    }

    // 電話番号のバリデーション（入力されている場合のみ）
    if (customerInfo.phone && !isValidJapanesePhoneNumber(customerInfo.phone)) {
      return NextResponse.json(
        { error: '有効な日本の電話番号を入力してください。' },
        { status: 400 }
      );
    }

    // 配送先情報の構築
    const addressParts = customerInfo.address.split(/[,、\s]+/);
    const prefecture = customerInfo.prefecture || addressParts[0] || '';
    const city = customerInfo.city || addressParts[1] || '';
    const remainingAddress = addressParts.slice(2).join(' ') || '';

    // 配送先情報を整形
    const formattedCustomerInfo = {
      name: customerInfo.name,
      phone: customerInfo.phone || '',
      postalCode: customerInfo.postalCode,
      address: customerInfo.address,
      prefecture: prefecture,
      city: city,
      line1: remainingAddress,
      line2: customerInfo.building || '',
    };

    // 商品情報を整形
    const formattedItems = items.map((item: any) => ({
      name: item.name,
      description: item.description && item.description.trim() !== '' ? item.description : undefined,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || '',
      size: item.size || ''
    }));

    // Stripeチェックアウトセッション作成
    const checkoutUrl = await createCheckoutSession(
      formattedItems,
      customerEmail,
      Number(shippingFee),
      paymentMethod,
      formattedCustomerInfo
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: '決済処理の準備中にエラーが発生しました。' },
      { status: 500 }
    );
  }
} 