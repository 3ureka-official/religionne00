'use client'

import { ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CartProvider } from '@/features/cart/components/CartContext'
import { NextFont } from 'next/dist/compiled/@next/font'

interface ClientProviderProps {
  children: ReactNode
  geistSans: NextFont
}

export default function ClientProvider({ children, geistSans }: ClientProviderProps) {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#000000',
      },
      secondary: {
        main: '#FFFFFF',
      },
    },
    typography: {
      fontFamily: geistSans.style.fontFamily,
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  )
} 