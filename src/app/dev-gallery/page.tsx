// Example page showing every gallery layout with real Contentful images (kept for reference; remove when no longer needed).
import ImageGallery from "@/components/gallery/ImageGallery";
import { assetToGalleryImage, type GalleryImage } from "@/lib/gallery";
import client from "@/lib/contentful";

export default async function DevGallery() {
  const res = await client.getEntries({ content_type: "blogPost", limit: 100, include: 2 } as any);
  const images = res.items
    .flatMap((p: any) => p.fields.content?.content ?? [])
    .filter((n: any) => n.nodeType === "embedded-asset-block")
    .map((n: any) => assetToGalleryImage(n.data.target))
    .filter((i): i is GalleryImage => i !== null)
    .slice(0, 8);
  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl">
      {(["carousel", "slideshow", "grid"] as const).map((layout) => (
        <section key={layout} id={layout} className="mb-24">
          <h2 className="text-2xl mb-4">{layout}</h2>
          <ImageGallery images={images} layout={layout} title={`Ví dụ ${layout}`} />
        </section>
      ))}
    </main>
  );
}
