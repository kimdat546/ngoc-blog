import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Footer from "@/components/Footer";
import PostDisclaimer from "@/components/PostDisclaimer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { getEmbeddableYouTube, paragraphHasYouTubeEmbed } from "@/lib/youtube";
import CommentSection from "@/components/CommentSection";
import PostContent from "@/components/PostContent";
import { renderColoredText } from "@/lib/textColor";
import {
  getBlogPosts,
  getPostById,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blogData";
import { contentfulImageUrl } from "@/lib/gallery";
import { BsCalendar2Heart } from "react-icons/bs";
import { TbClockHeart } from "react-icons/tb";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, Block, Inline } from "@contentful/rich-text-types";
import type { ReactNode } from "react";

// Contentful sys.id: 22-char base62 (alphanumeric, no hyphens). Slugs are kebab-case with hyphens.
const CONTENTFUL_ID_RE = /^[A-Za-z0-9]{22}$/;

// Pages are prebuilt at deploy and refreshed in the background at most every
// 10 minutes (and on demand via /api/revalidate). New slugs render on first visit.
export const revalidate = 600;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (CONTENTFUL_ID_RE.test(slug)) {
    return {};
  }

  const post = await getPostBySlug(slug);
  if (!post) return {};

  const description = post.excerpt.slice(0, 200).trim();
  const url = `/post/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      images: post.image ? [post.image] : undefined,
      publishedTime: post.date,
      tags: post.category ? [post.category] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (CONTENTFUL_ID_RE.test(slug)) {
    const legacyPost = await getPostById(slug);
    if (legacyPost?.slug) {
      permanentRedirect(`/post/${legacyPost.slug}`);
    }
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);
  // Structured data so search engines understand this is a blog post.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt.slice(0, 200),
    image: post.image ? [post.image] : undefined,
    datePublished: post.date,
    dateModified: post.updatedAt,
    articleSection: post.category || undefined,
    inLanguage: "vi",
    mainEntityOfPage: `${SITE_URL}/post/${post.slug}`,
    publisher: { "@type": "Organization", name: "My Forest Blog" },
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="container mx-auto px-6 py-12 max-w-4xl pt-24">
        <div className="mb-8">
          <Link
            href="/posts"
            className="inline-flex items-center text-moss hover:text-forest mb-6"
          >
            <div className="text-sm mr-2">←</div>
            Back to Posts
          </Link>

          <div className="mb-6">
            {post.categorySlug ? (
              <Link
                href={`/posts?category=${post.categorySlug}`}
                className="px-4 py-2 bg-moss hover:bg-forest text-white rounded-full text-sm font-medium transition-colors"
              >
                {post.category}
              </Link>
            ) : (
              <span className="px-4 py-2 bg-moss text-white rounded-full text-sm font-medium">
                {post.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-forest mb-6">
            {post.title}
          </h1>

          <div className="flex items-center text-sage mb-8">
            <div className="text-sm mr-2">
              <BsCalendar2Heart />
            </div>
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span className="mx-3">•</span>
            <div className="text-sm mr-2">
              <TbClockHeart />
            </div>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="aspect-video bg-sage/20 rounded-2xl overflow-hidden mb-8">
          <img
            src={contentfulImageUrl(post.image, 1600)}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="text-xl text-sage leading-relaxed mb-8">
            {documentToReactComponents(post.excerptRichText, {
              renderText: renderColoredText,
              renderNode: {
                [BLOCKS.PARAGRAPH]: (
                  node: Block | Inline,
                  children: ReactNode
                ) =>
                  paragraphHasYouTubeEmbed(node) ? (
                    <div className="mb-4">{children}</div>
                  ) : (
                    <p className="mb-4">{children}</p>
                  ),
                [BLOCKS.QUOTE]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => (
                  <blockquote className="blog-quote">
                    <div className="quote-content text-lg leading-relaxed text-forest">
                      {children}
                    </div>
                  </blockquote>
                ),
                [INLINES.HYPERLINK]: (
                  node: Block | Inline,
                  children: ReactNode
                ) => {
                  const uri = (node as Inline).data.uri as string;
                  const yt = getEmbeddableYouTube(node as Inline);
                  if (yt) {
                    return <YouTubeEmbed videoId={yt.videoId} start={yt.start} />;
                  }
                  return (
                    <a
                      href={uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-moss underline underline-offset-2 cursor-pointer hover:text-forest transition-colors break-words"
                    >
                      {children}
                    </a>
                  );
                },
              },
            })}
          </div>

          <PostContent document={post.contentRichText} />
        </div>

        <PostDisclaimer />

        <CommentSection
          postSlug={post.slug}
          postId={post.id}
          postTitle={post.title}
        />

        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-sage/20">
            <h3 className="text-2xl font-bold text-forest mb-8">
              Related Posts
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/post/${relatedPost.slug}`}
                  className="floating-card overflow-hidden block"
                >
                  <div className="aspect-video bg-sage/20 relative overflow-hidden">
                    <img
                      src={contentfulImageUrl(relatedPost.image, 800)}
                      alt={relatedPost.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <span className="px-3 py-1 bg-moss text-white rounded-full text-xs font-medium">
                        {relatedPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="py-4">
                    <h4 className="font-bold text-forest mb-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-sage">
                      {relatedPost.excerpt.substring(0, 100)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
