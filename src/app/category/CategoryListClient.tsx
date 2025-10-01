'use client';

import { Box, Container, Typography, Breadcrumbs, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme';
import { MicroCMSImage } from "microcms-js-sdk";

interface Category {
  id: string;
  category: string;
  image: MicroCMSImage;
}

interface CategoryListClientProps {
  categories: Category[];
}

export default function CategoryListClient({ categories }: CategoryListClientProps) {
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
              <Typography color="text.primary" sx={{ fontSize: 'inherit', fontWeight: 500 }}>
                Store
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
            Categories
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
            商品カテゴリーから探す。お好みのカテゴリーを選択して、商品をご覧ください。
          </Typography>

          {/* カテゴリーグリッド */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {categories.map((category) => (
              <Box
                key={category.id}
                sx={{
                  width: { xs: '50%', md: '33.333%' },
                  px: 2,
                  mb: { xs: 2, sm: 3 },
                }}
              >
                <Link href={`/category/${category.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 0,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      },
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        pt: '70%',
                        position: 'relative',
                        bgcolor: '#F0F0F0',
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
                          backgroundImage: `url(${category.image.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          opacity: 0.5
                        }}
                      />
                      <Typography
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            padding: '20px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            fontSize: { xs: '26px', sm: '34px' },
                            fontWeight: 'bold',
                          }}
                        >
                          {category.category}
                        </Typography>
                    </Box>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Typography
                        sx={{
                          fontSize: { xs: '11px', sm: '14px' },
                          color: 'text.secondary',
                        }}
                      >
                        {category.category}の商品一覧
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Box>
            ))}
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
