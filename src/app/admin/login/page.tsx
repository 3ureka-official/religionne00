'use client'

import { Box, Container, Typography, TextField, Button, Paper, IconButton, InputAdornment } from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // すでにログインしている場合はダッシュボードにリダイレクト
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth')
    if (adminAuth && adminAuth === 'true') {
      router.push('/admin/products')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // APIエンドポイントで認証を行う
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
      sessionStorage.setItem('adminAuth', 'true')
      router.push('/admin')
    } else {
        setError(result.message || 'ユーザー名またはパスワードが正しくありません')
      }
    } catch (error) {
      console.error('ログインエラー:', error)
      setError('ログイン処理中にエラーが発生しました')
    } finally {
      setIsLoading(false)
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
                disabled={isLoading}
                sx={{ mb: 1 }}
                size="small"
              />
              <TextField
                label="パスワード"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="パスワードの表示を切り替え"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  borderRadius: 0,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)'
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>
            </form>
            

          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
} 