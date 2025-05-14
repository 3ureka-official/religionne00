'use client'

import { Box, Typography, IconButton } from '@mui/material'
import Image from 'next/image'
import { CartItem as CartItemType, useCart } from './CartContext'
import CancelIcon from '@mui/icons-material/Cancel'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

interface CartItemProps {
  item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart()

  // 価格文字列を数値に変換（"2,000" → 2000）
  const priceNumber = parseInt(item.price.replace(/,/g, ''))
  // アイテム合計（価格 × 数量）
  const itemTotal = priceNumber * item.quantity

  // 数量を増やす
  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  // 数量を減らす
  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  // アイテムを削除
  const handleRemoveItem = () => {
    removeItem(item.id)
  }

  return (
    <Box sx={{ display: 'flex', my: 2, position: 'relative', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', pb: 2 }}>
      {/* 商品画像 */}
      <Box sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, position: 'relative', bgcolor: '#D9D9D9', border: '1px solid rgba(128, 128, 128, 0.35)' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src={item.image}
            alt={item.name}
            width={35}
            height={35}
            style={{ opacity: 0.7 }}
          />
        </Box>
      </Box>

      {/* 商品情報 */}
      <Box sx={{ flex: 1, ml: 2, pr: 5 }}>
        <Typography sx={{ fontSize: { xs: '14px', sm: '14px' }, fontWeight: 500 }}>
          {item.name}
        </Typography>
        
        {item.size && (
          <Typography sx={{ fontSize: { xs: '12px', sm: '12px' }, mb: 1 }}>
            サイズ: {item.size}
          </Typography>
        )}
        
        <Typography sx={{ fontSize: { xs: '14px', sm: '14px' }, fontWeight: 400, mt: 1 }}>
          ¥ {item.price} (tax in)
        </Typography>
        
        {/* 数量コントロール */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography sx={{ fontSize: '12px', mr: 1 }}>数量:</Typography>
          <IconButton size="small" onClick={handleDecreaseQuantity}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
          <IconButton size="small" onClick={handleIncreaseQuantity}>
            <AddIcon fontSize="small" />
          </IconButton>
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