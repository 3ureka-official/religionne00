'use client'

import { Box, Container, Typography, Button, useMediaQuery, useTheme, Breadcrumbs, Link as MuiLink, Snackbar, Alert } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import { useCart } from '@/features/cart/components/CartContext'

interface ProductImage {
  id: number;
  src: string;
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  const productId = React.use(params).id
  
  // 商品データ（実際のアプリではAPIから取得）
  const product = {
    id: productId,
    name: 'Original T-shirt',
    price: '2,000',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'シンプルなデザインで着回しやすいオリジナルTシャツです。高品質な素材を使用し、快適な着心地を実現しました。カジュアルからきれいめまで様々なスタイルに合わせやすい一枚です。',
    category: 'original',
    images: Array(7).fill(null).map((_, index) => ({
      id: index + 1,
      src: '/images/product/camera-icon-1.svg'
    }))
  }

  const [selectedImage, setSelectedImage] = useState<ProductImage>(product.images[0])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  
  const { addItem } = useCart()

  // サイズを選択する処理
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  // カートに追加する処理
  const handleAddToCart = () => {
    if (!selectedSize) {
      setAlertMessage('サイズを選択してください')
      setAlertSeverity('error')
      setShowAlert(true)
      return
    }

    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.images[0].src,
      quantity: 1,
      size: selectedSize
    })

    setAlertMessage('カートに商品を追加しました')
    setAlertSeverity('success')
    setShowAlert(true)
  }

  // アラートを閉じる処理
  const handleCloseAlert = () => {
    setShowAlert(false)
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
          {/* パンくずリスト */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs 
              separator="/" 
              aria-label="breadcrumb"
              sx={{ 
                fontSize: { xs: '10px', sm: '12px' }, 
                color: 'text.primary',
                '& .MuiBreadcrumbs-separator': {
                  mx: 0.5
                }
              }}
            >
              <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                home
              </Link>
              <Link href="/category" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                store
              </Link>
              <Link href={`/category/${product.category}`} passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                {product.category}
              </Link>
              <Typography color="text.primary" sx={{ fontSize: 'inherit' }}>
                {product.name}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {/* 商品画像セクション */}
            <Box sx={{ width: { xs: '100%', md: '58.333%' }, px: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Box 
                  sx={{ 
                    width: '100%',
                    pt: '100%', 
                    position: 'relative',
                    bgcolor: '#D9D9D9',
                    border: '1px solid rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Image
                      src={selectedImage.src}
                      alt={product.name}
                      width={isMobile ? 50 : 70}
                      height={isMobile ? 50 : 70}
                      style={{ opacity: 0.7 }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* サムネイル画像 */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -0.5 }}>
                {product.images.map((image) => (
                  <Box 
                    key={image.id}
                    sx={{ 
                      width: '25%', 
                      px: 0.5,
                      mb: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: '100%',
                        pt: '100%', 
                        position: 'relative',
                        bgcolor: '#D9D9D9',
                        border: image.id === selectedImage.id 
                          ? '1px solid rgba(0, 0, 0, 0.7)' 
                          : '1px solid rgba(128, 128, 128, 0.35)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Image
                          src={image.src}
                          alt={`thumbnail ${image.id}`}
                          width={isMobile ? 25 : 35}
                          height={isMobile ? 25 : 35}
                          style={{ opacity: 0.7 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* 商品詳細セクション */}
            <Box sx={{ width: { xs: '100%', md: '41.667%' }, px: 2, mt: { xs: 4, md: 0 } }}>
              <Box sx={{ position: 'relative' }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '18px', sm: '20px' },
                    fontWeight: 'normal',
                    mb: 1
                  }}
                >
                  {product.name}
                </Typography>

                <Typography 
                  sx={{ 
                    fontSize: { xs: '14px', sm: '16px' },
                    mb: 3
                  }}
                >
                  ¥ {product.price} (tax in)
                </Typography>

                <Typography 
                  sx={{ 
                    fontSize: { xs: '14px', sm: '16px' },
                    mb: 1
                  }}
                >
                  size:
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  {product.sizes.map((size) => (
                    <Box 
                      key={size}
                      sx={{
                        border: '1px solid black',
                        px: 2,
                        py: 0.5,
                        fontSize: { xs: '12px', sm: '14px' },
                        cursor: 'pointer',
                        bgcolor: selectedSize === size ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
                        color: selectedSize === size ? 'white' : 'black',
                        '&:hover': {
                          bgcolor: selectedSize === size ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.05)'
                        }
                      }}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </Box>
                  ))}
                </Box>

                <Typography 
                  sx={{ 
                    fontSize: { xs: '14px', sm: '16px' },
                    mb: 1
                  }}
                >
                  商品説明:
                </Typography>
                
                <Typography 
                  sx={{ 
                    fontSize: { xs: '14px', sm: '16px' },
                    mb: 4,
                    lineHeight: 1.6
                  }}
                >
                  {product.description}
                </Typography>

                <Box sx={{ my: 1, width: '100%', height: '1px', bgcolor: 'black' }} />
                
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    borderRadius: 0,
                    py: 1.5,
                    mt: 3,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>

                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: { xs: 60, sm: 80 },
                    height: { xs: 60, sm: 80 },
                    opacity: 0.3
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
            </Box>
          </Box>

          {/* 関連商品 */}
          <Box sx={{ mt: 8 }}>
            <Typography 
              sx={{ 
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 'bold',
                mb: 3,
                textAlign: 'center'
              }}
            >
              Related Products
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: isMobile ? -0.5 : -1 }}>
              {Array(3).fill(null).map((_, index) => (
                <Box key={index} sx={{ width: '33.333%', px: isMobile ? 0.5 : 1 }}>
                  <Link href={`/product/${index + 2}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box 
                      sx={{ 
                        width: '100%',
                        pt: '100%', 
                        position: 'relative',
                        bgcolor: '#D9D9D9',
                        mb: 1
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Image
                          src="/images/product/camera-icon-1.svg"
                          alt="Product thumbnail"
                          width={isMobile ? 25 : 35}
                          height={isMobile ? 25 : 35}
                          style={{ opacity: 0.7 }}
                        />
                      </Box>
                    </Box>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '11px', sm: '14px' },
                        fontWeight: 'normal',
                        mb: 0.5
                      }}
                    >
                      商品名
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '11px', sm: '14px' },
                        fontWeight: 'normal'
                      }}
                    >
                      ¥ 2,000
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
        <Footer />
        
        {/* 通知アラート */}
        <Snackbar
          open={showAlert}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity={alertSeverity}
            sx={{ width: '100%' }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
} 