import { ImageZoom } from '@/components/image-zoom'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type Props = {
  images: string[]
}

export const ImageCarousel = ({ images }: Props) => {
  return (
    <Carousel opts={{ align: 'start' }}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index.toString()} className={'basis-1/6'}>
            <AspectRatio
              ratio={1}
              className={'bg-zinc-100/10 rounded overflow-hidden'}
            >
              <ImageZoom
                src={image}
                alt={''}
                className={'w-full h-full object-contain object-center'}
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
