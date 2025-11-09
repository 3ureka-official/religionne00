import { Box, Typography, Paper, Divider } from '@mui/material'
import Image from 'next/image'
import { CheckoutOrderItem } from '@/types/checkout'
import { formatPrice } from '@/utils/formatters';
interface OrderSummaryProps {
  items: CheckoutOrderItem[]
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  return (
    <Box>
      <Typography 
        sx={{ 
          fontSize: '16px', 
          fontWeight: 500, 
          mb: 2
        }}
      >
        注文内容
      </Typography>

      <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
        {items.map((item, index) => (
          <Box key={`${item.id}-${item.size}`} sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <Box sx={{ 
                position: 'relative', 
                width: '80px', 
                height: '80px',
                alignSelf: 'flex-start'
              }}>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 'medium' }}>
                  {item.name}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  {item.size && (
                    <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                      サイズ: {item.size}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                    数量: {item.quantity}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '14px', mt: 1, fontWeight: 'medium' }}>
                  {formatPrice(Number(item.price || 0) * item.quantity)}
                </Typography>
              </Box>
            </Box>
            {index < items.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </Paper>
    </Box>
  )
} 