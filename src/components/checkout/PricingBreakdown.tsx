import { Box, Typography, Paper, Divider } from '@mui/material'
import { CheckoutPricing } from '@/types/checkout'
import { getPaymentMethodLabel } from '@/utils/checkout'

interface PricingBreakdownProps extends CheckoutPricing {}

export default function PricingBreakdown({ subtotal, shippingFee, total, paymentMethod }: PricingBreakdownProps) {
  return (
    <>
      {/* お支払い方法 */}
      <Typography 
        sx={{ 
          fontSize: '16px', 
          fontWeight: 500, 
          mb: 2
        }}
      >
        お支払い方法
      </Typography>

      <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
        <Typography sx={{ fontSize: '14px' }}>
          {getPaymentMethodLabel(paymentMethod)}
        </Typography>
      </Paper>

      {/* 金額明細 */}
      <Typography 
        sx={{ 
          fontSize: '16px', 
          fontWeight: 500, 
          mb: 2
        }}
      >
        お支払い金額
      </Typography>

      <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 0.5 }}>
              商品合計
            </Typography>
            <Typography sx={{ fontSize: '14px' }}>
              ¥{subtotal.toLocaleString()}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 0.5 }}>
              送料
            </Typography>
            <Typography sx={{ fontSize: '14px' }}>
              ¥{shippingFee.toLocaleString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 'bold', mb: 0.5 }}>
              合計（税込）
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
              ¥{total.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </>
  )
} 