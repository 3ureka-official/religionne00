// チェックアウト確認画面用の注文情報
export interface CheckoutOrderInfo {
  name: string
  postalCode: string
  address: string
  email: string
  phone: string
  paymentMethod: string
  isIslandAddress: boolean
}

// チェックアウト確認画面用の支払い情報
export interface CheckoutPaymentInfo {
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    size: string
  }[]
  subtotal: number
  shippingFee: number
  total: number
}

// チェックアウト用の商品アイテム（OrderSummary用）
export interface CheckoutOrderItem {
  id: string
  name: string
  price: string | number
  quantity: number
  image: string
  size?: string
}

// 顧客情報（CustomerInfo用）
export interface CheckoutCustomerInfo {
  name: string
  postalCode: string
  address: string
  email: string
  phone: string
}

// 価格内訳（PricingBreakdown用）
export interface CheckoutPricing {
  subtotal: number
  shippingFee: number
  total: number
  paymentMethod: string
} 