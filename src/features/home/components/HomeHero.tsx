'use client'

import { ImageCarousel } from '@/components/carousel/carousel'
import { MicroCMSImage } from 'microcms-js-sdk'
import Image from 'next/image'

const HomeHero = ({ carouselImages }: { carouselImages: MicroCMSImage[] }) => {
  const carouselContents = carouselImages.map((image: MicroCMSImage, index: number) => (
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
    <ImageCarousel contents={carouselContents} />
  )
}

export default HomeHero 