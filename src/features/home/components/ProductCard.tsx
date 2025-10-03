'use client'

import { Box, Typography, Paper, useMediaQuery, useTheme, Chip, Divider } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { MicroCMSCategory, MicroCMSProduct } from '@/lib/microcms'
import { formatPrice } from '@/utils/formatters'
import { useRouter } from 'next/navigation'
// 商品コンポーネント
interface ProductCardProps {
  product: MicroCMSProduct;
  categories?: MicroCMSCategory[];
}

const ProductCard = ({ product, categories }: ProductCardProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()


  // サイズ選択処理
  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault()
    e.stopPropagation()

    const matchedCategory = categories?.find(cat => cat.category === category)

    if (matchedCategory) {
      router.push(`/category/${matchedCategory.id}`)
    }
  }

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%', width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          // overflow: 'hidden',
          border: 'none',
          height: '100%',
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'none',
          boxSizing: 'border-box',
          '&:hover': {
            transform: 'none',
            boxShadow: 'none'
          }
        }}
      >
        <Box
          sx={{
            bgcolor: '#D9D9D9',
            pt: '100%',
            position: 'relative',
            flex: '1 0 auto',
            aspectRatio: '1/1',
          }}
        >
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              height={product.images[0].height || 1000}
              width={product.images[0].width || 1000}
              className="object-cover absolute top-0 left-0 w-full h-full"
              quality={90}
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "25" : "35"} height={isMobile ? "25" : "35"} fill="#757575" viewBox="0 0 16 16">
                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
              </svg>
            </Box>
          )}
        </Box>
        <Box sx={{ pt: 1, pb: {xs: 0.5, sm: 1} }}>
          <Typography
            sx={{
              fontSize: { xs: '14px', sm: '16px' },
              fontWeight: 'normal',
              mb: 0.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: { xs: '1.2em', sm: '1.4em' },
              height: { xs: '2.4em', sm: '2.8em' },
            }}
          >
            {product.name}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: 0.5, 
            alignItems: 'center', 
            mb: 0.5,
            mt: 0.5,
            fontSize: { xs: '11px', sm: '12px' },
            fontWeight: 'normal',
          }}>
            {product.category.map((cat, index) => (
              <span
                key={cat.id}
                onClick={(e) => handleCategoryClick(e, cat.category || '')}
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  color: 'inherit',
                }}
              >
                {cat.category}
                {index < product.category.length - 1 && ', '}
              </span>
          ))}

          </Box>
          
          <Typography
            sx={{
              fontSize: { xs: '14px', sm: '16px' },
              fontFamily: 'Helvetica',
              mb: 0.5,
              mt: 0.5,
              fontWeight: 'bold',
            }}
          >
            {formatPrice(Number(product.stripe_price_id))}
          </Typography>
        </Box>

        <Divider sx={{ bgcolor: 'black', borderWidth: '0.9px' }} />
      </Paper>
    </Link>
  )
}

export default ProductCard