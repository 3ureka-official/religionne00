import { Box, Container, Typography, Paper } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchSettings } from '@/lib/microcms'

export default async function Contact() {
  // Fetch the contact content from MicroCMS
  const settings = await fetchSettings();
  const contactContent = settings.contact;

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
          お問い合わせ
        </Typography>

        <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          {/* Render the contact content */}
          <div dangerouslySetInnerHTML={{ __html: contactContent }} />
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
}
