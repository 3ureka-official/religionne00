import { Box, Container, Typography, Paper } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchSettings } from '@/lib/microcms'

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
          プライバシーポリシー
        </Typography>

        <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <div dangerouslySetInnerHTML={{ __html: privacyPolicyContent }} />
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
}
