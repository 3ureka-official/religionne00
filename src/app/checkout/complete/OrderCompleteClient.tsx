'use client'

import { Box, Container, Typography, Button } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/features/cart/components/CartContext'
import { MicroCMSSettings } from '@/lib/microcms'
import styles from '@/styles/prose'
import { OrderInfo, PaymentInfo } from '@/types/Storage'
import Image from 'next/image'
import { formatPrice } from '@/utils/formatters'

export default function OrderCompleteClient({settings}: {settings: MicroCMSSettings}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  
  useEffect(() => {
    // URLパラメータからStripe決済情報を確認
    const stripeSessionId = searchParams.get('session_id')

    if (stripeSessionId) {
      // Stripe決済の場合（既存の処理）
      const storedOrderInfo = sessionStorage.getItem('orderInfo')
      const storedPaymentInfo = sessionStorage.getItem('paymentInfo')
      
      if (storedOrderInfo && storedPaymentInfo) {
        setOrderInfo(JSON.parse(storedOrderInfo))
        setPaymentInfo(JSON.parse(storedPaymentInfo))

        // 注文完了後なのでセッションストレージとローカルストレージをクリア
        clearCart()
        sessionStorage.removeItem('orderInfo')
        sessionStorage.removeItem('paymentInfo')
        sessionStorage.removeItem('cartInfo')
        localStorage.removeItem('shipping_form_data')
        localStorage.removeItem('payment_method_data')
      }
    } else {
      // セッションストレージから注文情報を取得（代引きなど）
      const storedOrderInfo = sessionStorage.getItem('orderInfo')
      const storedPaymentInfo = sessionStorage.getItem('paymentInfo')

      if (storedOrderInfo && storedPaymentInfo) {
        setOrderInfo(JSON.parse(storedOrderInfo))
        setPaymentInfo(JSON.parse(storedPaymentInfo))
        
        // 注文完了後なのでセッションストレージとローカルストレージをクリア
        clearCart()
        sessionStorage.removeItem('orderInfo')
        sessionStorage.removeItem('paymentInfo')
        sessionStorage.removeItem('cartInfo')
        localStorage.removeItem('shipping_form_data')
        localStorage.removeItem('payment_method_data')
      }
    }
  }, [clearCart, router, searchParams])

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#FFFFFF'
        }}
      >
        <Header />
        <Container 
          maxWidth="lg" 
          component="main" 
          sx={{ 
            flex: 1, 
            py: 4,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
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
              ご注文完了
            </Typography>
          </Box>

          {/* 完了メッセージ */}
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              my: 4,
              position: 'relative'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 64, color: 'black', mb: 3 }} />
            
            <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 500, mb: 3 }}>
              ご注文ありがとうございます
            </Typography>
            
            {orderInfo && (
              <Box sx={{ mb: 4, p: { xs: 1, sm: 3 }, border: '1px solid #eee', width: '100%', maxWidth: 500 }}>
                <Typography sx={{ mb: 2, fontWeight: 500, textAlign: 'left', fontSize: { xs: '13px', sm: '14px' } }}>
                  ご注文情報
                </Typography>
                <Box sx={{ textAlign: 'left', fontSize: { xs: '13px', sm: '14px' } }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      お名前
                    </Typography>
                    <Typography variant="body1">
                      {orderInfo.customerInfo.lastName} {orderInfo.customerInfo.firstName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      メールアドレス
                    </Typography>
                    <Typography variant="body1">
                      {orderInfo.customerInfo.email}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      電話番号
                    </Typography>
                    <Typography variant="body1">
                      {orderInfo.customerInfo.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      お届け先
                    </Typography>
                    <Typography variant="body1">
                      〒{orderInfo.customerInfo.postalCode}<br/>{orderInfo.customerInfo.prefecture}{orderInfo.customerInfo.city}{orderInfo.customerInfo.address}{orderInfo.customerInfo.building ? ` ${orderInfo.customerInfo.building}` : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      お支払い方法
                    </Typography>
                    <Typography variant="body1">
                      {orderInfo.paymentMethod === 'cod' ? '代引き' : 
                      orderInfo.paymentMethod === 'credit' ? 'クレジットカード' : 
                      orderInfo.paymentMethod === 'paypay' ? 'PayPay' :
                      'その他'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {orderInfo && (
              <Box sx={{ mb: 4, p: { xs: 1, sm: 3 }, border: '1px solid #eee', width: '100%', maxWidth: 500 }}>
                <Typography sx={{ mb: 2, fontWeight: 500, textAlign: 'left', fontSize: { xs: '13px', sm: '14px' } }}>
                  ご注文商品
                </Typography>
                <Box sx={{ textAlign: 'left' }}>
                  {orderInfo.items.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Image style={{ width: 50, height: 50 }} src={item.image} alt={item.name} width={100} height={100} />
                      <Typography sx={{ mb: 1, fontSize: { xs: '13px', sm: '14px' } }}>{item.name}</Typography>
                      <Typography sx={{ mb: 1, fontSize: { xs: '13px', sm: '14px' } }}>{item.size}</Typography>
                      <Typography sx={{ mb: 1, fontSize: { xs: '13px', sm: '14px' } }}>{item.quantity}個</Typography> 
                      <Typography sx={{ mb: 1, fontSize: { xs: '13px', sm: '14px' } }}>{formatPrice(Number(item.price) * item.quantity)}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            
            <Box sx={{
              ...styles
            }}>
              <div 
                dangerouslySetInnerHTML={{ __html: settings.completeMessage }}
              />
            </Box>

            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                sx={{
                  border: '1px solid black',
                  color: 'black',
                  borderRadius: 0,
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  mt: 2
                }}
              >
                トップページへ戻る
              </Button>
            </Link>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
} 