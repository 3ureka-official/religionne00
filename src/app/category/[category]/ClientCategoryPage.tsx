'use client'

import { Box, Container, Typography, useMediaQuery, useTheme, Breadcrumbs } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import theme from '@/styles/theme'

// 型定義
interface Product {
  id: number
  name: string
  price: string
  category: string
  image: string
}

interface ClientCategoryPageProps {
  category: string
  displayCategory: string
  products: Product[]
  categoryDescription: string
}

export default function ClientCategoryPage({ 
  category, 
  displayCategory, 
  products, 
  categoryDescription 
}: ClientCategoryPageProps) {
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))

  return (
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
            <Typography color="text.primary" sx={{ fontSize: 'inherit' }}>
              {displayCategory}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* カテゴリータイトル */}
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '20px', sm: '24px' },
            fontWeight: 'normal',
            mb: { xs: 2, sm: 3 },
            textAlign: 'center'
          }}
        >
          {displayCategory}
        </Typography>

        {/* カテゴリー説明 */}
        <Typography 
          sx={{ 
            fontSize: { xs: '12px', sm: '14px' },
            mb: { xs: 3, sm: 4 },
            textAlign: 'center',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          {categoryDescription}
        </Typography>

        {/* 商品グリッド */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: isMobile ? -0.5 : -1 }}>
          {products.map((product) => (
            <Box key={product.id} sx={{ width: '33.333%', px: isMobile ? 0.5 : 1, mb: { xs: 2, sm: 3 } }}>
              <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                      src={product.image}
                      alt={product.name}
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
                  {product.name}
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: { xs: '11px', sm: '14px' },
                    fontWeight: 'normal'
                  }}
                >
                  ¥ {product.price}
                </Typography>
              </Link>
            </Box>
          ))}
        </Box>

        {/* ページネーション */}
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            mt: { xs: 3, sm: 4 }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(90deg)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} fill="#555555" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
            </svg>
          </Box>
          
          {[1, 2, 3].map((page, index) => (
            <Box 
              key={index}
              sx={{ 
                width: isMobile ? 24 : 30,
                height: isMobile ? 24 : 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                bgcolor: index === 0 ? 'black' : 'transparent',
                border: index === 0 ? 'none' : '1px solid black',
                color: index === 0 ? 'white' : 'black',
                fontSize: isMobile ? '10px' : '12px',
                cursor: 'pointer'
              }}
            >
              {page}
            </Box>
          ))}
          
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-90deg)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} fill="#555555" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
            </svg>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
} 