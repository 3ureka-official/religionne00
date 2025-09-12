import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/services/stripeService';
import { addOrder, Order, OrderItem } from '@/firebase/orderService';
import { Timestamp } from 'firebase/firestore';
import { OrderData } from '@/types/Storage';

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

    } else if (paymentMethod === 'stripe_credit_card') {
      console.log('Stripe決済処理を開始します:', paymentMethod);
      const preliminaryOrderData: Order = {
        ...baseOrderData,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const orderId = await addOrder(preliminaryOrderData, 'pending');
      console.log('Stripe仮注文保存成功:', orderId);

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
        'credit',
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