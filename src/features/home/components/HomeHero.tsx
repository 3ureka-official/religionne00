'use client'

import { Box } from '@mui/material'
import Link from 'next/link'

const HomeHero = () => {
  return (
    <Link href="/product/featured" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <Box sx={{ 
        position: 'relative',
        width: '100%', 
        height: { xs: 300, sm: 400, md: 500 },
        bgcolor: '#D9D9D9',
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'opacity 0.3s',
        '&:hover': {
          opacity: 0.9
        }
      }}>
        {/* カメラアイコン（プレースホルダー） */}
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#757575" viewBox="0 0 16 16">
          <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
          <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
        </svg>

        {/* ページネーションインジケーター */}
        <Box sx={{ 
          position: 'absolute',
          bottom: 15,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2
        }}>
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <Box 
              key={index}
              sx={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                bgcolor: index === 0 ? 'black' : 'rgba(0,0,0,0.2)'
              }}
            />
          ))}
        </Box>
      </Box>
    </Link>
  )
}

export default HomeHero 