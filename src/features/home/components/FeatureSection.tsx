'use client'

import { Box, Typography, useMediaQuery, useTheme, Modal } from '@mui/material'
import ProductCard from './ProductCard'
import { useState } from 'react'
import { MicroCMSProduct } from '@/lib/microcms';

// カテゴリーモーダル
interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
}

const CategoryModal = ({ open, onClose }: CategoryModalProps) => {
  const categories = ['Category', 'Original', 'Tops', 'Bottoms', 'Jackets', 'Coat', 'Others']

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="category-modal"
      aria-describedby="select a category"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: 250, sm: 300 },
        bgcolor: 'white',
        border: '1px solid rgba(0, 0, 0, 0.3)',
        boxShadow: 24,
        p: 4,
      }}>
        {categories.map((category, index) => (
          <Box
            key={index}
            sx={{
              my: index === 0 ? 0 : 2,
              py: 0.5,
              cursor: index === 0 ? 'default' : 'pointer',
              fontWeight: index === 0 ? 'bold' : 'normal',
              '&:hover': index === 0 ? {} : { opacity: 0.7 }
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '15px', sm: '16px' }
              }}
            >
              {category}
            </Typography>
          </Box>
        ))}
      </Box>
    </Modal>
  )
}

// カテゴリーセレクター
interface CategorySelectorProps {
  onCategoryClick: () => void;
}

const CategorySelector = ({ onCategoryClick }: CategorySelectorProps) => {
  const categories = ['Original', 'Tops', 'Bottoms', 'Jackets', 'Coat', 'Others']

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mb: { xs: 2, sm: 4 },
        flexWrap: 'wrap',
        gap: { xs: 1, sm: 0 }
      }}
    >
      {categories.map((category, index) => (
        <Typography
          key={index}
          sx={{
            fontSize: { xs: '12px', sm: '14px' },
            fontWeight: index === 0 ? 'bold' : 'normal',
            color: 'black',
            cursor: 'pointer',
            '&:hover': { opacity: 0.7 }
          }}
          onClick={onCategoryClick}
        >
          {category}
        </Typography>
      ))}
    </Box>
  )
}

// ページネーション
const Pagination = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const pages = [1, 2, 3, 4, 5]

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 },
        mt: { xs: 3, sm: 4 }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(-90deg)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} fill="#555555" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
        </svg>
      </Box>

      {pages.map((page, index) => (
        <Box
          key={index}
          sx={{
            width: isMobile ? 24 : 30,
            height: isMobile ? 24 : 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            bgcolor: index === 0 ? 'black' : 'transparent',
            border: index === 0 ? 'none' : '1px solid black',
            color: index === 0 ? 'white' : 'black',
            fontSize: isMobile ? '10px' : '12px'
          }}
        >
          {page}
        </Box>
      ))}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(90deg)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} fill="#555555" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
        </svg>
      </Box>
    </Box>
  )
}

const FeatureSection = ({ products }: { products: MicroCMSProduct[] }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const handleCategoryClick = () => {
    setCategoryModalOpen(true)
  }

  const handleCloseModal = () => {
    setCategoryModalOpen(false)
  }

  return (
    <Box>
      {/* カテゴリーセレクター */}
      <CategorySelector onCategoryClick={handleCategoryClick} />

      {/* ピックアップ商品 */}
      <Box sx={{ mb: { xs: 3, sm: 6 } }}>
        <ProductCard featured={true} product={products[0]} />
      </Box>

      {/* 商品グリッド */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: isMobile ? -0.5 : -1 }}>
        {products.map((product, index) => (
          <Box key={index} sx={{ width: { xs: '33.333%', sm: '33.333%', md: '33.333%' }, p: isMobile ? 0.5 : 1 }}>
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>

      {/* ページネーション */}
      <Pagination />

      {/* カテゴリーモーダル */}
      <CategoryModal
        open={categoryModalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  )
}

export default FeatureSection
