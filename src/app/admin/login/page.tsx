'use client'

import { Box, Container, Typography, Button, Paper, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import Image from 'next/image'
import { signInWithGoogle } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // すでにログインしている場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/admin')
    }
  }, [authLoading, isAuthenticated, router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signInWithGoogle()

      if (result.success && result.user) {
        // 認証成功 - AuthContextが自動的にリダイレクトを処理
        router.push('/admin')
      } else {
        setError(result.error || '認証に失敗しました')
      }
    } catch (error) {
      console.error('ログインエラー:', error)
      setError('ログイン処理中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 認証状態のローディング中
  if (authLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    )
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Googleアカウントでログインしてください
              </Typography>
            </Box>
            
            {error && (
              <Box sx={{ 
                bgcolor: '#ffebee', 
                color: '#c62828', 
                p: 2, 
                mb: 2,
                fontSize: '0.875rem',
                borderRadius: 1
              }}>
                {error}
              </Box>
            )}
            
            <Button
              fullWidth
              variant="contained"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              startIcon={isLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
              sx={{
                bgcolor: 'white',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#DDD',
                  border: '1px solid #ccc',
                },
                '&:disabled': {
                  bgcolor: 'white',
                  color: '#999'
                }
              }}
            >
              {isLoading ? 'ログイン中...' : 'Googleでログイン'}
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
} 

function GoogleIcon() {
  return (
      <Image src="/images/google-icon.svg" width={20} height={20} alt="google_img" />
  );
}