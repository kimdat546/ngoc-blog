import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import {
  getCategories,
  getCategoryBySlug,
  getChildCategories,
} from "@/lib/categoryData";
import { contentfulImageUrl } from "@/lib/gallery";
import { getPostsByCategoryIds } from "@/lib/blogData";
import { BsCalendar2Heart } from "react-icons/bs";
import { TbClockHeart } from "react-icons/tb";

// Prebuilt at deploy, refreshed at most every 10 minutes (and via /api/revalidate).
export const revalidate = 600;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.filter((c) => c.slug).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  const title = category.name;
  const description = category.description || `Bài viết về ${category.name}`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: { title, description, url: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [children, allCategories] = await Promise.all([
    getChildCategories(category.id),
    getCategories(),
  ]);
  // Parent may be unpublished/deleted; then the back link falls back to /posts.
  const parent = allCategories.find((c) => c.id === category.parentId) ?? null;
  const allIds = [category.id, ...children.map((c) => c.id)];
  const posts = await getPostsByCategoryIds(allIds);

  return (
    <div className="min-h-screen bg-warm-white">

      <section className="container mx-auto px-6 py-12 max-w-6xl pt-24">
        <div className="text-center mb-12">
          <Link
            href={parent ? `/category/${parent.slug}` : "/posts"}
            className="inline-flex items-center text-moss hover:text-forest mb-6"
          >
            <span className="text-sm mr-2">←</span> {parent ? parent.name : "All Posts"}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">
            {category.name}
          </h1>
          <p className="text-sage">
            {posts.length} {posts.length === 1 ? "bài viết" : "bài viết"}
            {children.length > 0 && (
              <span> · bao gồm {children.length} chuyên mục con</span>
            )}
          </p>
          {category.description && (
            <p className="mt-4 max-w-2xl mx-auto text-lg text-forest/80 leading-relaxed whitespace-pre-line">
              {category.description}
            </p>
          )}
          {children.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {children.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="px-3 py-1 text-sm rounded-full border border-moss/30 text-moss hover:bg-moss hover:text-white transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 text-sage">
            Chưa có bài viết nào trong chuyên mục này.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="floating-card overflow-hidden">
                <Link href={`/post/${post.slug}`} className="block">
                  <div className="aspect-video bg-sage/20 relative overflow-hidden">
                    <img
                      src={contentfulImageUrl(post.image, 800)}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <span className="px-3 py-1 bg-moss text-white rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-xs text-sage mb-2 gap-3">
                      <span className="inline-flex items-center gap-1">
                        <BsCalendar2Heart />
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <TbClockHeart />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-forest mb-2">{post.title}</h3>
                    <p className="text-sm text-sage">
                      {post.excerpt.substring(0, 120)}
                      {post.excerpt.length > 120 ? "..." : ""}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
