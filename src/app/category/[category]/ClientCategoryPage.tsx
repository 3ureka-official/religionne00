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
                home
              </Link>
              <Link href="/category" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                store
              </Link>
              <Typography color="text.primary" sx={{ fontSize: 'inherit', fontWeight: 'bold' }}>
                {displayCategory}
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
            {displayCategory}
          </Typography>

          {/* 説明文 */}
          <Typography
            sx={{
              fontSize: { xs: '14px', sm: '16px' },
              mb: { xs: 3, sm: 4 },
              textAlign: 'center',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            {categoryDescription}
          </Typography>

          {/* 商品グリッド - FeatureSectionと同様のスタイリングに修正 */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, 1fr)' },
            gap: { xs: '1rem 0.3rem', sm: '2rem 1rem' },
            mb: { xs: 4, sm: 6 },
            width: '100%',
            mx: 'auto',
            px: { xs: '0.1rem', sm: 0 }
          }}>
            {products.map((product) => (
              <Box key={product.id}>
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
