'use client'

import { Box, Container, Typography, Grid, ThemeProvider, Paper, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import theme from '@/styles/theme'

export default function About() {
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
            Religionne00について
          </Typography>
          
          <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                私たちのストーリー
              </Typography>
              <Typography variant="body1" paragraph>
                Religionne00は、持続可能なファッションと伝統的な工芸技術を融合させることを目指して2023年に設立されました。私たちは、環境への影響を最小限に抑えながら、高品質で長く愛用できる製品を提供することに情熱を注いでいます。
              </Typography>
              <Typography variant="body1" paragraph>
                自然素材を使用し、熟練した職人によって丁寧に作られた商品は、時代を超えて愛され続ける価値を持っています。私たちは、「少なく、しかし良いもの」という考え方を大切にしています。
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                ミッション
              </Typography>
              <Typography variant="body1" paragraph>
                私たちのミッションは、環境に配慮した方法で生産された、高品質で美しいプロダクトを通じて、持続可能なライフスタイルを促進することです。消費者と生産者の両方に公正な取引を提供し、伝統的な技術と現代のデザインを融合させることで、未来の世代のためにも価値ある製品を作り出しています。
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
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
          </Paper>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
} 