'use client'

import { Box, Container, Typography, Button, Divider, Paper, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useCart } from '@/features/cart/components/CartContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { addOrder } from '@/firebase/orderService'
import { OrderItem } from '@/firebase/orderService'
import { MicroCMSSettings } from '@/lib/microcms'


export default function CheckoutConfirmClient({settings}: {settings: MicroCMSSettings}) {
  const { items, getTotalPrice } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  
  // 注文情報（sessionStorageから取得）
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    postalCode: '',
    address: '',
    email: '',
    phone: '',
    paymentMethod: '',
    isIslandAddress: false
  })

  // paymentInfoの型
  type PaymentInfo = {
    items: {
      id: string;
      name: string;
      price: number;  
      quantity: number;
      image: string;
      size: string;
    }[];
    subtotal: number;
    shippingFee: number;
    total: number;
  }
  
  // 支払い情報（Stripe用、sessionStorageから取得）
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  
  // セッションストレージから注文情報を取得
  useEffect(() => {
    const storedOrderInfo = sessionStorage.getItem('orderInfo')
    const storedPaymentInfo = sessionStorage.getItem('paymentInfo')

    console.log(storedOrderInfo);
    
    if (storedOrderInfo) {
      const parsedOrderInfo = JSON.parse(storedOrderInfo);
      // 顧客情報をorderInfoに設定
      setOrderInfo({
        name: `${parsedOrderInfo.customerInfo.lastName} ${parsedOrderInfo.customerInfo.firstName}`,
        postalCode: parsedOrderInfo.customerInfo.postalCode,
        address: `${parsedOrderInfo.customerInfo.prefecture}${parsedOrderInfo.customerInfo.city}${parsedOrderInfo.customerInfo.address}${parsedOrderInfo.customerInfo.building ? ` ${parsedOrderInfo.customerInfo.building}` : ''}`,
        email: parsedOrderInfo.customerInfo.email,
        phone: parsedOrderInfo.customerInfo.phone,
        paymentMethod: parsedOrderInfo.paymentMethod,
        isIslandAddress: parsedOrderInfo.isIslandAddress
      });
    } else {
      // 注文情報がない場合はチェックアウトページにリダイレクト
      router.push('/checkout')
    }
    
    if (storedPaymentInfo) {
      setPaymentInfo(JSON.parse(storedPaymentInfo))
    }
  }, [router])
  
  // 小計金額
  const subtotal = getTotalPrice()
  // 送料
  const shippingFee = items.length >= settings.freeLowerLimit ? 0 : (orderInfo.isIslandAddress ? Number(settings.islandFee) : Number(settings.nationwideFee))

  // 合計金額
  const total = subtotal + shippingFee

  // 注文完了処理 - 代引きの場合
  const handleCompleteCodOrder = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // 注文アイテムの作成
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.id || '',
        name: item.name,
        price: Number(item.price.replace(/,/g, '') || 0),
        quantity: item.quantity,
        image: item.image,
        size: item.size
      }));
      
      // 住所情報の構築
      const addressParts = orderInfo.address.split(/[,、\s]+/);
      const prefecture = addressParts[0] || '';
      const city = addressParts[1] || '';
      const line1 = addressParts.slice(2).join(' ') || '';
      
      // 注文データの作成
      const orderData = {
        customer: orderInfo.name,
        email: orderInfo.email,
        phone: orderInfo.phone,
        total: total,
        shippingFee: shippingFee,
        items: orderItems,
        address: {
          postalCode: orderInfo.postalCode,
          prefecture,
          city,
          line1,
          line2: ''
        },
        paymentMethod: '代引き'
      };
      
      // 注文データをFirestoreに保存
      await addOrder(orderData);
      
      // // 完了ページへ遷移
      router.push('/checkout/complete');
    } catch (error) {
      console.error('注文処理中にエラーが発生しました:', error);
      alert('注文処理中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Stripe決済ページへ遷移する処理
  const handleStripeCheckout = async () => {
    if (isProcessing || !paymentInfo) return;
    
    try {
      setIsProcessing(true);

      console.log(paymentInfo);
      
      // Stripeチェックアウトセッション作成APIを呼び出し
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentInfo)
      });
      
      if (!response.ok) {
        throw new Error('決済処理の準備に失敗しました');
      }
      
      const result = await response.json();
      
      if (result.url) {
        // カート情報をセッションストレージに保存（成功時に復元するため）
        const cartInfo = {
          items: paymentInfo.items,
          subtotal,
          shippingFee,
          total
        };
        sessionStorage.setItem('cartInfo', JSON.stringify(cartInfo));
        
        // Stripeチェックアウトページにリダイレクト
        window.location.href = result.url;
      } else {
        throw new Error('決済URLが取得できませんでした');
      }
    } catch (error) {
      console.error('決済ページへの遷移に失敗しました:', error);
      alert('決済処理の準備中にエラーが発生しました。もう一度お試しいただくか、代引きをご利用ください。');
    } finally {
      setIsProcessing(false);
    }
  };

  // 注文確定処理
  const handleCompleteOrder = async () => {
    if (orderInfo.paymentMethod === 'cod') {
      // 代引きの場合はFirestoreに保存して完了ページへ
      await handleCompleteCodOrder();
    } else {
      // クレジットカードまたはPayPayの場合はStripe決済ページへ
      await handleStripeCheckout();
    }
  };

  // カート内に商品がない場合はトップページへリダイレクト
  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items, router])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF'
      }}
    >
      <Header />
      <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 4 }}>
        {/* ヘッダー */}
        <Box 
          sx={{ 
            color: 'black', 
            py: 2,
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            borderBottom: '1px solid black'
          }}
        >
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '16px', sm: '18px' },
              fontWeight: 500
            }}
          >
            ご注文内容の確認
          </Typography>
        </Box>

        {/* メインコンテンツ */}
        <Box sx={{ mb: 4 }}>
          {/* 注文内容セクション */}
          <Typography 
            sx={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              mb: 2
            }}
          >
            注文内容
          </Typography>

          {/* 商品リスト */}
          <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
            {items.map((item, index) => (
              <Box key={`${item.id}-${item.size}`} sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Box sx={{ 
                    position: 'relative', 
                    width: '80px', 
                    height: '80px',
                    alignSelf: 'flex-start'
                  }}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'medium' }}>
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                        サイズ: {item.size}
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                        数量: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', mt: 1, fontWeight: 'medium' }}>
                      ¥{(Number(item.price || 0) * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                {index < items.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Paper>

          {/* 配送先・連絡先セクション */}
          <Typography 
            sx={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              mb: 2, 
              mt: 4 
            }}
          >
            配送先・連絡先
          </Typography>

          <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
            <Box sx={{ py: 1 }}>
              <Typography variant="body1">
                {orderInfo.name}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                〒{orderInfo.postalCode}<br />
                {orderInfo.address}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {orderInfo.email}<br />
                {orderInfo.phone}
              </Typography>
            </Box>
          </Paper>

          {/* お支払い情報 */}
          <Typography 
            sx={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              mb: 2
            }}
          >
            お支払い方法
          </Typography>

          <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
            <Typography sx={{ fontSize: '14px' }}>
              {orderInfo.paymentMethod === 'cod' ? '代引き' : 
              orderInfo.paymentMethod === 'credit' ? 'クレジットカード' : 
              orderInfo.paymentMethod === 'paypay' ? 'PayPay' : 
              'クレジットカード'
              }
            </Typography>
          </Paper>

          {/* 金額明細 */}
          <Typography 
            sx={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              mb: 2
            }}
          >
            お支払い金額
          </Typography>

          <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 0.5 }}>
                  商品合計
                </Typography>
                <Typography sx={{ fontSize: '14px' }}>
                  ¥{subtotal.toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 0.5 }}>
                  送料
                </Typography>
                <Typography sx={{ fontSize: '14px' }}>
                  ¥{shippingFee.toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mb: 0.5 }}>
                  合計（税込）
                </Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  ¥{total.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* 戻るボタンと注文確定ボタン */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          mt: 2 
        }}>
          <Box sx={{ flex: { xs: '100%', sm: 1 } }}>
            <Link href="/checkout" style={{ textDecoration: 'none', display: 'block' }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  borderRadius: 0,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'black',
                    opacity: 0.7
                  }
                }}
              >
                戻る
              </Button>
            </Link>
          </Box>
          <Box sx={{ flex: { xs: '100%', sm: 1 } }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: 'black',
                color: 'white',
                borderRadius: 0,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)'
                }
              }}
              onClick={handleCompleteOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                orderInfo.paymentMethod === 'cod' ? '注文を確定する' : '決済ページへ進む'
              )}
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
} 