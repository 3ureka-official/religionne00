import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/services/stripeService';
import { addOrder, Order, OrderItem } from '@/firebase/orderService';
import { Timestamp } from 'firebase/firestore';
import { OrderData } from '@/types/Storage';
// 商品情報の型
type Item = {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

// 顧客情報の型
interface CustomerInfo {
  name: string;
  phone?: string;
  postalCode: string;
  address: string; // 分割前の住所
  prefecture?: string;
  city?: string;
  line1?: string; // 分割後の住所1
  line2?: string; // 分割後の住所2 (建物名など)
  building?: string;
}

// 支払い方法の型
interface PaymentMethodDetails {
  paymentMethod: string; // 'cod', 'stripe_credit_card', 'stripe_paypay' など
  total: number;
}

// リクエストボディの型
interface CheckoutRequestBody {
  items: Item[];
  customerEmail: string;
  shippingFee: number;
  paymentMethod: PaymentMethodDetails;
  customerInfo: CustomerInfo;
}

// 住所情報を分割・整形する関数
const formatAddress = (customerInfo: CustomerInfo) => {
  const addressParts = customerInfo.address.split(/[\\s、,]+/); // 全角・半角スペース、読点、コンマで分割
  const prefecture = customerInfo.prefecture || addressParts[0] || '';
  const city = customerInfo.city || addressParts[1] || '';
  // 分割後の残りをline1とする。buildingがあればline2に。
  const remainingAddressParts = addressParts.slice(2);
  const line1 = customerInfo.line1 || remainingAddressParts.join(' ') || '';
  const line2 = customerInfo.line2 || customerInfo.building || '';

  return {
    postalCode: customerInfo.postalCode || '',
    prefecture,
    city,
    line1,
    line2,
  };
};

// Stripe用の支払い方法タイプを取得するヘルパー関数
const getStripePaymentMethodType = (paymentMethodString: string): "credit" | "paypay" | undefined => {
  if (paymentMethodString === 'stripe_credit_card') {
    return 'credit';
  }
  if (paymentMethodString === 'stripe_paypay') {
    return 'paypay';
  }
  return undefined; // サポート外の場合は undefined
};

export async function POST(request: Request) {
  try {
    const body: OrderData = await request.json();
    const { items, customer, email, phone, total, shippingFee, address, paymentMethod } = body;

    console.log(body)
    
    // paymentMethod と paymentMethod.paymentMethod の存在チェック
    if (!paymentMethod || typeof paymentMethod !== 'string') {
      console.error('Invalid paymentMethod received:', paymentMethod);
      return NextResponse.json(
        { error: '支払い方法情報が正しくありません。' },
        { status: 400 }
      );
    }

    // const formattedAddressInfo = formatAddress(address);

    const formattedItems: OrderItem[] = items.map((item: OrderItem) => ({
      productId: item.productId,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || '',
      size: item.size || ''
    }));

    const baseOrderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
      customer: customer,
      email: email,
      phone: phone || '',
      total: Number(total) || 0,
      shippingFee: Number(shippingFee) || 0,
      items: formattedItems,
      address: address,
      paymentMethod: paymentMethod,
      date: Timestamp.now(),
    };

    if (paymentMethod === 'cod') {
      console.log('代金引換処理を開始します');
      const finalOrderDataForCod: Order = {
        ...baseOrderData,
        status: 'processing',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const orderId = await addOrder(finalOrderDataForCod);
      console.log('代金引換注文保存成功:', orderId);
      return NextResponse.json({ success: true, orderId: orderId, paymentType: 'cod' });

    } else if (paymentMethod.startsWith('stripe_')) {
      console.log('Stripe決済処理を開始します:', paymentMethod);
      const preliminaryOrderData: Order = {
        ...baseOrderData,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const orderId = await addOrder(preliminaryOrderData);
      console.log('Stripe仮注文保存成功:', orderId);

      const stripePaymentType = getStripePaymentMethodType(paymentMethod);
      if (!stripePaymentType) {
        console.error('未対応のStripe支払い方法です:', paymentMethod);
        return NextResponse.json(
          { error: '未対応のStripe支払い方法です。' },
          { status: 400 }
        );
      }

      const customerDetailsForStripe = {
        name: customer,
        phone: phone || '',
        postalCode: address.postalCode,
        prefecture: address.prefecture,
        city: address.city,
        line1: address.line1,
        line2: address.line2,
        address: address.line1,
      };

      const checkoutUrl = await createCheckoutSession(
        formattedItems,
        email,
        Number(shippingFee),
        stripePaymentType,
        customerDetailsForStripe,
        orderId
      );
      return NextResponse.json({ url: checkoutUrl, paymentType: 'stripe' });

    } else {
      console.error('未対応の支払い方法です:', paymentMethod);
      return NextResponse.json(
        { error: '未対応の支払い方法です。' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Checkout API error:', error);
    const errorMessage = error instanceof Error ? error.message : '決済処理の準備中にエラーが発生しました。';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 