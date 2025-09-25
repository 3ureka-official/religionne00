'use client'

import { Box, Typography, IconButton } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { CartItem as CartItemType, useCart } from './CartContext'
import CancelIcon from '@mui/icons-material/Cancel'

interface CartItemProps {
  item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {
  const { removeItem } = useCart()

  // アイテムを削除
  const handleRemoveItem = () => {
    removeItem(item.id, item.size || '')
  }

  return (
    <Box sx={{ display: 'flex', my: 2, position: 'relative', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', pb: 2 }}>
      {/* 商品画像 (クリッカブル) */}
      <Link href={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
        <Box 
          sx={{ 
            width: { xs: 80, sm: 100 }, 
            height: { xs: 80, sm: 100 }, 
            position: 'relative', 
            bgcolor: '#FFFFFF', 
            border: '1px solid rgba(128, 128, 128, 0.35)',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 0.85
            }
          }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 80px, 100px"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </Box>
      </Link>

      {/* 商品情報 */}
      <Box sx={{ flex: 1, ml: 2, pr: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
        {/* 商品名 (クリッカブル) */}
        <Link href={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography 
            sx={{ 
              fontSize: { xs: '14px', sm: '14px' }, 
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {item.name}
          </Typography>
        </Link>
        
        <Typography sx={{ fontSize: { xs: '14px', sm: '15px' }, fontWeight: 400, mt: 1 }}>
          ¥ {item.price} (tax in)
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
          {item.size && (
            <Typography sx={{ fontSize: { xs: '12px', sm: '13px' }, mt: 1 }}>
              サイズ: {item.size}
            </Typography>
          )}

          <Typography sx={{ fontSize: { xs: '12px', sm: '13px' }, mt: 1 }}>数量: {item.quantity}</Typography>
        </Box>
      </Box>

      {/* 削除ボタン */}
      <IconButton 
        sx={{ position: 'absolute', top: 0, right: 0 }} 
        onClick={handleRemoveItem}
      >
        <CancelIcon />
      </IconButton>
    </Box>
  )
}

export default CartItem 