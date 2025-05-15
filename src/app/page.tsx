import { Box, Container } from '@mui/material'
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomeHero from '@/features/home/components/HomeHero'
import FeatureSection from '@/features/home/components/FeatureSection'
import { fetchProducts, fetchSettings } from '@/lib/microcms'

export default async function Home() {
  const settings = await fetchSettings()
  const products = await fetchProducts()
  console.log(products);

  return (
    <ThemeProviderWrapper>
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
          <HomeHero carouselImages={settings.carouselImages} />
          <FeatureSection products={products} pickUpProducts={settings.pickUpProduct} />
        </Container>
        <Footer />
      </Box>
    </ThemeProviderWrapper>
  )
}
