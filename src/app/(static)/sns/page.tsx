import { Box, Container, Typography, IconButton, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'
import PinterestIcon from '@mui/icons-material/Pinterest'

export default function SNS() {
  const socialAccounts = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com',
      icon: <InstagramIcon sx={{ fontSize: 60 }} />,
    },
    {
      name: 'Twitter',
      url: 'https://www.twitter.com',
      icon: <TwitterIcon sx={{ fontSize: 60 }} />,
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com',
      icon: <FacebookIcon sx={{ fontSize: 60 }} />,
    },
    {
      name: 'Pinterest',
      url: 'https://www.pinterest.com',
      icon: <PinterestIcon sx={{ fontSize: 60 }} />,
    }
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F8F9FA'
      }}
    >
      <Header />
      <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          textAlign: 'center',
          mb: 4,
          fontWeight: 500
        }}>
          SNS
        </Typography>

        <Typography variant="h6" component="h2" sx={{
          textAlign: 'center',
          mb: 5,
          fontWeight: 500
        }}>
          official SNS
        </Typography>

        <Divider sx={{ mb: 5 }} />

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          flexWrap: 'wrap',
          maxWidth: 600,
          mx: 'auto',
          mb: 5
        }}>
          {socialAccounts.map((account, index) => (
            <IconButton
              key={index}
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={account.name}
              sx={{
                color: 'black',
                p: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  bgcolor: 'transparent'
                }
              }}
            >
              {account.icon}
            </IconButton>
          ))}
        </Box>

        <Divider sx={{ mb: 5 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ハッシュタグでシェア
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              #Religionne00
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              #Religionne00Style
            </Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
} 