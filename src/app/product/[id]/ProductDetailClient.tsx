'use client';

import { Box, Container, Typography, Button, Breadcrumbs, Snackbar, Alert } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme';
import { useCart } from '@/features/cart/components/CartContext';

interface ProductImage {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface ProductSize {
  fieldId: string;
  size: string;
  stock: number;
}

interface ProductCategory {
  id: string;
  name: string;
}

interface ProductDetailClientProps {
  product: {
    name: string;
    stripe_price_id: string;
    images: ProductImage[];
    description: string;
    category: ProductCategory;
    sizes: ProductSize[];
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImage>(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const { addItem } = useCart();

  // サイズを選択する処理
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // カートに追加する処理
  const handleAddToCart = () => {
    if (!selectedSize) {
      setAlertMessage('サイズを選択してください');
      setAlertSeverity('error');
      setShowAlert(true);
      return;
    }

    addItem({
      id: product.stripe_price_id,
      name: product.name,
      price: product.stripe_price_id,
      image: product.images[0].src,
      quantity: 1,
      size: selectedSize,
    });

    setAlertMessage('カートに商品を追加しました');
    setAlertSeverity('success');
    setShowAlert(true);
  };

  // アラートを閉じる処理
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#F8F9FA',
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
                  mx: 0.5,
                },
              }}
            >
              <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                home
              </Link>
              <Link href="/category" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                store
              </Link>
              <Link href={`/category/${product.category.id}`} passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                {product.category.name}
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
                    border: '1px solid rgba(0, 0, 0, 0.3)',
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
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={selectedImage.src}
                      alt={product.name}
                      width={selectedImage.width}
                      height={selectedImage.height}
                      className="object-cover aspect-square"
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
                      mb: 1,
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
                          justifyContent: 'center',
                        }}
                      >
                        <Image
                          src={image.src}
                          alt={`thumbnail ${image.id}`}
                          width={image.width}
                          height={image.height}
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
                    mb: 1,
                  }}
                >
                  {product.name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    mb: 3,
                  }}
                >
                  Price ID: {product.stripe_price_id}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    mb: 1,
                  }}
                >
                  size:
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  {product.sizes.map((size) => (
                    <Box
                      key={size.size}
                      sx={{
                        border: '1px solid black',
                        px: 2,
                        py: 0.5,
                        fontSize: { xs: '12px', sm: '14px' },
                        cursor: 'pointer',
                        bgcolor: selectedSize === size.size ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
                        color: selectedSize === size.size ? 'white' : 'black',
                        '&:hover': {
                          bgcolor: selectedSize === size.size ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.05)',
                        },
                      }}
                      onClick={() => handleSizeSelect(size.size)}
                    >
                      {size.size} (在庫: {size.stock})
                    </Box>
                  ))}
                </Box>

                <Typography
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    mb: 1,
                  }}
                >
                  商品説明:
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    mb: 4,
                    lineHeight: 1.6,
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
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
              </Box>
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
  );
}
