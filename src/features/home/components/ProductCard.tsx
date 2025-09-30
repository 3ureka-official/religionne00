'use client'

import { Box, Typography, Paper, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MicroCMSProduct } from '@/lib/microcms'
import { formatPrice } from '@/utils/formatters'
// 商品コンポーネント
interface ProductCardProps {
  product: MicroCMSProduct;
  featured?: boolean;
  displaySize?: boolean;
}

const ProductCard = ({ product, featured = false, displaySize = false }: ProductCardProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  // サイズが一つだけあるかチェック
  const hasSingleSize = product.sizes && product.sizes.length === 1
  // 複数サイズがあるかチェック
  const hasMultipleSizes = product.sizes && product.sizes.length > 1
  
  // 単一サイズの取得
  const singleSize = hasSingleSize ? product.sizes[0].size : null

  // サイズ選択処理
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size === selectedSize ? null : size)
  }

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%', width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
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
        {featured && (
          <Typography
            sx={{
              p: { xs: 0.5, sm: 1 },
              fontSize: { xs: '18px', sm: '28px' },
              fontWeight: 'normal',
              textAlign: 'center',
            }}
          >
            pick up!!!
          </Typography>
        )}
        <Box
          sx={{
            bgcolor: '#D9D9D9',
            pt: '100%',
            position: 'relative',
            flex: featured ? '1 0 auto' : 'none',
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
              priority={featured}
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
        <Box sx={{ p: isMobile ? 0.2 : 1 }}>
          <Typography
            sx={{
              fontSize: { xs: '9px', sm: featured ? '20px' : '14px' },
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
          <Typography
            sx={{
              fontSize: { xs: '9px', sm: featured ? '20px' : '14px' },
              fontWeight: 'normal',
              mb: hasSingleSize || hasMultipleSizes ? 0.5 : 0
            }}
          >
            {formatPrice(Number(product.stripe_price_id))}
          </Typography>
          
          {/* サイズ表示 */}
          {displaySize && hasSingleSize && (
            <Typography
              sx={{
                fontSize: { xs: '8px', sm: featured ? '16px' : '12px' },
                color: 'text.secondary',
              }}
            >
              サイズ: {singleSize}
            </Typography>
          )}
          
          {/* 複数サイズボタン */}
          {displaySize && hasMultipleSizes && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 0.5, 
              mt: 0.5 
            }}>
              {product.sizes.map((item) => (
                <Box
                  key={item.size}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSizeSelect(item.size);
                  }}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    borderRadius: '2px',
                    px: { xs: 0.5, sm: 1 },
                    py: { xs: 0.1, sm: 0.2 },
                    fontSize: { xs: '7px', sm: featured ? '14px' : '10px' },
                    cursor: 'pointer',
                    bgcolor: selectedSize === item.size ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
                    color: selectedSize === item.size ? 'white' : 'black',
                    '&:hover': {
                      bgcolor: selectedSize === item.size ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.05)',
                    },
                    minWidth: { xs: '18px', sm: '30px' },
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.size}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Link>
  )
}

export default ProductCard