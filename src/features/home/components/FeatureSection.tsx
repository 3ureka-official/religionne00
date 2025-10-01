'use client'

import { Box, Typography, useMediaQuery, useTheme, Modal } from '@mui/material'
import ProductCard from './ProductCard'
import { useState, useEffect } from 'react'
import { MicroCMSProduct, MicroCMSSettings } from '@/lib/microcms';
import HomeHero from './HomeHero';

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

// // カテゴリーセレクター
// interface CategorySelectorProps {
//   onCategoryClick: (category: string) => void;
//   selectedCategory: string;
// }

// const CategorySelector = ({ onCategoryClick, selectedCategory }: CategorySelectorProps) => {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
//   const categories = ['Original', 'Tops', 'Bottoms', 'Jackets', 'Coat', 'Others']

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: { xs: 'space-between', sm: 'space-between' },
//         mb: { xs: 4, sm: 6 },
//         flexWrap: { xs: 'nowrap', sm: 'wrap' },
//         gap: { xs: 1, sm: 0 },
//         pb: 2,
//         borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
//         overflowX: { xs: 'auto', sm: 'visible' },
//         '&::-webkit-scrollbar': {
//           display: 'none'
//         },
//         scrollbarWidth: 'none',
//         msOverflowStyle: 'none'
//       }}
//     >
//       {categories.map((category, index) => (
//         <Box
//           key={index}
//           sx={{
//             position: 'relative',
//             pb: 1,
//             flexShrink: 0,
//             marginRight: { xs: index === categories.length - 1 ? 1 : 0, sm: 0 },
//             '&::after': {
//               content: '""',
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               width: '100%',
//               height: '2px',
//               backgroundColor: 'black',
//               opacity: category === selectedCategory ? 1 : 0,
//               transition: 'opacity 0.3s ease'
//             }
//           }}
//         >
//           <Typography
//             sx={{
//               fontSize: { xs: '12px', sm: '16px' },
//               fontWeight: category === selectedCategory ? 'bold' : 'normal',
//               color: 'black',
//               cursor: 'pointer',
//               whiteSpace: 'nowrap',
//               '&:hover': { opacity: 0.7 }
//             }}
//             onClick={() => onCategoryClick(category)}
//           >
//             {category}
//           </Typography>
//         </Box>
//       ))}
//     </Box>
//   )
// }

// ページネーション
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const Pagination = ({ totalItems, itemsPerPage, onPageChange, currentPage }: PaginationProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      // まずページ変更を実行し、その後スクロール
      onPageChange(page);
      // スクロールはuseEffectで処理されるため不要
    }
  }
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      // まずページ変更を実行し、その後スクロール
      onPageChange(newPage);
      // スクロールはuseEffectで処理されるため不要
    }
  }
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      // まずページ変更を実行し、その後スクロール
      onPageChange(newPage);
      // スクロールはuseEffectで処理されるため不要
    }
  }

  // ページが1ページしかない場合はページネーションを表示しない
  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
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
        const pageNumber = index + 1;
        const isCurrentPage = pageNumber === currentPage;
        
        return (
          <Box
            key={index}
            sx={{
              position: 'relative',
              padding: '2px 8px',
              cursor: 'pointer',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '100%',
                height: '2px',
                backgroundColor: 'black',
                opacity: isCurrentPage ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }
            }}
            onClick={() => handlePageChange(pageNumber)}
          >
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 14 },
                fontWeight: isCurrentPage ? 'bold' : 'normal',
                color: 'black'
              }}
            >
              {pageNumber}
            </Typography>
          </Box>
        );
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

interface FeatureSectionProps {
  products: MicroCMSProduct[];
  settings: MicroCMSSettings;
  pickUpProducts: MicroCMSProduct[];
  initialPage?: number; // 初期ページ番号（オプション）
}

