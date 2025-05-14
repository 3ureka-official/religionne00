'use client'

import { Box, Container, ThemeProvider } from '@mui/material'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HomeHero from '../features/home/components/HomeHero'
import FeatureSection from '../features/home/components/FeatureSection'
import theme from '../styles/theme'

export default function Home() {
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
          <HomeHero />
          <FeatureSection />
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}
