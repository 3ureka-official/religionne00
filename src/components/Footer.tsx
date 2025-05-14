'use client'

import { Box, Container, Link, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box component="footer" sx={{ 
      borderTop: '1px solid #000', 
      py: 3, 
      bgcolor: 'white',
      mt: 'auto' 
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Link href="/guide" underline="hover" sx={{ color: 'black', fontSize: '12px' }}>
              Shopping Guide
            </Link>
            <Link href="/privacy" underline="hover" sx={{ color: 'black', fontSize: '12px' }}>
              Privacy Policy
            </Link>
          </Box>
          
          <Typography variant="body2" sx={{ fontSize: '12px', color: '#555' }}>
            © {new Date().getFullYear()} Religionne00. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer 