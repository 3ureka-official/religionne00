'use client'

import { Box, Container, Typography, ThemeProvider, Paper, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import theme from '@/styles/theme'

export default function Contact() {
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
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            textAlign: 'center', 
            mb: 4, 
            fontWeight: 500 
          }}>
            お問い合わせ
          </Typography>
          
          <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="body1" paragraph>
              お問い合わせは、下記の窓口にて承っております。
            </Typography>
            
            <Typography variant="body1" paragraph>
              ご希望の方法でお気軽にご連絡ください。
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" fontWeight="500" sx={{ mt: 3, mb: 2 }}>
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
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" fontWeight="500" sx={{ mt: 3, mb: 2 }}>
              Instagram ダイレクトメッセージでのお問い合わせ
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
              @religionne00_official
            </Typography>
            
            <Typography variant="body1" paragraph>
              ・こちらからもお気軽にお問い合わせください。
            </Typography>
          </Paper>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
} 