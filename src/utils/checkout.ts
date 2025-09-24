import { OrderItem } from '@/firebase/orderService'

// 住所を組み立てる関数
export const buildFullAddress = (customerInfo: {
  prefecture: string
  city: string
  address: string
  building?: string
}): string => {
  const { prefecture, city, address, building } = customerInfo
  return `${prefecture}${city}${address}${building ? ` ${building}` : ''}`
}

// 注文アイテムを作成する関数
export const createOrderItems = (items: any[]): OrderItem[] => {
  return items.map(item => ({
    productId: item.id || '',
    name: item.name,
    price: Number(item.price.replace(/,/g, '') || 0),
    quantity: item.quantity,
    image: item.image,
    size: item.size
  }))
}

// 住所情報を分割する関数
export const parseAddress = (address: string) => {
  const addressParts = address.split(/[,、\s]+/)
  return {
    prefecture: addressParts[0] || '',
    city: addressParts[1] || '',
    line1: addressParts.slice(2).join(' ') || '',
    line2: ''
  }
}

// 送料を計算する関数
export const calculateShippingFee = (
  itemCount: number,
  isIslandAddress: boolean,
  settings: {
    freeLowerLimit: number
    islandFee: number
    nationwideFee: number
  }
): number => {
  if (itemCount >= settings.freeLowerLimit) {
    return 0
  }
  return isIslandAddress ? Number(settings.islandFee) : Number(settings.nationwideFee)
}

// 支払い方法のラベルを取得する関数
export const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'cod': return '代引き'
    case 'credit': return 'クレジットカード'
    case 'paypay': return 'PayPay'
    default: return 'クレジットカード'
  }
} 