import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import { CheckoutPricing } from '@/types/checkout';

interface PricingBreakdownProps {
  pricing: CheckoutPricing;
}

export default function PricingBreakdown({ pricing }: PricingBreakdownProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '16px', fontWeight: 500 }}>
        お支払い内容
      </Typography>
      <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            小計
          </Typography>
          <Typography variant="body2">
            ¥{pricing.subtotal.toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            送料
          </Typography>
          <Typography variant="body2">
            ¥{pricing.shippingFee.toLocaleString()}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            合計
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            ¥{pricing.total.toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            お支払い方法
          </Typography>
          <Typography variant="body2">
            {pricing.paymentMethod === 'credit' ? 'クレジットカード' : '代引き'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
} 