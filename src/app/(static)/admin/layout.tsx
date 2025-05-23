'use client'

import { Box, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import InventoryIcon from '@mui/icons-material/Inventory'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'

// 管理者ページのレイアウト
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 管理者認証チェック（簡易版）
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth')
    if (adminAuth && adminAuth === 'true') {
      setIsLoggedIn(true)
    } else {
      // 未ログインの場合はログインページにリダイレクト
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    }
  }, [router, pathname])

  // サイドメニュー項目
  const menuItems = [
    { text: '商品管理', icon: <InventoryIcon />, path: '/admin/products' },
    { text: '設定', icon: <SettingsIcon />, path: '/admin/settings' },
  ]

  // ログアウト処理
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    setIsLoggedIn(false)
    router.push('/admin/login')
  }

  if (pathname === '/admin/login' || !isLoggedIn) {
    return <>{children}</>
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* サイドバー */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            ['& .MuiDrawer-paper']: {
              width: 240,
              boxSizing: 'border-box',
              border: 'none',
              bgcolor: '#f5f5f5',
            },
          }}
        >
          <Box sx={{ p: 2, bgcolor: '#f8f8f8', color: 'black', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              管理画面
            </Typography>
          </Box>
          <List>
            {menuItems.map((item) => (
              <Link 
                key={item.text} 
                href={item.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={pathname === item.path}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        borderLeft: '4px solid black',
                      }
                    }}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="ログアウト" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        
        {/* メインコンテンツ */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            bgcolor: '#FFFFFF',
            minHeight: '100vh'
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  )
} 