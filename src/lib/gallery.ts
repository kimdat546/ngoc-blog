import { BLOCKS, type Block, type Document, type Inline, type Text } from "@contentful/rich-text-types";

export type GalleryLayout = "carousel" | "grid" | "slideshow";

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

// Contentful content type id of the "Image Gallery" entry authors embed in posts.
export const GALLERY_CONTENT_TYPE = "imageGallery";

const LAYOUTS: GalleryLayout[] = ["carousel", "grid", "slideshow"];

export function toGalleryLayout(value: unknown, imageCount: number): GalleryLayout {
  if (LAYOUTS.includes(value as GalleryLayout)) return value as GalleryLayout;
  return autoLayout(imageCount);
}

// Auto-grouped images: a few look best side by side, many as a carousel.
function autoLayout(imageCount: number): GalleryLayout {
  return imageCount >= 6 ? "carousel" : "grid";
}

// Resized/optimised URL from the Contentful Images API. GIFs are left alone so
// they keep animating.
export function contentfulImageUrl(src: string, width: number) {
  if (!src || /\.gif($|\?)/i.test(src)) return src;
  return `${src}?w=${width}&fm=webp&q=80`;
}

export function assetToGalleryImage(asset: any): GalleryImage | null {
  const file = asset?.fields?.file;
  if (!file?.url || !String(file.contentType).startsWith("image/")) return null;
  const { width = 1600, height = 1067 } = file.details?.image ?? {};
  const { title, description } = asset.fields;
  return {
    src: `https:${file.url}`,
    width,
    height,
    alt: description || title || "",
    caption: title || description || undefined,
  };
}

type Node = Block | Inline | Text;

function isImageAsset(node: Node) {
  return (
    node.nodeType === BLOCKS.EMBEDDED_ASSET &&
    String(node.data?.target?.fields?.file?.contentType).startsWith("image/")
  );
}

function isEmptyParagraph(node: Node) {
  return (
    node.nodeType === BLOCKS.PARAGRAPH &&
    node.content.every((c) => c.nodeType === "text" && !c.value.trim())
  );
}

// Replaces runs of 2+ consecutive top-level images (empty paragraphs between
// them are ignored) with a synthetic gallery entry, rendered like a real
// "imageGallery" entry. Single images are left untouched.
export function groupConsecutiveImages(doc: Document): Document {
  if (!doc?.content) return doc;
  const nodes = doc.content;
  const out: Node[] = [];
  let i = 0;

  while (i < nodes.length) {
    if (!isImageAsset(nodes[i])) {
      out.push(nodes[i]);
      i++;
      continue;
    }

    const run: Node[] = [nodes[i]];
    let lastImage = i;
    for (let j = i + 1; j < nodes.length; j++) {
      if (isImageAsset(nodes[j])) {
        run.push(nodes[j]);
        lastImage = j;
      } else if (!isEmptyParagraph(nodes[j])) {
        break;
      }
    }

    if (run.length === 1) {
      out.push(nodes[i]);
      i++;
      continue;
    }

    out.push({
      nodeType: BLOCKS.EMBEDDED_ENTRY,
      data: {
        target: {
          sys: {
            id: `auto-gallery-${i}`,
            type: "Entry",
            contentType: { sys: { id: GALLERY_CONTENT_TYPE } },
          },
          fields: {
            images: run.map((n) => n.data.target),
            layout: autoLayout(run.length),
          },
        },
      },
      content: [],
    } as Block);
    i = lastImage + 1;
  }

  return { ...doc, content: out as Document["content"] };
}
