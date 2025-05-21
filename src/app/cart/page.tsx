'use client'

import { Box, Container, Typography, Button, Divider } from '@mui/material'
import { useCart } from '@/features/cart/components/CartContext'
import CartItem from '@/features/cart/components/CartItem'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function CartPage() {
  const { items, getTotalPrice } = useCart()
  const totalPrice = getTotalPrice()
  
  // 小計の表示用フォーマット
  const formattedTotal = totalPrice.toLocaleString()

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
            Shopping Cart
          </Typography>
        </Box>

        {items.length === 0 ? (
          // カートが空の場合
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              my: 8
            }}
          >
            <Typography sx={{ mb: 4, fontSize: '16px' }}>
              カートに商品がありません
            </Typography>
            <Link href="/category" style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  border: '1px solid black',
                  color: 'black',
                  px: 4,
                  borderRadius: 0,
                  textTransform: 'none'
                }}
                startIcon={<ArrowBackIcon />}
              >
                商品一覧に戻る
              </Button>
            </Link>
          </Box>
        ) : (
          // カートに商品がある場合
          <>
            {/* カート商品リスト */}
            <Box sx={{ mb: 4 }}>
              {items.map((item) => (
                <CartItem key={`${item.id}-${item.size}`} item={item} />
              ))}
            </Box>
            
            {/* 小計 */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center',
                mb: 4
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 'normal'
                }}
              >
                小計　￥{formattedTotal}
              </Typography>
            </Box>

            {/* 購入ボタン */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
              <Link href="/checkout" style={{ textDecoration: 'none', width: '100%', maxWidth: 400 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    borderRadius: 0,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                >
                  ご購入手続きへ
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Container>
      <Footer />
    </Box>
  )
} 