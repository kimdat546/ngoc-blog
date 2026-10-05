'use client';

import { useState } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, EffectFade, Keyboard, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { contentfulImageUrl, type GalleryImage } from '@/lib/gallery';

interface Props {
  images: GalleryImage[];
  onOpen: (index: number) => void;
}

// One large image at a time (cross-fade) with a thumbnail strip to jump around.
export default function SlideshowGallery({ images, onOpen }: Props) {
  const [thumbs, setThumbs] = useState<SwiperInstance | null>(null);

  return (
    <div className="gallery-swiper">
      <Swiper
        modules={[EffectFade, Navigation, Thumbs, Keyboard, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation
        keyboard={{ enabled: true }}
        thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
        className="rounded-2xl bg-cream overflow-hidden"
      >
        {images.map((img, i) => (
          <SwiperSlide key={img.src + i}>
            <button
              type="button"
              onClick={() => onOpen(i)}
              className="block w-full aspect-[4/3] cursor-zoom-in"
              aria-label={img.alt || `Xem ảnh ${i + 1}`}
            >
              <img
                src={contentfulImageUrl(img.src, 1600)}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbs}
        slidesPerView="auto"
        spaceBetween={8}
        watchSlidesProgress
        className="gallery-thumbs mt-3"
      >
        {images.map((img, i) => (
          <SwiperSlide key={img.src + i} className="!w-20 sm:!w-24">
            <img
              src={contentfulImageUrl(img.src, 200)}
              alt=""
              loading="lazy"
              className="w-full aspect-[4/3] object-cover rounded-md cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
