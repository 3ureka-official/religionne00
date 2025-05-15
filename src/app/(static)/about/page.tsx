import { Box, Container, Typography } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchSettings } from '@/lib/microcms';
import { ImageCarousel } from '@/components/carousel/carousel';
import { MicroCMSImage } from 'microcms-js-sdk';
import Image from 'next/image';

export default async function About() {
  const settings = await fetchSettings();
  const brandImages = settings.brandImages;

  const carouselContents = brandImages.map((image: MicroCMSImage, index: number) => (
    <Image
      src={image.url}
      height={image.height}
      width={image.width}
      alt={image.alt ?? `${index + 1} 枚目のカルーセル`}
      key={index}
      className='h-[50vh] w-full object-cover'
    />
  ))
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
          {'The "Religionne00" Brand'}
        </Typography>


        <ImageCarousel contents={carouselContents} />
      </Container>
      <Footer />
    </Box>
  )
} 