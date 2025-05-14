'use client'

import { Box, Container, Drawer, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const menuItems = ['Home', 'About', 'Category', 'Contact', 'SNS']

  return (
    <Box component="header" sx={{ bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1, sm: 2 }
        }}>
          {/* Top Row: Logo */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: { xs: 1.5, sm: 2 }
          }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', color: 'black' }}>
              <Box sx={{
                position: 'relative',
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 }
              }}>
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            </Link>
          </Box>

          {/* Bottom Row: Menu Button, Search Bar, and Icons */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' }
          }}>
            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} fill="#555555" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
              </svg>
            </button>

            {/* Search Bar */}
            <Box sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #444444',
              borderRadius: '4px',
              padding: { xs: '3px 6px', sm: '4px 8px' },
              width: '100%',
              maxWidth: {
                xs: isMobile ? 'calc(100% - 90px)' : 'calc(100% - 110px)',
                sm: 'calc(100% - 120px)'
              },
              mx: { xs: 1, sm: 2 },
              order: { xs: isMobile ? 3 : 'initial', sm: 'initial' },
              mt: { xs: isMobile ? 1.5 : 0, sm: 0 },
              flexBasis: { xs: isMobile ? '100%' : 'auto', sm: 'auto' }
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} fill="#AAAAAA" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
              <input
                type="text"
                placeholder="検索"
                style={{
                  marginLeft: '8px',
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: isMobile ? '11px' : '12px'
                }}
              />
            </Box>

            {/* Icons */}
            <Box sx={{
              display: 'flex',
              gap: { xs: 1.5, sm: 2 },
              ml: { xs: 'auto', sm: 0 }
            }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "22"} height={isMobile ? "18" : "22"} fill="#555555" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "22"} height={isMobile ? "18" : "22"} fill="#555555" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                </svg>
              </button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Menu Drawer */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={toggleMenu}
      >
        <Box
          sx={{
            width: { xs: 250, sm: 280 },
            p: { xs: 2.5, sm: 3 },
            height: '100%',
            bgcolor: 'white',
            borderRight: '1px solid rgba(0, 0, 0, 0.3)'
          }}
          role="presentation"
        >
          <Typography variant="h6" sx={{ mb: 3, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Menu
          </Typography>
          <List>
            {menuItems.map((text, index) => (
              <ListItem key={index} sx={{ pl: 0, pr: 0, py: 1.5 }}>
                <Link
                  href={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
                  style={{
                    color: 'black',
                    textDecoration: 'none',
                    fontSize: isMobile ? '15px' : '16px',
                    display: 'block',
                    width: '100%'
                  }}
                  onClick={toggleMenu}
                >
                  {text}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export default Header 