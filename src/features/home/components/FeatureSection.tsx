'use client'

import { Box, Typography, Paper, useMediaQuery, useTheme, Modal } from '@mui/material'
import { useState } from 'react'
import Link from 'next/link'

// 商品コンポーネント
interface ProductCardProps {
  featured?: boolean;
  id?: number;
}

const ProductCard = ({ featured = false, id = 1 }: ProductCardProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          border: 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'none',
          '&:hover': {
            transform: 'none',
            boxShadow: 'none'
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
            pt: '100%',
            position: 'relative',
            flex: featured ? '1 0 auto' : 'none',
          }}
        >
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
        </Box>
        <Box sx={{ p: isMobile ? 0.5 : 1 }}>
          <Typography
            sx={{
              fontSize: { xs: '11px', sm: featured ? '15px' : '14px' },
              fontWeight: 'normal',
              mb: 0.5
            }}
          >
            商品名
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

// カテゴリーモーダル
interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
}

const CategoryModal = ({ open, onClose, onSelect }: CategoryModalProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
        p: isMobile ? 3 : 4,
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
            onClick={index === 0 ? undefined : () => onSelect(category)}
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
  onCategoryClick: (category: string) => void;
  selectedCategory: string;
}

const CategorySelector = ({ onCategoryClick, selectedCategory }: CategorySelectorProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const categories = ['Original', 'Tops', 'Bottoms', 'Jackets', 'Coat', 'Others']

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { xs: 'space-between', sm: 'space-between' },
        mb: { xs: 4, sm: 6 },
        flexWrap: { xs: 'nowrap', sm: 'wrap' },
        gap: { xs: 1, sm: 0 },
        pb: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        overflowX: { xs: 'auto', sm: 'visible' },
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {categories.map((category, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            pb: 1,
            flexShrink: 0,
            marginRight: { xs: index === categories.length - 1 ? 1 : 0, sm: 0 },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '2px',
              backgroundColor: 'black',
              opacity: category === selectedCategory ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '12px', sm: '16px' },
              fontWeight: category === selectedCategory ? 'bold' : 'normal',
              color: 'black',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              '&:hover': { opacity: 0.7 }
            }}
            onClick={() => onCategoryClick(category)}
          >
            {category}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

// ページネーション
const Pagination = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

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
          transform: 'rotate(-90deg)',
          cursor: 'pointer'
        }}
        onClick={handlePrevious}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} fill="#555555" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
        </svg>
      </Box>

      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1
        return (
          <Box
            key={index}
            sx={{
              width: isMobile ? 24 : 30,
              height: isMobile ? 24 : 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: pageNumber === currentPage ? 'black' : 'transparent',
              border: pageNumber === currentPage ? 'none' : '1px solid black',
              color: pageNumber === currentPage ? 'white' : 'black',
              fontSize: isMobile ? '10px' : '12px',
              cursor: 'pointer'
            }}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </Box>
        )
      })}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(90deg)',
          cursor: 'pointer'
        }}
        onClick={handleNext}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} fill="#555555" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
        </svg>
      </Box>
    </Box>
  )
}

const FeatureSection = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Original')

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  const handleCloseModal = () => {
    setCategoryModalOpen(false)
  }

  return (
    <Box>
      {/* カテゴリーセレクター */}
      <CategorySelector onCategoryClick={handleCategoryClick} selectedCategory={selectedCategory} />

      {/* ピックアップ商品とサイド商品 */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: { xs: 2, sm: 3 },
        mb: { xs: 4, sm: 6 }
      }}>
        {/* ピックアップ商品 (2列分) */}
        <Box sx={{ gridColumn: 'span 2' }}>
          <ProductCard featured={true} id={100} />
        </Box>
        
        {/* サイド商品 (1列に2つ) */}
        <Box sx={{
          display: 'grid',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: { xs: 2, sm: 3 }
        }}>
          <ProductCard id={101} />
          <ProductCard id={102} />
        </Box>
      </Box>

      {/* 商品グリッド */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: { xs: 2, sm: 3 },
        mb: 4
      }}>
        {Array(6).fill(null).map((_, index) => (
          <Box key={index}>
            <ProductCard id={index + 1} />
          </Box>
        ))}
      </Box>

      {/* ページネーション */}
      <Pagination />

      {/* カテゴリーモーダル */}
      <CategoryModal
        open={categoryModalOpen}
        onClose={handleCloseModal}
        onSelect={setSelectedCategory}
      />
    </Box>
  )
}

export default FeatureSection 