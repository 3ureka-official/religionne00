'use client'

import { Box, Container, Typography, ThemeProvider, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import theme from '@/styles/theme'
import Image from 'next/image'

export default function ShoppingGuide() {
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
              ショッピングガイド
            </Typography>
          </Box>
          
          {/* コンテンツセクション */}
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'left' }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                お買い物について
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                Religionne00では、オンラインショッピングを快適に楽しんでいただくため、以下のガイドラインを用意しております。
                ご注文方法や配送、返品・交換などについてご案内いたします。
              </Typography>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                配送について
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                ご注文確定後、通常1-3営業日以内に発送いたします。配送方法は佐川急便または日本郵便を利用しており、
                地域によって配送日数が異なります。配送状況はご注文確定後にお送りする追跡番号から確認可能です。
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                送料は全国一律550円（税込）です。10,000円以上のご購入で送料無料となります。
              </Typography>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                お支払い方法
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                以下のお支払い方法をご利用いただけます：
              </Typography>
              <ul style={{ paddingLeft: '20px' }}>
                <li>
                  <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>クレジットカード（VISA、Mastercard、JCB、American Express）</Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>銀行振込</Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>コンビニ決済</Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>PayPay</Typography>
                </li>
              </ul>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                返品・交換について
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                商品到着後7日以内に限り、未使用の商品であれば返品・交換を承ります。
                返品・交換をご希望の場合は、お問い合わせフォームからご連絡ください。
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                ※以下の場合は返品・交換をお受けできませんのでご了承ください：
              </Typography>
              <ul style={{ paddingLeft: '20px' }}>
                <li>
                  <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>お客様のご都合による破損・汚損</Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>商品タグを取り外した場合</Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>セール対象商品</Typography>
                </li>
              </ul>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                サイズガイド
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                各商品ページに詳細なサイズ情報を記載しております。採寸方法や各サイズの詳細については、
                商品詳細ページをご確認ください。サイズについてご不明な点がある場合は、お気軽にお問い合わせください。
              </Typography>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                お問い合わせ
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                ショッピングに関するご質問やお問い合わせは、<a href="/contact" style={{ color: 'black', textDecoration: 'underline' }}>お問い合わせフォーム</a>からお気軽にご連絡ください。
                営業時間内（平日10:00-18:00）に順次対応いたします。
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