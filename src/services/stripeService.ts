import Stripe from 'stripe';

// Stripeの初期化 - 環境変数チェックとエラーハンドリング強化
let stripe: Stripe;

try {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    console.error('⚠️ STRIPE_SECRET_KEY環境変数が設定されていません。Stripe機能は動作しません。');
    // ダミーのStripeインスタンスをより安全に作成
    stripe = {
      products: {
        create: () => { 
          throw new Error('STRIPE_SECRET_KEYが設定されていないため、Stripe APIを使用できません。');
        },
        update: () => {
          throw new Error('STRIPE_SECRET_KEYが設定されていないため、Stripe APIを使用できません。');
        },
        retrieve: () => {
          throw new Error('STRIPE_SECRET_KEYが設定されていないため、Stripe APIを使用できません。');
        }
      },
      prices: {
        create: () => {
          throw new Error('STRIPE_SECRET_KEYが設定されていないため、Stripe APIを使用できません。');
        },
        update: () => {
          throw new Error('STRIPE_SECRET_KEYが設定されていないため、Stripe APIを使用できません。');
        },
        retrieve: () => {
          throw new Error('STRIPE_SECRET_KEYが設定されていないため、Stripe APIを使用できません。');
        }
      },
      checkout: {
        sessions: {
          create: () => {
            throw new Error('STRIPE_SECRET_KEYが設定されていないため、Stripe APIを使用できません。');
          },
          listLineItems: () => {
            throw new Error('STRIPE_SECRET_KEYが設定されていないため、Stripe APIを使用できません。');
          }
        }
      },
      webhooks: {
        constructEvent: () => {
          throw new Error('STRIPE_SECRET_KEYが設定されていないため、Stripe APIを使用できません。');
        }
      }
    } as unknown as Stripe;
  } else {
    stripe = new Stripe(stripeKey);
    console.log('✅ Stripeが正常に初期化されました');
  }
} catch (error) {
  console.error('❌ Stripeの初期化に失敗しました:', error);
  // エラー時のフォールバック - 明確なエラーメッセージを投げるモックを作成
  stripe = {
    products: {
      create: () => { 
        throw new Error('Stripeの初期化に失敗したため、Stripe APIを使用できません。');
      },
      // その他のメソッドも同様に定義
    }
  } as unknown as Stripe;
}

/**
 * Stripe上に商品を作成する
 * @param name 商品名
 * @param description 商品説明
 * @param images 商品画像URL配列
 * @returns 作成された商品オブジェクト
 */
export const createStripeProduct = async (
  name: string,
  description: string,
  images: string[]
): Promise<Stripe.Product> => {
  try {
    const product = await stripe.products.create({
      name,
      description,
      images,
      active: true, // 商品を有効化
    });
    
    return product;
  } catch (error) {
    console.error('Failed to create Stripe product:', error);
    throw error;
  }
};

/**
 * Stripe上に価格を作成する
 * @param productId Stripe製品ID
 * @param unitAmount 単価（円）
 * @returns 作成された価格オブジェクト
 */
export const createStripePrice = async (
  productId: string,
  unitAmount: number
): Promise<Stripe.Price> => {
  try {
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: unitAmount, // 金額は小数点なしの整数で指定（例: 1000円の場合は1000）
      currency: 'jpy',
      active: true,
    });
    
    return price;
  } catch (error) {
    console.error('Failed to create Stripe price:', error);
    throw error;
  }
};

/**
 * Stripeの商品と価格を一度に作成する
 * @param name 商品名
 * @param description 商品説明
 * @param images 商品画像URL配列
 * @param unitAmount 単価（円）
 * @returns 作成された製品IDと価格ID
 */
export const createStripeProductWithPrice = async (
  name: string,
  description: string,
  images: string[],
  unitAmount: number
): Promise<{ productId: string; priceId: string }> => {
  try {
    // 1. 商品を作成
    const product = await createStripeProduct(name, description, images);
    
    // 2. 価格を作成
    const price = await createStripePrice(product.id, unitAmount);
    
    return {
      productId: product.id,
      priceId: price.id,
    };
  } catch (error) {
    console.error('Failed to create Stripe product with price:', error);
    throw error;
  }
};

/**
 * Stripe上の商品を取得する
 * @param productId 製品ID
 * @returns 商品オブジェクト
 */
