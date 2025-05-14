'use client'

import { Box, Container, Typography, Grid, ThemeProvider, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import theme from '@/styles/theme'
import Image from 'next/image'

export default function About() {
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
            mb: 4
          }}>
            <Typography variant="h4" component="h1" sx={{ 
              fontSize: { xs: '20px', sm: '24px' },
              fontWeight: 500 
            }}>
              About
            </Typography>
          </Box>
          
          {/* トップイメージ */}
          <Box sx={{ 
            width: '100%', 
            height: { xs: '200px', sm: '300px', md: '400px' },
            position: 'relative',
            bgcolor: '#D9D9D9',
            mb: 6,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* カメラアイコン（プレースホルダー） */}
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#757575" viewBox="0 0 16 16">
              <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
              <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
            </svg>
          </Box>
          
          {/* コンテンツセクション */}
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
                私たちのストーリー
              </Typography>
              <Typography variant="body1" paragraph>
                Religionne00は、持続可能なファッションと伝統的な工芸技術を融合させることを目指して2023年に設立されました。私たちは、環境への影響を最小限に抑えながら、高品質で長く愛用できる製品を提供することに情熱を注いでいます。
              </Typography>
              <Typography variant="body1" paragraph>
                自然素材を使用し、熟練した職人によって丁寧に作られた商品は、時代を超えて愛され続ける価値を持っています。私たちは、「少なく、しかし良いもの」という考え方を大切にしています。
              </Typography>
            </Box>
            
            {/* 画像セクション */}
            <Box sx={{ 
              width: '100%', 
              height: { xs: '200px', sm: '250px', md: '300px' },
              position: 'relative',
              bgcolor: '#D9D9D9',
              mb: 6,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* カメラアイコン（プレースホルダー） */}
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#757575" viewBox="0 0 16 16">
                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
              </svg>
            </Box>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
                ミッション
              </Typography>
              <Typography variant="body1" paragraph>
                私たちのミッションは、環境に配慮した方法で生産された、高品質で美しいプロダクトを通じて、持続可能なライフスタイルを促進することです。消費者と生産者の両方に公正な取引を提供し、伝統的な技術と現代のデザインを融合させることで、未来の世代のためにも価値ある製品を作り出しています。
              </Typography>
            </Box>
            
            {/* 画像セクション */}
            <Box sx={{ 
              width: '100%', 
              height: { xs: '200px', sm: '250px', md: '300px' },
              position: 'relative',
              bgcolor: '#D9D9D9',
              mb: 6,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* カメラアイコン（プレースホルダー） */}
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#757575" viewBox="0 0 16 16">
                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
              </svg>
            </Box>
            
            <Box>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>
                サステナビリティへの取り組み
              </Typography>
              <Typography variant="body1" paragraph>
                Religionne00では、サステナビリティを事業の中心に据えています。原材料の調達から製造プロセス、パッケージングに至るまで、環境への影響を最小限に抑える努力を続けています。私たちは以下の原則に基づいて活動しています：
              </Typography>
              <ul style={{ paddingLeft: '20px' }}>
                <li>
                  <Typography variant="body1" paragraph>
                    自然由来の素材の使用
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    廃棄物の削減と循環型アプローチ
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    フェアトレードと倫理的な労働条件の確保
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    地域コミュニティとの協働
                  </Typography>
                </li>
              </ul>
            </Box>
            
            {/* ロゴと線（下部に配置） */}
            <Box sx={{ mt: 8, mb: 4 }}>
              <Divider sx={{ mb: 4 }} />
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