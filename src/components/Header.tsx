'use client'

import { Box, Container, Drawer, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, FormEvent, Suspense } from 'react'
import InstagramIcon from '@mui/icons-material/Instagram'
import { useCart } from '@/features/cart/components/CartContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { MicroCMSSettings, fetchSettings } from '@/lib/microcms'
// 検索バーコンポーネント
function SearchBar({ isMobile }: { isMobile: boolean }) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // 検索パラメータが変更されたときに検索クエリを更新
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      flex: 1
    }}>
      <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #444444',
          borderRadius: '4px',
          padding: { xs: '5px 8px', sm: '8px 10px' },
          width: '100%',
          maxWidth: { xs: '300px', sm: '350px', md: '550px' },
        }}>
          {isMobile && (
            <button 
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                marginRight: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} fill="#AAAAAA" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          )}
          <input
            type="text"
            placeholder="検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: isMobile ? '11px' : '13px'
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* ×印の位置を常に確保するためのプレースホルダー */}
            <Box sx={{ 
              width: isMobile ? '14px' : '18px', 
              height: isMobile ? '14px' : '18px',
              visibility: searchQuery ? 'visible' : 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: isMobile ? '0px' : '8px',
            }}>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Box sx={{ 
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%', 
                    bgcolor: '#E0E0E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "10" : "12"} height={isMobile ? "10" : "12"} fill="#666666" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </Box>
                </button>
              )}
            </Box>
            {!isMobile && (
              <button 
                type="submit"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#AAAAAA" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </button>
            )}
          </Box>
        </Box>
      </form>
    </Box>
  )
}

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const logoHeaderHeight = useRef<number>(0)
  const theme = useTheme()
  const [isMounted, setIsMounted] = useState(false)

    const [settings, setSettings] = useState<MicroCMSSettings | null>(null)
  
  // デフォルトでモバイルとして初期化（SSR時やマウント前）
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true // SSRとマウント前はモバイル表示をデフォルトにする
  })
  
  // コンポーネントがマウントされたらフラグを設定
  useEffect(() => {
    setIsMounted(true);
    const getSettings = async () => {
      const settings = await fetchSettings()
      setSettings(settings)
    }
    getSettings()
  }, []);
  
  // 実際に使用するサイズ変数
  const isMobile = isMounted ? isSmallScreen : true;
  
  const { getTotalItems } = useCart()
  const cartItemCount = getTotalItems()

  // 初期レンダリング時にロゴヘッダーの高さを計測
  useEffect(() => {
    if (headerRef.current) {
      logoHeaderHeight.current = headerRef.current.offsetHeight
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const menuItems = ['Home', 'About', 'Category', 'Contact', 'SNS']

  return (
    <>
      {/* 固定ヘッダー（ロゴ部分） - スクロールしても固定されない */}
      <Box 
        ref={headerRef}
        component="header" 
        sx={{ 
          bgcolor: 'white', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          height: 'auto',
          overflow: 'hidden',
          transition: 'height 0.3s ease',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 }, overflow: 'hidden' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            pt: { xs: 1.5, sm: 2 },
            pb: { xs: 0, sm: 0 },
            px: { xs: 0 }
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
          </Box>
        </Container>
      </Box>

      {/* 追従ヘッダー（検索バー部分） - スクロールすると固定される */}
      <Box
        component="header"
        sx={{
          bgcolor: 'white',
          boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 }, pt: { xs: 1, sm: 1.5 }, pb: { xs: 1.3, sm: 1.5 }, overflow: 'hidden' }}>
          {/* Bottom Row: Menu Button, Search Bar, and Icons */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'nowrap', gap: 1,

          }}>
            {/* Menu Button */}
            <Box>
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
            </Box>

            {/* Search Bar */}
            <Suspense fallback={
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                flex: 1
              }}>
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #444444',
                  borderRadius: '4px',
                  padding: { xs: '5px 8px', sm: '8px 10px' },
                  width: '100%',
                  maxWidth: { xs: '300px', sm: '350px', md: '550px' },
                }}>
                  <input
                    type="text"
                    placeholder="検索"
                    disabled
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: isMobile ? '11px' : '13px'
                    }}
                  />
                </Box>
              </Box>
            }>
              <SearchBar isMobile={isMobile} />
            </Suspense>

            {/* Icons */}
            <Box sx={{
              display: 'flex',
              gap: { xs: 1.5, sm: 2 },
              pr: { xs: 1, sm: 0 },
            }}>
              <a
                href={settings?.sns[0].url}
                target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}
              >
                <InstagramIcon sx={{ fontSize: isMobile ? 20 : 24, color: '#555555' }} />
              </a>


              {/* カートアイコン */}
              <Link href="/cart" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "18" : "22"} height={isMobile ? "18" : "22"} fill="#555555" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'black',
                        color: 'white',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                      }}
                    >
                      {cartItemCount}
                    </Box>
                  )}
                </Box>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

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
    </>
  )
}

export default Header 

