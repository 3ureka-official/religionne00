import { Box, Typography, Paper } from '@mui/material'
import { CheckoutCustomerInfo } from '@/types/checkout'

interface CustomerInfoProps extends CheckoutCustomerInfo {}

export default function CustomerInfo({ name, postalCode, address, email, phone }: CustomerInfoProps) {
  return (
    <>
      <Typography 
        sx={{ 
          fontSize: '16px', 
          fontWeight: 500, 
          mb: 2, 
          mt: 4 
        }}
      >
        配送先・連絡先
      </Typography>

      <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
        <Box sx={{ py: 1 }}>
          <Typography variant="body1">
            {name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            〒{postalCode}<br />
            {address}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {email}<br />
            {phone}
          </Typography>
        </Box>
      </Paper>
    </>
  )
} 