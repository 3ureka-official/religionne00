'use client'

import { Box, Container, Typography, ThemeProvider, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import theme from '@/styles/theme'
import Image from 'next/image'

export default function Contact() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#FFFFFF'
        }}
      >
        <Header />
        <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 4 }}>
          {/* ヘッダーセクション */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 2,
            borderBottom: '1px solid black',
            mb: 4,
            maxWidth: 800,
            mx: 'auto'
          }}>
            <Typography variant="h4" component="h1" sx={{ 
              fontSize: { xs: '20px', sm: '24px' },
              fontWeight: 500 
            }}>
              お問い合わせ
            </Typography>
          </Box>
          
          {/* コンテンツセクション */}
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="body1" paragraph sx={{ textAlign: 'center' }}>
              お問い合わせは、下記の窓口にて承っております。
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 6 }}>
              ご希望の方法でお気軽にご連絡ください。
            </Typography>
            
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="500" sx={{ mb: 2 }}>
                メールでのお問い合わせ
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
                info@religionne00.com
              </Typography>
              
              <Typography variant="body1" paragraph>
                ・内容を確認後、順次ご返信させていただきます。
              </Typography>
              
              <Typography variant="body1" paragraph>
                ・お問い合わせ内容や混雑状況により、ご返信まで数日いただく場合がございます。
                あらかじめご了承ください。
              </Typography>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="500" sx={{ mb: 2 }}>
                Instagram ダイレクトメッセージでのお問い合わせ
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
                @religionne00_official
              </Typography>
              
              <Typography variant="body1" paragraph>
                ・こちらからもお気軽にお問い合わせください。
              </Typography>
            </Box>
            
            {/* ロゴと線（下部に配置） */}
            <Box sx={{ mt: 8, mb: 4 }}>
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Divider sx={{ mb: 4, borderColor: 'black' }} />
              </Box>
              <Box sx={{ 
                position: 'relative', 
                width: '150px', 
                height: '150px',
                opacity: 0.3,
                mx: 'auto'
              }}>
                <Image
                  src="/images/logo.png"
                  alt="Religionne00 Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
} 