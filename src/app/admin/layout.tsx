'use client'

import { Box, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Badge } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LogoutIcon from '@mui/icons-material/Logout'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { getOrdersByStatus } from '@/firebase/orderService'
import { LogoutConfirmDialog } from '@/components/admin/LogoutConfirmDialog'

// 管理者ページのレイアウト
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [preparingOrdersCount, setPreparingOrdersCount] = useState(0)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  // 配送準備中の注文数を取得
  useEffect(() => {
    const fetchPreparingOrders = async () => {
      try {
        const orders = await getOrdersByStatus('processing')
        const pendingOrders = await getOrdersByStatus('pending')
        setPreparingOrdersCount(orders.length + pendingOrders.length)
      } catch (error) {
        console.error('注文数の取得に失敗しました:', error)
      }
    }

    if (isLoggedIn) {
      fetchPreparingOrders()
      // 30秒ごとに更新
      const interval = setInterval(fetchPreparingOrders, 30000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  // 管理者認証チェック（簡易版）
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth')
    if (adminAuth && adminAuth === 'true') {
      setIsLoggedIn(true)
    } else {
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    }
  }, [router, pathname])

  // サイドメニュー項目
  const menuItems = [
    { text: '商品管理', icon: <InventoryIcon />, path: '/admin' },
    { 
      text: '注文管理', 
      icon: <ShoppingCartIcon />, 
      path: '/admin/orders',
      badge: preparingOrdersCount
    },
    { text: '売上情報', icon: <AssessmentIcon />, path: '/admin/sales' },
  ]

  // ログアウト処理
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    setIsLoggedIn(false)
    setLogoutDialogOpen(false)
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
                        bgcolor: '#1976d2', // 青色に変更
                        color: 'white', // テキストを白に
                        borderLeft: '4px solid #0d47a1', // より濃い青のボーダー
                        '&:hover': {
                          bgcolor: '#1565c0', // ホバー時も青
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'white', // アイコンも白に
                        }
                      },
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: pathname === item.path ? 'white' : 'inherit' }}>
                      {item.badge && item.badge > 0 ? (
                        <Badge 
                          badgeContent={item.badge} 
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              bgcolor: pathname === item.path ? '#ff5252' : '#1976d2',
                              color: 'white',
                              fontWeight: 'bold',
                              width: '18px',
                              height: '18px',
                              minWidth: '18px',
                              minHeight: '18px',
                              padding: '0px',
                              borderRadius: '50%',
                              display: 'flex',
                            }
                          }}
                        >
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={() => setLogoutDialogOpen(true)}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="ログアウト" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* メインコンテンツ */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#FFFFFF' }}>
          {children}
        </Box>

        {/* ログアウト確認ダイアログ */}
        <LogoutConfirmDialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          onConfirm={handleLogout}
        />
      </Box>
    </ThemeProvider>
  )
} 