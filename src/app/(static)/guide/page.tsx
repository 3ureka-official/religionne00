import { Box, Container, Typography, Paper } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchSettings } from '@/lib/microcms'
import styles from '@/styles/prose'

export const revalidate = 3600;

export default async function ShoppingGuide() {
  // Fetch the shopping guide content from MicroCMS
  const settings = await fetchSettings();
  const shoppingGuideContent = settings.shoppingGuide;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF'
      }}
    >
      <Header />
      <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 4, px: { xs: 0 } }}>
        <Typography variant="h4" component="h1" sx={{
          px: { xs: 2, sm: 0 },
          textAlign: {xs: 'left', md: 'center'},
          fontSize: { xs: '20px', sm: '24px' },
          fontWeight: 500 
        }}>
          ショッピングガイド
        </Typography>

        <Paper elevation={0} sx={{ p: {xs: 1, sm: 4}, maxWidth: 800, mx: 'auto' }}>
          <Box sx={{
            ...styles
          }}>
            {/* Render the shopping guide content */}
            <div 
              dangerouslySetInnerHTML={{ __html: shoppingGuideContent }}
            />
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
}
