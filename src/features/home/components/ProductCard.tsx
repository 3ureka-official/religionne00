'use client'

import { Box, Typography, Paper, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { MicroCMSProduct } from '@/lib/microcms'

interface ProductCardProps {
  product: MicroCMSProduct;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          border: featured ? '1px solid rgba(128,128,128,0.35)' : 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }
        }}
      >
        {featured && (
          <Typography
            sx={{
              p: 1,
              fontSize: { xs: '20px', sm: '24px' },
              fontWeight: featured ? 'normal' : 'medium',
            }}
          >
            pick up!!!
          </Typography>
        )}
        <Box
          sx={{
            bgcolor: '#D9D9D9',
            position: 'relative',
            flex: featured ? '1 0 auto' : 'none',
          }}
        >
          <Image
            src={product.images[0].url}
            alt={product.name}
            height={product.images[0].height}
            width={product.images[0].width}
            className={`w-full h-auto object-cover aspect-square`}
          />
        </Box>
        <Box sx={{ p: isMobile ? 0.5 : 1 }}>
          <Typography
            sx={{
              fontSize: { xs: '11px', sm: featured ? '15px' : '14px' },
              fontWeight: 'normal',
              mb: 0.5
            }}
          >
            {product.name}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '11px', sm: featured ? '15px' : '14px' },
              fontWeight: 'normal'
            }}
          >
            ¥ 2,000
          </Typography>
        </Box>
      </Paper>
    </Link>
  )
}

export default ProductCard
