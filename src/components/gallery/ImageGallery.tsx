'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { contentfulImageUrl, type GalleryImage, type GalleryLayout } from '@/lib/gallery';
import CarouselGallery from './CarouselGallery';
import GridGallery from './GridGallery';
import SlideshowGallery from './SlideshowGallery';

interface Props {
  images: GalleryImage[];
  layout: GalleryLayout;
  title?: string;
}

// Renders a group of post images in the chosen layout. Clicking any image opens
// a fullscreen lightbox with zoom and swipe.
export default function ImageGallery({ images, layout, title }: Props) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <figure className="not-prose my-10">
      {layout === 'carousel' && <CarouselGallery images={images} onOpen={setOpenIndex} />}
      {layout === 'grid' && <GridGallery images={images} onOpen={setOpenIndex} />}
      {layout === 'slideshow' && <SlideshowGallery images={images} onOpen={setOpenIndex} />}

      {title && (
        <figcaption className="text-sm text-sage text-center mt-3 italic">{title}</figcaption>
      )}

      <Lightbox
        open={openIndex >= 0}
        index={openIndex}
        close={() => setOpenIndex(-1)}
        slides={images.map((img) => ({
          src: contentfulImageUrl(img.src, 2400),
          width: img.width,
          height: img.height,
          alt: img.alt,
          description: img.caption,
        }))}
        plugins={[Zoom, Counter, Captions]}
        controller={{ closeOnBackdropClick: true }}
        styles={{ root: { '--yarl__color_backdrop': 'rgb(20, 35, 25)' } }}
      />
    </figure>
  );
}
