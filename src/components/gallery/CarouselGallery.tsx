'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, EffectCoverflow, Keyboard, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { contentfulImageUrl, type GalleryImage } from '@/lib/gallery';

interface Props {
  images: GalleryImage[];
  onOpen: (index: number) => void;
}

// Coverflow carousel: the centred image is large, neighbours are smaller and
// tilted. Slides keep each image's own aspect ratio (fixed height, auto width).
export default function CarouselGallery({ images, onOpen }: Props) {
  return (
    <Swiper
      className="gallery-swiper"
      modules={[EffectCoverflow, Navigation, Pagination, Keyboard, A11y]}
      effect="coverflow"
      centeredSlides
      slidesPerView="auto"
      loop={images.length >= 4}
      grabCursor
      keyboard={{ enabled: true }}
      navigation
      pagination={{ clickable: true }}
      coverflowEffect={{ rotate: 28, stretch: 0, depth: 140, modifier: 1, slideShadows: false }}
    >
      {images.map((img, i) => (
        <SwiperSlide key={img.src + i} className="!w-auto">
          <button
            type="button"
            onClick={() => onOpen(i)}
            className="block cursor-zoom-in"
            aria-label={img.alt || `Xem ảnh ${i + 1}`}
          >
            <img
              src={contentfulImageUrl(img.src, 1200)}
              alt={img.alt}
              width={img.width}
              height={img.height}
              loading="lazy"
              className="h-64 sm:h-96 w-auto max-w-[80vw] object-cover rounded-xl shadow-lg"
            />
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
