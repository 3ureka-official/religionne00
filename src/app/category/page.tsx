'use client'

import { Box, Container, Typography, Button, useMediaQuery, useTheme, Breadcrumbs, Card, CardContent } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'

export default function CategoryListPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // カテゴリー一覧
  const categories = [
    { id: 'original', name: 'Original', description: 'オリジナル商品コレクション' },
    { id: 'tops', name: 'Tops', description: 'トップス一覧' },
    { id: 'bottoms', name: 'Bottoms', description: 'ボトムス一覧' },
    { id: 'jackets', name: 'Jackets', description: 'ジャケット一覧' },
    { id: 'coat', name: 'Coat', description: 'コート一覧' },
    { id: 'others', name: 'Others', description: 'その他の商品' }
  ]

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
              <Typography color="text.primary" sx={{ fontSize: 'inherit' }}>
                store
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
              textAlign: 'center'
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
              mx: 'auto'
            }}
          >
            商品カテゴリーから探す。お好みのカテゴリーを選択して、商品をご覧ください。
          </Typography>

          {/* カテゴリーグリッド */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: isMobile ? -1 : -2 }}>
            {categories.map((category) => (
              <Box key={category.id} sx={{ width: { xs: '50%', md: '33.333%' }, px: isMobile ? 1 : 2, mb: { xs: 2, sm: 3 } }}>
                <Link href={`/category/${category.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      borderRadius: 0, 
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      },
                      height: '100%'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: '100%',
                        pt: '70%', 
                        position: 'relative',
                        bgcolor: '#F0F0F0'
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
                        <Typography 
                          sx={{ 
                            fontSize: { xs: '16px', sm: '20px' },
                            fontWeight: 'normal',
                            opacity: 0.8
                          }}
                        >
                          {category.name}
                        </Typography>
                      </Box>
                    </Box>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Typography 
                        sx={{ 
                          fontSize: { xs: '11px', sm: '14px' },
                          color: 'text.secondary'
                        }}
                      >
                        {category.description}
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
  )
} 