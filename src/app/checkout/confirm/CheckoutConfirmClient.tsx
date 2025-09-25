'use client'

import { Box, Container, Typography, Button, CircularProgress } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MicroCMSSettings } from '@/lib/microcms'
import { useCheckoutConfirm } from '@/hooks/checkout/useCheckoutConfirm'
import OrderSummary from '@/components/checkout/OrderSummary'
import CustomerInfo from '@/components/checkout/CustomerInfo'
import PricingBreakdown from '@/components/checkout/PricingBreakdown'
import { calculateShippingFee } from '@/utils/checkout'

export default function CheckoutConfirmClient({settings}: {settings: MicroCMSSettings}) {
  const { items, orderInfo, isProcessing, subtotal, handleCompleteOrder } = useCheckoutConfirm()
  
  // 送料計算
  const shippingFee = calculateShippingFee(
    items.length,
    orderInfo.isIslandAddress,
    {
      freeLowerLimit: settings.freeLowerLimit,
      islandFee: settings.islandFee,
      nationwideFee: settings.nationwideFee
    }
  )
  const total = subtotal + shippingFee

  const pricing = {
    subtotal,
    shippingFee,
    total,
    paymentMethod: orderInfo.paymentMethod
  }

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
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <OrderSummary items={items} />
          <CustomerInfo customer={orderInfo} />
          <PricingBreakdown pricing={pricing} />
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
              onClick={() => handleCompleteOrder(shippingFee, total)}
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