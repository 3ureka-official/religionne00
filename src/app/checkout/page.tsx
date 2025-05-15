'use client'

import { Box, Container, Typography, Button, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material'
import { useState } from 'react'
import { useCart } from '@/features/cart/components/CartContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('credit')
  
  // 配送先情報のフォーム状態
  const [shippingForm, setShippingForm] = useState({
    lastName: '',
    firstName: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    email: '',
    phone: '',
  })

  // 小計金額（商品合計）
  const subtotal = getTotalPrice()
  // 送料
  const shippingFee = items.length > 1 ? 0 : 500
  // 合計金額
  const total = subtotal + shippingFee

  // フォーム入力値の更新
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 決済方法の変更
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value)
  }

  // 次へ進むボタンのクリック
  const handleProceed = () => {
    // ここに注文処理のコードを追加
    // 例: APIへの注文情報送信など
    
    // 成功したらカートをクリアして完了ページへ
    clearCart()
    router.push('/checkout/complete')
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#F8F9FA'
        }}
      >
        <Header />
        <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 4 }}>
          {/* ヘッダー */}
          <Box 
            sx={{ 
              bgcolor: 'black', 
              color: 'white', 
              p: 2, 
              display: 'flex',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 500
              }}
            >
              ご購入手続き
            </Typography>
          </Box>

          {/* メインコンテンツ */}
          <Box sx={{ position: 'relative', pb: 6 }}>
            {/* お届け先情報 */}
            <Typography 
              sx={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                mb: 2
              }}
            >
              お届け先
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <TextField
                label="姓"
                name="lastName"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.lastName}
                onChange={handleInputChange}
                sx={{ 
                  flexBasis: { xs: '100%', sm: 'calc(50% - 8px)' }, 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  } 
                }}
              />
              <TextField
                label="名"
                name="firstName"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.firstName}
                onChange={handleInputChange}
                sx={{ 
                  flexBasis: { xs: '100%', sm: 'calc(50% - 8px)' }, 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  } 
                }}
              />
              <TextField
                label="郵便番号"
                name="postalCode"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.postalCode}
                onChange={handleInputChange}
                sx={{ 
                  flexBasis: { xs: '100%', sm: 'calc(50% - 8px)' }, 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  } 
                }}
                placeholder="例: 123-4567"
              />
              <TextField
                label="都道府県"
                name="prefecture"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.prefecture}
                onChange={handleInputChange}
                sx={{ 
                  flexBasis: { xs: '100%', sm: 'calc(50% - 8px)' }, 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  } 
                }}
              />
              <TextField
                label="市区町村"
                name="city"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.city}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  } 
                }}
              />
              <TextField
                label="番地"
                name="address"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.address}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  } 
                }}
              />
              <TextField
                label="建物名・部屋番号など"
                name="building"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.building}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  } 
                }}
              />
              <TextField
                label="メールアドレス"
                name="email"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.email}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  } 
                }}
              />
              <TextField
                label="携帯電話番号"
                name="phone"
                variant="outlined"
                size="small"
                fullWidth
                value={shippingForm.phone}
                onChange={handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(217, 217, 217, 0.87)' 
                  } 
                }}
                placeholder="例: 090-1234-5678"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* お支払い方法 */}
            <Typography 
              sx={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                mb: 2
              }}
            >
              お支払い方法
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 4 }}>
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel 
                  value="credit" 
                  control={<Radio />} 
                  label="クレジットカード" 
                  sx={{ '& .MuiTypography-root': { fontSize: '14px', fontWeight: 500 } }}
                />
                <FormControlLabel 
                  value="paypay" 
                  control={<Radio />} 
                  label="PayPay" 
                  sx={{ '& .MuiTypography-root': { fontSize: '14px', fontWeight: 500 } }}
                />
                <FormControlLabel 
                  value="cod" 
                  control={<Radio />} 
                  label="代引き" 
                  sx={{ '& .MuiTypography-root': { fontSize: '14px', fontWeight: 500 } }}
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {/* 配送方法 */}
            <Typography 
              sx={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                mb: 2
              }}
            >
              配送方法
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                ヤマト運輸
              </Typography>
              <Typography sx={{ fontSize: '13px', mt: 1, color: 'text.primary' }}>
                送料全国一律 500円<br />
                離島 1200円<br />
                2点以上送料無料
              </Typography>
              <Typography sx={{ fontSize: '13px', mt: 2, color: 'text.primary' }}>
                Shipped with Japan Post International ePacket (includes tracking).<br />
                Tracking number will be provided after shipping.
              </Typography>
            </Box>

            {/* ウォーターマーク */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                right: 0,
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                opacity: 0.3,
                pointerEvents: 'none'
              }}
            >
              <Image
                src="/images/logo.png"
                alt="Watermark"
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Box>

          {/* 次へ進むボタン */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: 'black',
                color: 'white',
                borderRadius: 0,
                py: 1.5,
                maxWidth: 400,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)'
                }
              }}
              onClick={handleProceed}
            >
              次へ進む
            </Button>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
} 