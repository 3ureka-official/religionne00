'use client'

import React, { ReactNode, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CartProvider } from '@/features/cart/components/CartContext'
import { NextFont } from 'next/dist/compiled/@next/font'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'
import { CssBaseline } from '@mui/material'

interface ClientProviderProps {
  children: ReactNode
  geistSans: NextFont
}

// 参考: https://mui.com/material-ui/guides/server-rendering/
export default function ClientProvider({ children, geistSans }: ClientProviderProps) {
  const options = { key: 'mui' };
  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

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
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </CacheProvider>
  )
} 