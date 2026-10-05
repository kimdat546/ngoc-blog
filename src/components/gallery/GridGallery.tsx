'use client';

import { RowsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/rows.css';
import { contentfulImageUrl, type GalleryImage } from '@/lib/gallery';

interface Props {
  images: GalleryImage[];
  onOpen: (index: number) => void;
}

const SRCSET_WIDTHS = [400, 800, 1200];

// Justified rows (Google Photos style): every image is shown whole, rows are
// sized so they fill the content width.
export default function GridGallery({ images, onOpen }: Props) {
  const photos = images.map((img, i) => ({
    key: img.src + i,
    src: contentfulImageUrl(img.src, 1200),
    width: img.width,
    height: img.height,
    alt: img.alt,
    srcSet: SRCSET_WIDTHS.filter((w) => w < img.width).map((w) => ({
      src: contentfulImageUrl(img.src, w),
      width: w,
      height: Math.round((img.height / img.width) * w),
    })),
  }));

  return (
    <RowsPhotoAlbum
      photos={photos}
      targetRowHeight={(containerWidth) => (containerWidth < 640 ? 160 : 260)}
      rowConstraints={(containerWidth) => (containerWidth < 640 ? { maxPhotos: 2 } : {})}
      spacing={8}
      defaultContainerWidth={896}
      sizes={{ size: '896px', sizes: [{ viewport: '(max-width: 960px)', size: 'calc(100vw - 48px)' }] }}
      onClick={({ index }) => onOpen(index)}
      componentsProps={{
        image: { className: 'rounded-lg object-cover', loading: 'lazy' },
        button: { className: 'cursor-zoom-in transition-opacity hover:opacity-90' },
      }}
    />
  );
}
