'use client'

import { Box, Container } from '@mui/material'
import Link from 'next/link'

const Header = () => {
  return (
    <Box component="header" sx={{ bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: { xs: 1, sm: 2 } }}>
          {/* Logo */}
          <Box sx={{ width: 120, height: 40, bgcolor: '#D9D9D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link href="/" style={{ fontWeight: 'bold', fontSize: '18px', textDecoration: 'none', color: 'black' }}>
              LOGO
            </Link>
          </Box>

          {/* Search Bar */}
          <Box sx={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #444444',
            borderRadius: '4px',
            padding: '4px 8px',
            width: '100%',
            maxWidth: 400,
            mx: 2
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#AAAAAA" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <input
              type="text"
              placeholder="検索"
              style={{
                marginLeft: '8px',
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '12px'
              }}
            />
          </Box>

          {/* Icons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#555555" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#555555" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
            </button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Header 