const FeatureSection = ({ products, settings, pickUpProducts, initialPage = 1 }: FeatureSectionProps) => {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Original')
  const [currentPage, setCurrentPage] = useState(initialPage) // 初期ページを設定

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // スクロールトップ関数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };
  
  // ページが変わったときにスクロールトップ
  useEffect(() => {
      scrollToTop();
  }, [currentPage]);
  
  // ピックアップ商品があるかどうか確認
  const hasPickUpProduct = pickUpProducts && pickUpProducts.length > 0
  
  // PCでは4x4=16枚、ピックアップがある場合は15枚(ピックアップ+残り14枚)
  // モバイルでは3列で表示
  const ITEMS_PER_PAGE = isMobile ? 15 : 16
  
  // const handleCategoryClick = (category: string) => {
  //   setSelectedCategory(category)
  //   setCurrentPage(1) // カテゴリー変更時にページを1に戻す
  //   scrollToTop()
  // }

  const handleCloseModal = () => {
    setCategoryModalOpen(false)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setCategoryModalOpen(false)
    setCurrentPage(1) // カテゴリー変更時にページを1に戻す
    scrollToTop()
  }

  let filteredProducts = products.filter(product => !pickUpProducts.some(pickUpProduct => pickUpProduct.id === product.id))

  filteredProducts = [...filteredProducts, ...filteredProducts, ...filteredProducts, ...filteredProducts, ...filteredProducts, ...filteredProducts, ...filteredProducts]
  
  // カテゴリーでフィルタリングした商品リスト
  // const filteredProducts = selectedCategory === 'Original' 
  //   ? products.filter(product => !hasPickUpProduct || product.id !== pickUpProducts[0]?.id) 
  //   : products.filter(product => product.category?.category === selectedCategory && 
  //       (!hasPickUpProduct || product.id !== pickUpProducts[0]?.id));
  
  // 現在のページに表示する商品
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);
  const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
  

  return (
    <Box>
      {/* ホームヒーロー */}
      {currentPage === 1 && (
        <HomeHero carouselImages={settings.carouselImages} />
      )}

      {/* メインコンテンツエリア */}
      {currentPage === 1 && hasPickUpProduct && pickUpProducts.length > 0 && 
      <Box mt={4} mx={2}>
        <Typography sx={{ fontSize: { xs: '18px', sm: '25px' }, fontWeight: 'bold' }}>
          PICK UP
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: pickUpProducts.length >= 3 ? 'repeat(3, minmax(0, 1fr))' : `repeat(${pickUpProducts.length}, minmax(0, 1fr))`, lg: pickUpProducts.length >= 4 ? 'repeat(4, 1fr)' : pickUpProducts.length == 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' },
          gap: { xs: '1rem 1rem', sm: `3rem ${pickUpProducts.length >= 4 || pickUpProducts.length === 1 ? '2rem' : `${5-pickUpProducts.length}rem`}` },
          mb: { xs: 4, sm: 6 },
          pt: { xs: 1, sm: 2 },
          width: '100%',
          mx: 'auto',
          px: { xs: '0.1rem', sm: 0 }
        }}>
          {/* 1ページ目かつピックアップ商品がある場合 */}
            {pickUpProducts.map((product, index) => (
              <Box key={`grid-${index}`}>
                <ProductCard product={product} />
              </Box>
            ))}
        </Box>
      </Box>
      }
      
      <Box mt={4} mx={2}>
      {(currentPage === 1) && (
        <Typography sx={{ fontSize: { xs: '18px', sm: '25px' }, fontWeight: 'bold' }}>
          ITEMS
        </Typography>
      )}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, 1fr)' },
        gap: { xs: '1rem 1rem', sm: '3rem 2rem' },
        mb: { xs: 4, sm: 6 },
        pt: { xs: 1, sm: 2 },
        width: '100%',
        mx: 'auto',
        px: { xs: '0.1rem', sm: 0 }
      }}>

        {/* 2行目以降の商品 */}
        {currentPageProducts.map((product, index) => (
          <Box key={`grid-${index}`}>
            <ProductCard product={product} />
          </Box>
        ))}
        
        {/* ピックアップ商品がない場合または2ページ目以降 */}
        {(currentPage !== 1 || !hasPickUpProduct || pickUpProducts.length === 0) && (
          currentPageProducts.map((product, index) => (
            <Box key={index}>
              <ProductCard product={product} />
            </Box>
          ))
        )}
      </Box>

      </Box>

      {/* ページネーション */}
      <Pagination 
        totalItems={filteredProducts.length} 
        itemsPerPage={ITEMS_PER_PAGE} 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />

      {/* カテゴリーモーダル */}
      <CategoryModal
        open={categoryModalOpen}
        onClose={handleCloseModal}
        onSelect={handleCategorySelect}
      />
    </Box>
  )
}

export default FeatureSection 