import { Box, Container } from '@mui/material'
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FeatureSection from '@/features/home/components/FeatureSection'
import { fetchSettings } from '@/lib/microcms'
import { getAllProducts } from '@/firebase/productService'
import { convertToMicroCMSFormat } from '@/lib/adapters'

export const revalidate = 600;

export default async function Home() {
  const settings = await fetchSettings()

  // Firebaseから出品中の商品のみを取得（createdAtの降順=出品順）
  const firebaseProducts = await getAllProducts(true)
  
  // Firebase ProductをMicroCMSProduct形式に変換
  const products = firebaseProducts.map(convertToMicroCMSFormat)
  
  // isRecommendedがtrueの商品をピックアップ商品として設定
  const recommendedProducts = firebaseProducts.filter(product => product.isRecommended === true)
  const pickUpProducts = recommendedProducts.map(product => convertToMicroCMSFormat(product))
  

  return (
    <ThemeProviderWrapper>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#FFFFFF'
        }}
      >
        <Header />
        <Container maxWidth="lg" component="main" sx={{ flex: 1, pt: { xs: 0, md: 4 }, pb: 4, px: { xs: 0.5, md: 4 } }}>
          <FeatureSection 
            products={products} 
            settings={settings}
            pickUpProducts={pickUpProducts}
          />
        </Container>
        <Footer />
      </Box>
    </ThemeProviderWrapper>
  )
}
