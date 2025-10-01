'use client';

import { Box, Container, Typography, Button, Breadcrumbs, Snackbar, Alert, Divider } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme';
import { useCart } from '@/features/cart/components/CartContext';
import ProductCard from '@/features/home/components/ProductCard';
import { formatPrice } from '@/utils/formatters';

interface ProductImage {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface ProductSize {
  size: string;
  stock: number;
}

interface ProductCategory {
  id: string;
  name: string;
}

interface ProductDetailClientProps {
  product: {
    id: string | undefined;
    name: string;
    stripe_price_id: string;
    images: ProductImage[];
    description: string;
    category: ProductCategory;
    sizeInventories: ProductSize[];
    link?: string;
  };
  relatedProducts?: Array<{
    id: string;
    name: string;
    stripe_price_id: string;
    images: {
      url: string;
      width: number;
      height: number;
      alt?: string;
    }[];
    category: {
      id: string;
      category: string;
    };
  }>;
}

export default function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImage>(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  console.log(product);

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

    // 商品情報をローカルストレージに保存（商品IDの参照用）
    try {
      localStorage.setItem(`product_${product.name}`, JSON.stringify({
        id: product.id,
        price: product.stripe_price_id
      }));
    } catch (e) {
      console.error('商品情報の保存に失敗:', e);
    }

    addItem({
      id: product.id ?? '',
      name: product.name,
      price: product.stripe_price_id,
      image: product.images[0].src,
      quantity: 1,
      size: selectedSize,
    });

    setAlertMessage('カートに商品を追加しました');
    setAlertSeverity('success');
    setShowAlert(true);
    setSelectedSize(null);
  };

