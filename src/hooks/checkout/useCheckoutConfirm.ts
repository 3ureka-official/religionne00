import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/features/cart/components/CartContext'
import { addOrder } from '@/firebase/orderService'
import { OrderData } from '@/types/Storage'
import { CheckoutOrderInfo, CheckoutPaymentInfo } from '@/types/checkout'
import { buildFullAddress, createOrderItems, parseAddress } from '@/utils/checkout'

export const useCheckoutConfirm = () => {
  const { items, getTotalPrice } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderInfo, setOrderInfo] = useState<CheckoutOrderInfo>({
    name: '',
    postalCode: '',
    address: '',
    email: '',
    phone: '',
    paymentMethod: '',
    isIslandAddress: false
  })
  const [paymentInfo, setPaymentInfo] = useState<CheckoutPaymentInfo | null>(null)

  // セッションストレージから注文情報を取得
  useEffect(() => {
    const storedOrderInfo = sessionStorage.getItem('orderInfo')
    const storedPaymentInfo = sessionStorage.getItem('paymentInfo')

    if (storedOrderInfo) {
      const parsedOrderInfo = JSON.parse(storedOrderInfo)
      setOrderInfo({
        name: `${parsedOrderInfo.customerInfo.lastName} ${parsedOrderInfo.customerInfo.firstName}`,
        postalCode: parsedOrderInfo.customerInfo.postalCode,
        address: buildFullAddress(parsedOrderInfo.customerInfo),
        email: parsedOrderInfo.customerInfo.email,
        phone: parsedOrderInfo.customerInfo.phone,
        paymentMethod: parsedOrderInfo.paymentMethod,
        isIslandAddress: parsedOrderInfo.isIslandAddress
      })
    } else {
      router.push('/checkout')
    }

    if (storedPaymentInfo) {
      setPaymentInfo(JSON.parse(storedPaymentInfo))
    }
  }, [router])

  // カート内に商品がない場合はトップページへリダイレクト
  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items, router])

  const handleCompleteOrder = async (shippingFee: number, total: number) => {
    if (orderInfo.paymentMethod === 'cod') {
      await handleCompleteCodOrder(orderInfo, items, total, shippingFee, setIsProcessing, router)
    } else {
      await handleStripeCheckout(orderInfo, items, paymentInfo, total, shippingFee, setIsProcessing)
    }
  }

  return {
    items,
    orderInfo,
    paymentInfo,
    isProcessing,
    subtotal: getTotalPrice(),
    handleCompleteOrder
  }
}



// 代引き注文完了処理
const handleCompleteCodOrder = async (
  orderInfo: CheckoutOrderInfo,
  items: any[],
  total: number,
  shippingFee: number,
  setIsProcessing: (value: boolean) => void,
  router: any
) => {
  try {
    setIsProcessing(true)
    
    const orderItems = createOrderItems(items)
    const addressInfo = parseAddress(orderInfo.address)
    
    const orderData: OrderData = {
      customer: orderInfo.name,
      email: orderInfo.email,
      phone: orderInfo.phone,
      total,
      shippingFee,
      items: orderItems,
      address: {
        postalCode: orderInfo.postalCode,
        ...addressInfo
      },
      paymentMethod: 'cod'
    }
    
    await addOrder(orderData)
    router.push('/checkout/complete')
  } catch (error) {
    console.error('注文処理中にエラーが発生しました:', error)
    alert('注文処理中にエラーが発生しました。もう一度お試しください。')
  } finally {
    setIsProcessing(false)
  }
}

// Stripe決済処理
const handleStripeCheckout = async (
  orderInfo: CheckoutOrderInfo,
  items: any[],
  paymentInfo: CheckoutPaymentInfo | null,
  total: number,
  shippingFee: number,
  setIsProcessing: (value: boolean) => void
) => {
  if (!paymentInfo) return
  
  try {
    setIsProcessing(true)
    
    const orderItems = createOrderItems(items)
    const addressInfo = parseAddress(orderInfo.address)
    
    const orderData: OrderData = {
      customer: orderInfo.name,
      email: orderInfo.email,
      phone: orderInfo.phone,
      total,
      shippingFee,
      items: orderItems,
      address: {
        postalCode: orderInfo.postalCode,
        ...addressInfo
      },
      paymentMethod: 'credit'
    }
    
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    
    if (!response.ok) {
      throw new Error('決済処理の準備に失敗しました')
    }
    
    const result = await response.json()
    
    if (result.url) {
      // カート情報をセッションストレージに保存
      const cartInfo = {
        items: paymentInfo.items,
        subtotal: total - shippingFee,
        shippingFee,
        total
      }
      sessionStorage.setItem('cartInfo', JSON.stringify(cartInfo))
      window.location.href = result.url
    } else {
      throw new Error('決済URLが取得できませんでした')
    }
  } catch (error) {
    console.error('決済ページへの遷移に失敗しました:', error)
    alert('決済処理の準備中にエラーが発生しました。もう一度お試しいただくか、代引きをご利用ください。')
  } finally {
    setIsProcessing(false)
  }
} 