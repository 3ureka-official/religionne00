import { v4 as uuidv4 } from 'uuid';

// PayPayのSDKをインポート
import PAYPAY from '@paypayopa/paypayopa-sdk-node';

// PayPayの設定
PAYPAY.Configure({
  clientId: process.env.PAYPAY_API_KEY || '',
  clientSecret: process.env.PAYPAY_API_SECRET || '',
  merchantId: process.env.PAYPAY_MERCHANT_ID || '',
  productionMode: process.env.PAYPAY_PRODUCTION_MODE === 'true'
});

// PayPayのレスポンス型を定義
interface PayPayResponse<T> {
  BODY: {
    resultInfo: {
      code: string;
      message: string;
      codeId: string;
    };
    data: T;
  };
  STATUS: number;
}

interface PayPayPaymentDetails {
  status: 'CREATED' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  acceptedAt?: number;
  merchantPaymentId: string;
  amount: {
    amount: number;
    currency: string;
  };
  requestedAt: number;
  expiresAt?: number;
  canceledAt?: number;
  refundedAt?: number;
  paymentId?: string;
  orderItems?: PayPayOrderItem[];
}

export interface PayPayOrderItem {
  name: string;
  category: string;
  quantity: number;
  productId: string;
  unitPrice: {
    amount: number;
    currency: string;
  };
}

export interface PayPayCreateOrderRequest {
  merchantPaymentId: string;
  amount: {
    amount: number;
    currency: string;
  };
  codeType: string;
  orderItems?: PayPayOrderItem[];
  redirectUrl: string;
  redirectType: string;
}

/**
 * PayPayの決済URLを作成する
 * @param items 商品アイテムの配列
 * @param totalAmount 合計金額
 * @param orderId 注文ID
 * @returns PayPayの決済URL
 */
export const createPayPayOrder = async (
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    productId: string;
  }>,
  totalAmount: number,
  orderId: string
): Promise<string> => {
  try {
    const paymentId = uuidv4();
    
    // PayPayの注文アイテム形式に変換
    const orderItems: PayPayOrderItem[] = items.map(item => ({
      name: item.name,
      category: 'CLOTHING', // カテゴリは固定値または商品に応じて設定
      quantity: item.quantity,
      productId: item.productId,
      unitPrice: {
        amount: item.price,
        currency: 'JPY'
      }
    }));

    const payload: PayPayCreateOrderRequest = {
      merchantPaymentId: paymentId,
      amount: {
        amount: totalAmount,
        currency: 'JPY'
      },
      codeType: 'ORDER_QR',
      orderItems: orderItems,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/complete?paypay_payment_id=${paymentId}&order_id=${orderId}`,
      redirectType: 'WEB_LINK',
    };

    console.log('PayPay payload:', payload);

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      PAYPAY.QRCodeCreate(payload, (response: any) => {
        if (response?.BODY?.data?.url) {
          console.log('PayPay URL created successfully:', response.BODY.data.url);
          resolve(response.BODY.data.url);
        } else {
          console.error('PayPay API error:', response);
          reject(new Error('PayPayの決済URLの作成に失敗しました'));
        }
      });
    });
  } catch (error) {
    console.error('PayPay order creation error:', error);
    throw new Error('PayPay決済の準備中にエラーが発生しました');
  }
};

/**
 * PayPayの決済状況を確認する
 * @param merchantPaymentId マーチャント決済ID
 * @returns 決済状況
 */
export const getPayPayPaymentDetails = async (merchantPaymentId: string): Promise<PayPayResponse<PayPayPaymentDetails>> => {
  try {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      PAYPAY.GetPaymentDetails([merchantPaymentId], (response: any) => {
        if (response?.BODY) {
          resolve(response as PayPayResponse<PayPayPaymentDetails>);
        } else {
          reject(new Error('PayPay決済状況の取得に失敗しました'));
        }
      });
    });
  } catch (error) {
    console.error('PayPay payment details error:', error);
    throw error;
  }
}; 