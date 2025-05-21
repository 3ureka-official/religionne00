'use client'

import { Box, Container, Typography, Button } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/features/cart/components/CartContext'

export default function OrderCompletePage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [orderInfo, setOrderInfo] = useState<any>(null)
  
  useEffect(() => {
    // セッションストレージから注文情報を取得
    const storedOrderInfo = sessionStorage.getItem('orderInfo')
    
    if (storedOrderInfo) {
      setOrderInfo(JSON.parse(storedOrderInfo))
      
      // 注文完了後なのでセッションストレージとローカルストレージをクリア
      clearCart(); // カートをクリア
      sessionStorage.removeItem('orderInfo');
      sessionStorage.removeItem('paymentInfo');
      sessionStorage.removeItem('cartInfo');
      
      // 入力情報も削除
      localStorage.removeItem('shipping_form_data');
      localStorage.removeItem('payment_method_data');
    } else {
      // 注文情報がない場合はトップページにリダイレクト
      router.push('/');
    }
  }, [clearCart, router]);

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
            
            <Typography variant="h2" sx={{ fontSize: '20px', fontWeight: 500, mb: 3 }}>
              ご注文ありがとうございます
            </Typography>
            
            {orderInfo && (
              <Box sx={{ mb: 4, p: 3, border: '1px solid #eee', width: '100%', maxWidth: 500 }}>
                <Typography sx={{ mb: 2, fontWeight: 500, textAlign: 'left' }}>
                  ご注文情報
                </Typography>
                <Box sx={{ textAlign: 'left', fontSize: '14px' }}>
                  <Typography sx={{ mb: 1 }}>お名前: {orderInfo.name}</Typography>
                  <Typography sx={{ mb: 1 }}>お届け先: 〒{orderInfo.postalCode} {orderInfo.address}</Typography>
                  <Typography sx={{ mb: 1 }}>お支払い方法: {orderInfo.paymentMethod}</Typography>
                </Box>
              </Box>
            )}
            
            <Typography sx={{ mb: 2, maxWidth: 500 }}>
              ご注文を受け付けました。ご登録いただいたメールアドレスに確認メールをお送りしました。
            </Typography>
            
            <Typography sx={{ mb: 4, maxWidth: 500 }}>
              商品の発送準備が整い次第、発送のお知らせメールをお送りいたします。
            </Typography>

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