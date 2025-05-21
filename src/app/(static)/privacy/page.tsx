import { Box, Container, Typography, Paper } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchSettings } from '@/lib/microcms'
import styles from '@/styles/prose'

export default async function PrivacyPolicy() {
  // Fetch the privacy policy content from MicroCMS
  const settings = await fetchSettings();
  const privacyPolicyContent = settings.privacyPolicy;

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
          プライバシーポリシー
        </Typography>

        <Paper elevation={0} sx={{ p: {xs: 1, sm: 4}, maxWidth: 800, mx: 'auto' }}>
          {/* Render the shopping guide content */}
          <Box sx={{
            ...styles
          }}>
            <div 
              dangerouslySetInnerHTML={{ __html: privacyPolicyContent }}
            />
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
}
