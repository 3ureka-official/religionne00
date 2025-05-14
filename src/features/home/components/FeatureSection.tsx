'use client'

import { Box, Typography, Paper } from '@mui/material'

// 商品コンポーネント
const ProductCard = ({ featured = false }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        overflow: 'hidden',
        border: featured ? '1px solid rgba(128,128,128,0.35)' : 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {featured && (
        <Typography 
          sx={{ 
            p: 1,
            fontSize: '24px',
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
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#757575" viewBox="0 0 16 16">
            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
          </svg>
        </Box>
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography 
          sx={{ 
            fontSize: featured ? '15px' : '14px',
            fontWeight: 'normal',
            mb: 0.5
          }}
        >
          商品名
        </Typography>
        <Typography 
          sx={{ 
            fontSize: featured ? '15px' : '14px',
            fontWeight: 'normal'
          }}
        >
          ¥ 2,000
        </Typography>
      </Box>
    </Paper>
  )
}

// カテゴリーセレクター
const CategorySelector = () => {
  const categories = ['Original', 'Tops', 'Bottoms', 'Jackets', 'Coat', 'Others']
  
  return (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        mb: 4,
        flexWrap: 'wrap'
      }}
    >
      {categories.map((category, index) => (
        <Typography 
          key={index}
          sx={{ 
            fontSize: '14px',
            fontWeight: index === 0 ? 'bold' : 'normal',
            color: 'black',
            cursor: 'pointer'
          }}
        >
          {category}
        </Typography>
      ))}
    </Box>
  )
}

// ページネーション
const Pagination = () => {
  const pages = [1, 2, 3, 4, 5]
  
  return (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        mt: 4
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(90deg)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555555" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>
      </Box>
      
      {pages.map((page, index) => (
        <Box 
          key={index}
          sx={{ 
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            bgcolor: index === 0 ? 'black' : 'transparent',
            border: index === 0 ? 'none' : '1px solid black',
            color: index === 0 ? 'white' : 'black',
            fontSize: '12px'
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
          transform: 'rotate(-90deg)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555555" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>
      </Box>
    </Box>
  )
}

const FeatureSection = () => {
  return (
    <Box>
      {/* カテゴリーセレクター */}
      <CategorySelector />
      
      {/* ピックアップ商品 */}
      <Box sx={{ mb: 6 }}>
        <ProductCard featured={true} />
      </Box>
      
      {/* 商品グリッド */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
        {Array(6).fill(null).map((_, index) => (
          <Box key={index} sx={{ width: { xs: '50%', sm: '33.333%', md: '33.333%' }, p: 1 }}>
            <ProductCard />
          </Box>
        ))}
      </Box>
      
      {/* ページネーション */}
      <Pagination />
    </Box>
  )
}

export default FeatureSection 