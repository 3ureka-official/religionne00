'use client'

import { Box, Container, Typography, ThemeProvider, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import theme from '@/styles/theme'
import Image from 'next/image'

export default function PrivacyPolicy() {
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
              プライバシーポリシー
            </Typography>
          </Box>
          
          {/* コンテンツセクション */}
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'left' }}>
            <Typography variant="body2" paragraph sx={{ mb: 4, fontSize: '0.9rem' }}>
              最終更新日: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>

            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                1. はじめに
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                Religionne00（以下、「当社」といいます）は、お客様のプライバシーを尊重し、個人情報の保護に努めています。
                このプライバシーポリシーでは、当社のウェブサイトやサービスをご利用いただく際に収集する情報と、
                その利用方法についてご説明します。
              </Typography>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                2. 収集する情報
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                当社は、以下の情報を収集することがあります：
              </Typography>
              <ul style={{ paddingLeft: '20px' }}>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    <strong>個人情報：</strong>氏名、住所、電話番号、メールアドレス、生年月日など、お客様を特定できる情報
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    <strong>取引情報：</strong>購入履歴、配送情報、支払い情報など
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    <strong>利用情報：</strong>当社ウェブサイトの閲覧履歴、IPアドレス、ブラウザの種類、参照元ウェブサイトなど
                  </Typography>
                </li>
              </ul>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                3. 情報の利用目的
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                収集した情報は、以下の目的で利用します：
              </Typography>
              <ul style={{ paddingLeft: '20px' }}>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    商品の配送、支払い処理、注文確認などの取引の実行
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    カスタマーサポートの提供
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    新商品、セール、イベントなどの情報提供（お客様の同意がある場合）
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    ウェブサイトの改善、利用状況の分析
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    不正行為の防止および検出
                  </Typography>
                </li>
              </ul>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                4. 情報の共有
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                当社は、以下の場合を除き、お客様の個人情報を第三者と共有することはありません：
              </Typography>
              <ul style={{ paddingLeft: '20px' }}>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    お客様の同意がある場合
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    商品の配送、支払い処理などのサービス提供に必要な場合
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    法律上の義務がある場合
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    当社の権利や財産を保護する必要がある場合
                  </Typography>
                </li>
              </ul>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                5. お客様の権利
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                お客様は、当社が保有するご自身の個人情報について、以下の権利を有しています：
              </Typography>
              <ul style={{ paddingLeft: '20px' }}>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    個人情報へのアクセス、訂正、削除を要求する権利
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    マーケティング目的での情報利用に対する同意を撤回する権利
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                    データポータビリティの権利（技術的に可能な場合）
                  </Typography>
                </li>
              </ul>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                これらの権利を行使したい場合は、お問い合わせフォームからご連絡ください。
              </Typography>
            </Box>
            
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Divider sx={{ my: 4, borderColor: 'black' }} />
            </Box>
            
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 500, fontSize: '1rem' }}>
                6. お問い合わせ
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                プライバシーポリシーに関するご質問やお問い合わせは、
                <a href="/contact" style={{ color: 'black', textDecoration: 'underline' }}>お問い合わせフォーム</a>
                からお気軽にご連絡ください。
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