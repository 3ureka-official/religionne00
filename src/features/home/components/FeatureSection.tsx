'use client'

import { Box, Typography } from '@mui/material'
import ProductCard from './ProductCard'
import { MicroCMSCategory, MicroCMSProduct, MicroCMSSettings } from '@/lib/microcms';
import HomeHero from './HomeHero';

interface FeatureSectionProps {
  products: MicroCMSProduct[];
  settings: MicroCMSSettings;
  pickUpProducts: MicroCMSProduct[];
  categories: MicroCMSCategory[];
}

const FeatureSection = ({ products, settings, pickUpProducts, categories }: FeatureSectionProps) => {
  // ピックアップ商品があるかどうか確認
  const hasPickUpProduct = pickUpProducts && pickUpProducts.length > 0
  

  const filteredProducts = products.filter(product => !pickUpProducts.some(pickUpProduct => pickUpProduct.id === product.id))


  return (
    <Box>
      <HomeHero carouselImages={settings.carouselImages} products={products} />

      {/* メインコンテンツエリア */}
      {hasPickUpProduct && 
      <Box mt={4} mx={2}>
        <Typography sx={{ fontSize: { xs: '18px', sm: '25px' }, fontWeight: 'bold' }}>
          Pick Up
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: pickUpProducts.length >= 3 ? 'repeat(3, minmax(0, 1fr))' : `repeat(${pickUpProducts.length}, minmax(0, 1fr))`, lg: pickUpProducts.length >= 4 ? 'repeat(4, 1fr)' : pickUpProducts.length == 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' },
          gap: { xs: '2rem 1rem', sm: `3rem ${pickUpProducts.length >= 4 || pickUpProducts.length === 1 ? '2rem' : `${5-pickUpProducts.length}rem`}` },
          mb: { xs: 4, sm: 6 },
          pt: { xs: 1, sm: 2 },
          width: '100%',
          mx: 'auto',
          px: { xs: '0.1rem', sm: 0 }
        }}>
            {pickUpProducts.map((product, index) => (
              <Box key={`grid-${index}`}>
                <ProductCard product={product} categories={categories} />
              </Box>
            ))}
        </Box>
      </Box>
      }
      
      <Box mt={4} mx={2}>
        <Typography sx={{ fontSize: { xs: '18px', sm: '25px' }, fontWeight: 'bold' }}>
          Items
        </Typography>
      
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, 1fr)' },
          gap: { xs: '2rem 1rem', sm: '3rem 2rem' },
          mb: { xs: 4, sm: 6 },
          pt: { xs: 1, sm: 2 },
          width: '100%',
          mx: 'auto',
          px: { xs: '0.1rem', sm: 0 }
        }}>
          {filteredProducts.map((product, index) => (
            <Box key={`grid-${index}`}>
              <ProductCard product={product} categories={categories} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default FeatureSection 