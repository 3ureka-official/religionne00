import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { CheckoutCustomerInfo } from '@/types/checkout';

interface CustomerInfoProps {
  customer: CheckoutCustomerInfo;
}

export default function CustomerInfo({ customer }: CustomerInfoProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '16px', fontWeight: 500 }}>
        お客様情報
      </Typography>
      <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            お名前
          </Typography>
          <Typography variant="body1">
            {customer.name}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            メールアドレス
          </Typography>
          <Typography variant="body1">
            {customer.email}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            電話番号
          </Typography>
          <Typography variant="body1">
            {customer.phone}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            お届け先住所
          </Typography>
          <Typography variant="body1">
            〒{customer.postalCode}
          </Typography>
          <Typography variant="body1">
            {customer.address}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
} 