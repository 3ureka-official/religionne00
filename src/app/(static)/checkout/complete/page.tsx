'use client'

import { Box, Container, Typography, Button } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function OrderCompletePage() {
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
        <Container 
          maxWidth="lg" 
          component="main" 
          sx={{ 
            flex: 1, 
            py: 4,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
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
              ご注文完了
            </Typography>
          </Box>

          {/* 完了メッセージ */}
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              my: 8,
              position: 'relative'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 64, color: 'black', mb: 3 }} />
            
            <Typography variant="h2" sx={{ fontSize: '20px', fontWeight: 500, mb: 3 }}>
              ご注文ありがとうございます
            </Typography>
            
            <Typography sx={{ mb: 2, maxWidth: 500 }}>
              ご注文を受け付けました。ご登録いただいたメールアドレスに確認メールをお送りしました。
            </Typography>
            
            <Typography sx={{ mb: 4, maxWidth: 500 }}>
              商品の発送準備が整い次第、発送のお知らせメールをお送りいたします。
            </Typography>

            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                sx={{
                  border: '1px solid black',
                  color: 'black',
                  borderRadius: 0,
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  mt: 2
                }}
              >
                トップページへ戻る
              </Button>
            </Link>

            {/* ウォーターマーク */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 10,
                right: 10,
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                opacity: 0.2,
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
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
} 