export const getStripeProduct = async (productId: string): Promise<Stripe.Product> => {
  try {
    const product = await stripe.products.retrieve(productId);
    return product;
  } catch (error) {
    console.error(`Failed to retrieve product ${productId}:`, error);
    throw error;
  }
};

/**
 * Stripe上の価格を取得する
 * @param priceId 価格ID
 * @returns 価格オブジェクト
 */
export const getStripePrice = async (priceId: string): Promise<Stripe.Price> => {
  try {
    const price = await stripe.prices.retrieve(priceId);
    return price;
  } catch (error) {
    console.error(`Failed to retrieve price ${priceId}:`, error);
    throw error;
  }
};

/**
 * 製品を更新する
 * @param productId 製品ID
 * @param updateData 更新データ
 * @returns 更新された商品
 */
export const updateStripeProduct = async (
  productId: string,
  updateData: Partial<{
    name: string;
    description: string;
    images: string[];
    active: boolean;
  }>
): Promise<Stripe.Product> => {
  try {
    const product = await stripe.products.update(productId, updateData);
    return product;
  } catch (error) {
    console.error(`Failed to update product ${productId}:`, error);
    throw error;
  }
};

/**
 * 既存の価格を無効化し、新しい価格を作成する
 * (Stripeでは価格の直接更新はできないため)
 * @param productId 製品ID
 * @param oldPriceId 古い価格ID
 * @param newUnitAmount 新しい単価
 * @returns 新しい価格オブジェクト
 */
export const updateStripePrice = async (
  productId: string,
  oldPriceId: string,
  newUnitAmount: number
): Promise<Stripe.Price> => {
  try {
    // 1. 古い価格を無効化
    await stripe.prices.update(oldPriceId, {
      active: false,
    });
    
    // 2. 新しい価格を作成
    const newPrice = await createStripePrice(productId, newUnitAmount);
    
    return newPrice;
  } catch (error) {
    console.error(`Failed to update price for product ${productId}:`, error);
    throw error;
  }
};

/**
 * Stripeのチェックアウトセッションを作成する
 * @param items 商品アイテムの配列
 * @param customerEmail 顧客のメールアドレス
 * @param shippingFee 送料
 * @param paymentMethod 支払い方法（creditまたはpaypay）
 * @param customerInfo 顧客情報
 * @returns チェックアウトセッションURL
 */
export const createCheckoutSession = async (
  items: Array<{
    name: string;
    description?: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
  }>,
  customerEmail: string,
  shippingFee: number,
  paymentMethod: 'credit' | 'paypay',
  customerInfo: {
    name: string;
    phone: string;
    postalCode: string;
    address: string;
    prefecture: string;
    city: string;
    line1: string;
    line2?: string;
  },
  id: string
): Promise<string> => {
  try {

    // 各アイテムを一時的な商品として登録
    const lineItems = await Promise.all(
      items.map(async (item) => {
        // 商品説明がない場合はundefinedとして渡す（空文字は避ける）
        const productDescription = item.description && item.description.trim() !== '' 
          ? item.description 
          : undefined;

        // 一時的な商品を作成
        const product = await stripe.products.create({
          name: item.name,
          description: productDescription,
          images: item.image ? [item.image] : [],
        });

        // 価格を作成
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: item.price, // 単価
          currency: 'jpy',
        });

        // line_itemsの形式で返す
        return {
          price: price.id,
          quantity: item.quantity,
        };
      })
    );

    // 送料を追加（送料がある場合）
    if (shippingFee > 0) {
      const shippingProduct = await stripe.products.create({
        name: '送料',
        description: '配送料金',
      });

      const shippingPrice = await stripe.prices.create({
        product: shippingProduct.id,
        unit_amount: shippingFee,
        currency: 'jpy',
      });

      lineItems.push({
        price: shippingPrice.id,
        quantity: 1,
      });
    }

    // 支払い方法の設定
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [];
    if (paymentMethod === 'credit') {
      paymentMethodTypes.push('card');
    } else if (paymentMethod === 'paypay') {
      // PayPayの場合は必要に応じて設定
      // 注: Stripeの日本向けサービスでは対応していない可能性があります
      paymentMethodTypes.push('card');
    }

    const metadata = {
      id: id
    }

    // チェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
      customer_email: customerEmail,
      metadata: metadata
    });

    // セッションURLを返す
    return session.url || '';
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    throw error;
  }
}; 