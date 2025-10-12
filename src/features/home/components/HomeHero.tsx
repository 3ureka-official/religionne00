'use client'

import { Box } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { MicroCMSImage } from 'microcms-js-sdk'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

interface Product {
  id: string
  name: string
  images: MicroCMSImage[]
}

const HomeHero = ({ 
  carouselImages, 
  products 
}: { 
  carouselImages: MicroCMSImage[]
  products: Product[] 
}) => {
  const [activeSlide, setActiveSlide] = useState(0)
  const prevSlideRef = useRef(0)
  
  const autoplay = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false })
  )
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 50 }, 
    [autoplay.current]
  )
  
  // クライアントサイドでのみランダム商品2つを選択
  const [randomProducts, setRandomProducts] = useState<Product[]>([])
  const [isClient, setIsClient] = useState(false)

  // クライアントサイドでマウント時にランダム商品2つを選択
  useEffect(() => {
    setIsClient(true)
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random())
      setRandomProducts(shuffled.slice(0, 2))
    }
  }, [products])

  useEffect(() => {
    if (!emblaApi) return
    
    const onSelect = () => {
      const currentSlide = emblaApi.selectedScrollSnap()
      setActiveSlide(currentSlide)
      
      // 2枚目（index 1）に到達した時のみ商品を変更
      if (currentSlide === 1 && prevSlideRef.current !== 1) {
        if (products && products.length > 0) {
          const shuffled = [...products].sort(() => 0.5 - Math.random())
          setRandomProducts(shuffled.slice(0, 2))
        }
      }
      
      prevSlideRef.current = currentSlide
    }
    
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, products])
  
  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index)
      autoplay.current.play()
    }
  }
  
  // カルーセルコンテンツの作成
  const carouselContents = []
  
  // 1枚目: 最初のカルーセル画像
  if (carouselImages[0]) {
    carouselContents.push(
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }}
        key="carousel-0"
      >
        <Image
          src={carouselImages[0].url}
          height={carouselImages[0].height}
          width={carouselImages[0].width}
          alt={carouselImages[0].alt ?? '1枚目のカルーセル'}
          className='w-full h-full object-cover'
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block'
          }}
          priority
        />
      </Box>
    )
  }
  
  // 2枚目: ランダムな商品2つを横並び（クライアントサイドでのみ表示）
  if (isClient && randomProducts.length > 0) {
    carouselContents.push(
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          bgcolor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          padding: 0,
          margin: 0,
        }}
        key="products-random"
      >
        {randomProducts.map((product) => (
          <Link 
            href={`/product/${product.id}`} 
            key={product.id}
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              height: '100%',
              flex: 1,
              maxWidth: '50%',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                width: '100%',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 0.9,
                }
              }}
            >
              <Image
                src={product.images[0].url}
                fill
                alt={product.name}
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              
              {/* 商品情報オーバーレイ */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  p: { xs: 1, sm: 2 },
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Box sx={{ fontSize: { xs: '8px', sm: '10px' }, mb: 0.25, opacity: 0.8 }}>
                  Featured
                </Box>
                <Box sx={{ 
                  fontSize: { xs: '12px', sm: '14px' }, 
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {product.name}
                </Box>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    )
  } else if (!isClient) {
    carouselContents.push(
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          bgcolor: '#000000',
        }}
        key="product-placeholder"
      />
    )
  }
  
  // 3枚目以降: 残りのカルーセル画像
  carouselImages.slice(1).forEach((image: MicroCMSImage, index: number) => {
    carouselContents.push(
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }}
        key={`carousel-${index + 1}`}
      >
        <Image
          src={image.url}
          height={image.height}
          width={image.width}
          alt={image.alt ?? `${index + 2}枚目のカルーセル`}
          className='w-full h-full object-cover'
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block'
          }}
        />
      </Box>
    )
  })
  
  useEffect(() => {
    const emblaElements = document.querySelectorAll('.embla, .embla__container, .embla__slide');
    emblaElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.margin = '0';
        el.style.padding = '0';
      }
    });
  }, []);
  
  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <Box sx={{ 
        width: { xs: '100vw', sm: 'auto' },
        position: { xs: 'relative', sm: 'static' },
        left: { xs: 'calc(-50vw + 50%)', sm: 'auto' },
        right: { xs: 'calc(-50vw + 50%)', sm: 'auto' },
        marginLeft: { xs: 0, sm: 'auto' },
        marginRight: { xs: 0, sm: 'auto' }
      }}>
        <div className="relative overflow-hidden">
          <div className="embla bg-background" ref={emblaRef} style={{ margin: 0, padding: 0 }}>
            <div className="embla__container" style={{ margin: 0, padding: 0 }}>
              {carouselContents.map((content, index) => (
                <div className="embla__slide flex basis-full min-w-0 justify-center" key={index} style={{ margin: 0, padding: 0 }}>
                  {content}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 16, 
            right: { xs: 16, sm: 32 },
            paddingRight: { xs: 0, sm: 0 },
            display: 'flex', 
            gap: 1,
            zIndex: 2
          }}
        >
          {carouselContents.map((_, index) => (
            <Box 
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === activeSlide ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => scrollTo(index)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default HomeHero 