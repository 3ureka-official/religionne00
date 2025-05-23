'use client'

import { Box } from '@mui/material'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useState, useEffect } from 'react'
import { MicroCMSImage } from 'microcms-js-sdk'

interface BrandCarouselProps {
  brandImages: MicroCMSImage[];
}

export default function BrandCarousel({ brandImages }: BrandCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })])
  
  useEffect(() => {
    if (!emblaApi) return
    
    const onSelect = () => {
      setActiveSlide(emblaApi.selectedScrollSnap())
    }
    
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])
  
  const scrollTo = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }
  
  useEffect(() => {
    // スタイルを直接追加してemblaの余白をなくす
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
              {brandImages.map((image: MicroCMSImage, index: number) => (
                <div className="embla__slide flex basis-full min-w-0 justify-center" key={index} style={{ margin: 0, padding: 0 }}>
                  <Box sx={{
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
                  }}>
                    <Image
                      src={image.url}
                      height={image.height}
                      width={image.width}
                      alt={image.alt ?? `${index + 1} 枚目のカルーセル`}
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
          {brandImages.map((_: MicroCMSImage, index: number) => (
            <Box 
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === activeSlide ? '#000000' : 'rgba(0, 0, 0, 0.5)',
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