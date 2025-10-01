'use client';

import { Box, Container, Typography, Breadcrumbs } from '@mui/material';
import ProductCard from '@/features/home/components/ProductCard';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme';
import { Product } from '@/firebase/productService';
import { convertToMicroCMSFormat } from '@/lib/adapters';

interface SearchResultsProps {
  query: string;
  products: Product[];
}

export default function SearchResults({ query, products }: SearchResultsProps) {
  const displayTitle = query ? `"${query}"の検索結果` : '検索結果';
  
  // Firebase ProductをMicroCMSProduct形式に変換
  const convertedProducts = products.map(convertToMicroCMSFormat);
  
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
              <Typography color="text.primary" sx={{ fontSize: 'inherit', fontWeight: 'bold' }}>
                {displayTitle}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* タイトル */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '18px', sm: '20px' },
              fontWeight: 'normal',
              mb: { xs: 2, sm: 3 },
              textAlign: 'center',
            }}
          >
            {displayTitle}
          </Typography>

          {/* 検索結果の件数表示 */}
          <Typography sx={{ mb: 3, fontSize: { xs: '14px', sm: '16px' } }}>
            {products.length > 0 
              ? `${products.length}件の商品が見つかりました`
              : '商品が見つかりませんでした'}
          </Typography>

          {/* 商品グリッド */}
          {products.length > 0 ? (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: '1rem 0.5rem', sm: '2rem 1rem' },
              mb: { xs: 4, sm: 6 }
            }}>
              {convertedProducts.map((product) => (
                <Box key={product.id}>
                  <ProductCard product={product} />
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', my: 8 }}>
              <Typography sx={{ mb: 2 }}>
                別のキーワードでお試しください
              </Typography>
              <Link href="/" passHref style={{ color: 'inherit' }}>
                <Typography sx={{ textDecoration: 'underline' }}>
                  トップページへ戻る
                </Typography>
              </Link>
            </Box>
          )}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
} 