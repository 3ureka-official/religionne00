'use client'

import { ImageCarousel } from '@/components/carousel/carousel'
import { Box, Container } from '@mui/material'
import { useState } from 'react'
import Link from 'next/link'

const HomeHero = () => {
  const contents = [1, 2, 3, 4, 5]
  const [activeSlide, setActiveSlide] = useState(0)
  
  const handleSlideChange = (index: number) => {
    setActiveSlide(index)
  }
  
  const carouselContents = contents.map((content, index) => (
    <Box sx={{
      position: 'relative',
      width: '100%',
      // アスペクト比を9:16に変更
      aspectRatio: '16/9',
      bgcolor: '#D9D9D9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    key={index}>
      {/* カメラアイコン（プレースホルダー） */}
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#757575" viewBox="0 0 16 16">
        <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
        <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
      </svg>
      <p>{content}</p>
    </Box>
  ))
  
  return (
    <Box sx={{ position: 'relative', mb: { xs: 0, sm: 4 } }}>
      {/* PCではコンテナ内、スマホでは画面幅いっぱいに */}
      <Box sx={{ 
        width: { xs: '100vw', sm: 'auto' },
        position: { xs: 'relative', sm: 'static' },
        left: { xs: 'calc(-50vw + 50%)', sm: 'auto' },
        right: { xs: 'calc(-50vw + 50%)', sm: 'auto' },
        marginLeft: { xs: 0, sm: 'auto' },
        marginRight: { xs: 0, sm: 'auto' }
      }}>
        <ImageCarousel 
          contents={carouselContents} 
          hideArrows={true}
          onSlideChange={handleSlideChange}
          removeTopMargin={true}
        />
        
        {/* カスタムドットインジケーター */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 16, 
            right: { xs: 16, sm: 32 },
            paddingRight: { xs: 0, sm: 0 },
            display: 'flex', 
            gap: 1,
            zIndex: 2
          }}
        >
          {contents.map((_, index) => (
            <Box 
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === activeSlide ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default HomeHero 