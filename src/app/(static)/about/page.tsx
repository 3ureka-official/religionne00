import { Box, Container, Typography } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchSettings } from '@/lib/microcms';
import BrandCarousel from '@/components/BrandCarousel';

export default async function About() {
  const settings = await fetchSettings();
  const brandImages = settings.brandImages;

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
      <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 4, px: { xs: 0 } }}>
        <Typography variant="h4" component="h1" sx={{
          px: { xs: 2, sm: 0 },
          textAlign: 'center',
          mb: 4,
          fontWeight: 500
        }}>
          {'The "Religionne00" Brand'}
        </Typography>
         
        <BrandCarousel brandImages={brandImages} />
      </Container>
      <Footer />
    </Box>
  )
} 