  // アラートを閉じる処理
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const isSoldOut = product.sizeInventories.every(size => size.stock === 0);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#FFFFFF',
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
                Home
              </Link>
              <Link href="/category" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                Store
              </Link>
              <Link href={`/category/${product.category.id}`} passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                {product.category.name}
              </Link>
              <Typography color="text.primary" sx={{ fontSize: 'inherit', fontWeight: 'bold' }}>
                {product.name}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexWrap: { md: 'wrap' }, mx: -2 }}>
            {/* 商品画像セクション */}
            <Box sx={{ width: { xs: '100%', md: '46%' }, px: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: '100%',
                    pt: '100%',
                    position: 'relative',
                    bgcolor: '#D9D9D9',
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
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full"
                      style={{ aspectRatio: '1/1' }}
                      quality={95}
                      priority={true}
                      sizes="(max-width: 680px) 100vw, (max-width: 1200px) 60vw, 50vw"
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
                      width: '16.667%',
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
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                          style={{ aspectRatio: '1/1' }}
                          quality={85}
                          sizes="(max-width: 768px) 25vw, 120px"
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* 商品詳細セクション */}
            <Box sx={{ width: { xs: '100%', md: '53%' }, px: {xs: 2, md: 6}, mt: { xs: 4, md: 0 } }}>
              <Box sx={{ position: 'relative' }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '22px', sm: '24px' },
                    fontWeight: 'normal',
                    mb: 1,
                  }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                  <Typography
                    variant='body1'
                    fontFamily='Helvetica'
                    sx={{
                      fontSize: { xs: '18px', sm: '20px' },
                      fontWeight: 'bold',
                    }}
                  >
                    {formatPrice(Number(product.stripe_price_id))}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px' }, color: 'black'
                    }}
                  >
                    {`(税込)`}
                  </Typography>
                </Box>

                {isSoldOut && (
                  <Typography
                    sx={{
                      fontSize: { xs: '14px', sm: '16px' },
                      color: '#F73644',
                      fontWeight: "light",
                    }}
                  >
                    SOLD&nbsp;OUT
                  </Typography>
                )}

                <Typography
                  sx={{
                    mt: 4,
                    fontSize: { xs: '12px', sm: '14px' },
                  }}
                >
                  Size:
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  {product.sizeInventories.length === 1 ? (
                    <Typography
                      sx={{
                        fontSize: { xs: '12px', sm: '14px' },
                        mb: 1,
                      }}
                    >
                      {product.sizeInventories[0].size}
                    </Typography>
                    ) : (product.sizeInventories && product.sizeInventories.map((item) => (
                    <Box
                      key={item.size}
                      sx={{
                        border: '1px solid black',
                        px: 2,
                        py: 0.5,
                        fontSize: { xs: '12px', sm: '14px' },
                        cursor: (item.stock === 0) ? 'unset' : 'pointer',
                        bgcolor: (item.stock === 0) ? 'rgba(0, 0, 0, 0.1)' : selectedSize === item.size ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
                        color: (item.stock === 0) ? 'rgba(0, 0, 0, 0.5)' : selectedSize === item.size ? 'white' : 'black',
                        '&:hover': {
                          bgcolor: (item.stock === 0) ? 'rgba(0, 0, 0, 0.1)' : selectedSize === item.size ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.05)',
                        },
                      }}
                      onClick={() =>
                        item.stock > 0 && handleSizeSelect(item.size)
                      }
                    >
                      {item.size}
                    </Box>
                  )))}
                </Box>

                {/* モバイルビューでは商品説明がカートボタンより上に表示される順序を変更 */}
                <Box sx={{ display: { xs: 'flex', md: 'block' }, flexDirection: 'column' }}>
                  <Box sx={{ order: { xs: 2, md: 1 }, mb: { xs: 2, md: 4 }, }}>
                    <Typography
                      sx={{
                        fontSize: { xs: '12px', sm: '14px' },
                      }}
                    >
                      Details:
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: { xs: '12px', sm: '14px' },
                        lineHeight: 1.6,
                      }}
                    >
                      {product.description}
                    </Typography>

                    {product.link && (
                      <Link href={product.link} target="_blank" rel="noopener noreferrer">
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: { xs: '12px', sm: '14px' },
                            color: '#006AFF',
                            textDecoration: 'underline',
                            '&:hover': {
                              color: '#006ADD',
                            },
                          }}
                        >
                          Look Book
                        </Typography>
                      </Link>
                    )}
                  </Box>

                  <Box sx={{ order: { xs: 1, md: 2 }, mb: { xs: 3, md: 0 } }}>
                    <Box sx={{ my: 1, width: '100%', height: '0.9px', bgcolor: 'black' }} />

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: isSoldOut ? '#aaa !important' : 'black',
                        color: isSoldOut ? 'white !important' : 'white',
                        borderRadius: 0,
                        py: 1.5,
                        mt: 1.5,
                        mb: { xs: 3, md: 0 },
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.8)',
                        },
                      }}
                      disabled={isSoldOut}
                      onClick={handleAddToCart}
                    >
                      {isSoldOut ? 'Out of Stock' : 'Add to cart'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* 関連商品セクション */}
            {relatedProducts.length > 0 && (
              <Box sx={{ width: '100%', px: 2, mt: 5 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: { xs: '18px', sm: '20px' }, 
                    mb: 1.5, 
                    fontWeight: 'bold',
                  }}
                >
                  Related Items
                </Typography>

                <Divider sx={{ bgcolor: 'black', borderWidth: '0.9px', mb: 2 }} />

                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: { xs: '1rem 0.5rem', sm: '2rem 1rem' },
                  mb: { xs: 4, sm: 6 }
                }}>
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <Box key={relatedProduct.id}>
                      <ProductCard product={{
                        id: relatedProduct.id,
                        name: relatedProduct.name,
                        stripe_price_id: relatedProduct.stripe_price_id,
                        images: relatedProduct.images.map(img => ({
                          url: img.url,
                          width: img.width,
                          height: img.height,
                          alt: img.alt
                        })),
                        category: {
                          id: relatedProduct.category.id,
                          category: relatedProduct.category.category,
                          image: relatedProduct.images[0],
                          createdAt: '',
                          updatedAt: '',
                          publishedAt: '',
                          revisedAt: ''
                        },
                        createdAt: '',
                        updatedAt: '',
                        publishedAt: '',
                        revisedAt: '',
                        description: '',
                        sizes: []
                      }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
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