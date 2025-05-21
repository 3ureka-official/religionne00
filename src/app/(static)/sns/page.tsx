import { Box, Container, Typography, IconButton, Divider, Paper } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'
import PinterestIcon from '@mui/icons-material/Pinterest'

import { fetchSettings } from '@/lib/microcms';

export default async function SNS() {
  const settings = await fetchSettings();
  const socialAccounts = settings.sns.map((sns) => ({
    name: sns.service,
    url: sns.url,
    icon: <img src={sns.icon.url} alt={sns.service} style={{ width: 50, height: 50 }} />,
  }));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF'
      }}
    >
      <Header />
      <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 2 }}>
        <Typography variant="h4" component="h1" sx={{
          textAlign: {xs: 'left', md: 'center'},
          fontSize: { xs: '20px', sm: '24px' },
          fontWeight: 500 
        }}>
          SNS
        </Typography>

        <Paper elevation={0} sx={{ p: {xs: 1, sm: 4}, maxWidth: 800, mx: 'auto' }}>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            flexWrap: 'wrap',
            maxWidth: 600,
            mx: 'auto',
            mb: 2
          }}>
            {socialAccounts.map((account, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <IconButton
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={account.name}
                  sx={{
                    color: 'black',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  {account.icon}
                </IconButton>
                <Typography variant="body1" sx={{ fontSize: '13px', fontWeight: 500 }}>
                  {account.name}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 2 }} />
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
}
