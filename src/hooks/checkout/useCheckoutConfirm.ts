import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/features/cart/components/CartContext'
import { addOrder } from '@/firebase/orderService' // 復活
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

// 代引き処理（元に戻す）
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
    
    // 直接Firebaseに保存
    await addOrder(orderData, 'processing')
    router.push('/checkout/complete')
  } catch (error) {
    console.error('注文処理中にエラーが発生しました:', error)
    alert('注文処理中にエラーが発生しました。もう一度お試しください。')
  } finally {
    setIsProcessing(false)
  }
}

// Stripe処理（修正版）
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
    
    // 1. まず注文をFirebaseに作成
    const orderId = await addOrder(orderData, 'pending')
    console.log('注文作成完了:', orderId)
    
    // 2. Stripe Checkout Sessionを作成
    const stripe = await import('@stripe/stripe-js').then(m => 
      m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    )
    
    if (!stripe) throw new Error('Stripe初期化に失敗しました')
    
    // 3. サーバーサイドでCheckout Session作成（シンプルなAPI）
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderItems,
        email: orderInfo.email,
        shippingFee,
        orderId
      })
    })
    
    const { sessionId } = await response.json()
    
    // 4. Stripeページへリダイレクト
    await stripe.redirectToCheckout({ sessionId })
    
  } catch (error) {
    console.error('決済処理エラー:', error)
    alert('決済処理の準備中にエラーが発生しました。')
  } finally {
    setIsProcessing(false)
  }
}