'use client'

import { Box, Container, Typography, TextField, Button, Paper } from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')

  // すでにログインしている場合はダッシュボードにリダイレクト
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth')
    if (adminAuth && adminAuth === 'true') {
      router.push('/admin')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // このデモでは簡易的な認証（実際の実装では安全な認証が必要）
    if (formData.username === 'admin' && formData.password === 'password') {
      sessionStorage.setItem('adminAuth', 'true')
      router.push('/admin')
    } else {
      setError('ユーザー名またはパスワードが正しくありません')
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          py: 4
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 0,
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                管理者ログイン
              </Typography>
              <Typography variant="body2" color="text.secondary">
                管理画面にアクセスするには認証が必要です
              </Typography>
            </Box>
            
            {error && (
              <Box sx={{ 
                bgcolor: '#ffebee', 
                color: '#c62828', 
                p: 2, 
                mb: 3,
                fontSize: '0.875rem'
              }}>
                {error}
              </Box>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                label="ユーザー名"
                name="username"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="パスワード"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  borderRadius: 0,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)'
                  }
                }}
              >
                ログイン
              </Button>
            </form>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                デモ用アカウント: admin / password
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
} 