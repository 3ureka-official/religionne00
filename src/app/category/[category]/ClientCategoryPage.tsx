'use client';

import { Box, Container, Typography, Breadcrumbs } from '@mui/material';
import ProductCard from '@/features/home/components/ProductCard';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme';
import { MicroCMSProduct } from '@/lib/microcms';

interface ClientCategoryPageProps {
  displayCategory: string;
  products: MicroCMSProduct[];
  categoryDescription: string;
}

export default function ClientCategoryPage({
  displayCategory,
  products,
  categoryDescription,
}: ClientCategoryPageProps) {
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
              <Typography color="text.primary" sx={{ fontSize: 'inherit' }}>
                {displayCategory}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* タイトル */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '20px', sm: '24px' },
              fontWeight: 'normal',
              mb: { xs: 2, sm: 3 },
              textAlign: 'center',
            }}
          >
            {displayCategory}
          </Typography>

          {/* 説明文 */}
          <Typography
            sx={{
              fontSize: { xs: '12px', sm: '14px' },
              mb: { xs: 3, sm: 4 },
              textAlign: 'center',
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            {categoryDescription}
          </Typography>

          {/* 商品グリッド */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  width: { xs: '50%', md: '33.333%' },
                  px: 2,
                  mb: { xs: 2, sm: 3 },
                }}
              >
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
