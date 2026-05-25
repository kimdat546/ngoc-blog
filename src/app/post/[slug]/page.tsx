import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollAutoplayVideo from "@/components/ScrollAutoplayVideo";
import PostDisclaimer from "@/components/PostDisclaimer";
import YouTubeEmbed, { parseYouTubeUrl } from "@/components/YouTubeEmbed";
import CommentSection from "@/components/CommentSection";
import {
  getBlogPosts,
  getPostById,
  getPostBySlug,
} from "@/lib/blogData";
import { BsCalendar2Heart } from "react-icons/bs";
import { TbClockHeart } from "react-icons/tb";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, Block, Inline } from "@contentful/rich-text-types";
import type { ReactNode } from "react";

// Contentful sys.id: 22-char base62 (alphanumeric, no hyphens). Slugs are kebab-case with hyphens.
const CONTENTFUL_ID_RE = /^[A-Za-z0-9]{22}$/;

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

  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-warm-white">
      <Header />

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
            <span className="px-4 py-2 bg-moss text-white rounded-full text-sm font-medium">
              {post.category}
            </span>
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
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="text-xl text-sage leading-relaxed mb-8">
            {documentToReactComponents(post.excerptRichText, {
              renderNode: {
                [BLOCKS.PARAGRAPH]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => <p className="mb-4">{children}</p>,
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
                  const linkText = (node as Inline).content
                    .map((c: any) => (typeof c?.value === "string" ? c.value : ""))
                    .join("")
                    .trim();
                  const isBareUrl = linkText === "" || linkText === uri;
                  const yt = isBareUrl ? parseYouTubeUrl(uri) : null;
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

          <div className="text-lg leading-relaxed text-forest">
            {documentToReactComponents(post.contentRichText, {
              renderNode: {
                [BLOCKS.PARAGRAPH]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => <p className="mb-6">{children}</p>,
                [BLOCKS.HEADING_1]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => (
                  <h1 className="text-3xl font-bold mb-4 mt-8">{children}</h1>
                ),
                [BLOCKS.HEADING_2]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => (
                  <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>
                ),
                [BLOCKS.HEADING_3]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => (
                  <h3 className="text-xl font-bold mb-3 mt-4">{children}</h3>
                ),
                [BLOCKS.QUOTE]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => (
                  <blockquote className="blog-quote">
                    <div className="quote-content">{children}</div>
                  </blockquote>
                ),
                [BLOCKS.UL_LIST]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => <ul className="list-disc ml-6 mb-6">{children}</ul>,
                [BLOCKS.OL_LIST]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => <ol className="list-decimal ml-6 mb-6">{children}</ol>,
                [BLOCKS.LIST_ITEM]: (
                  _node: Block | Inline,
                  children: ReactNode
                ) => <li className="mb-2">{children}</li>,
                [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
                  const { file, title, description } = node.data.target.fields;
                  const assetUrl = file?.url ? `https:${file.url}` : "";
                  const contentType: string = file?.contentType || "";
                  const caption = title || description || "";

                  if (contentType.startsWith("video/")) {
                    return (
                      <ScrollAutoplayVideo
                        src={assetUrl}
                        type={contentType}
                        caption={caption || undefined}
                      />
                    );
                  }

                  if (contentType.startsWith("audio/")) {
                    return (
                      <div className="my-8 flex flex-col items-center">
                        <audio controls src={assetUrl} className="w-full max-w-2xl" />
                        {caption && (
                          <p className="text-sm text-sage text-center mt-2 italic">
                            {caption}
                          </p>
                        )}
                      </div>
                    );
                  }

                  const width = file?.details?.image?.width;

                  return (
                    <div className="my-8 flex flex-col items-center">
                      <img
                        src={assetUrl}
                        alt={title || description || ""}
                        className="rounded-lg"
                        style={{
                          width: width ? `${Math.min(width, 896)}px` : "auto",
                          height: "auto",
                          maxWidth: "100%",
                        }}
                      />
                      {(title || description) && (
                        <p className="text-sm text-sage text-center mt-2 italic">
                          {title || description}
                        </p>
                      )}
                    </div>
                  );
                },
                [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
                  const contentType = node.data.target.sys.contentType?.sys?.id;
                  const fields = node.data.target.fields;

                  if (contentType === "blogPost") {
                    return (
                      <div className="my-8 p-6 bg-cream rounded-lg border-l-4 border-moss">
                        <h4 className="text-lg font-bold text-forest mb-2">
                          🍃 Related Post: {fields.title}
                        </h4>
                        <p className="text-sage mb-3">
                          {fields.excerpt?.content?.[0]?.content?.[0]?.value ||
                            ""}
                        </p>
                        <Link
                          href={`/post/${fields.slug || node.data.target.sys.id}`}
                          className="text-moss hover:text-forest font-medium"
                        >
                          Đọc tiếp nè →
                        </Link>
                      </div>
                    );
                  }

                  return (
                    <div className="my-8 p-6 bg-cream rounded-lg">
                      <p className="text-sm text-sage italic">
                        Embedded content: {contentType || "Unknown type"}
                      </p>
                      {fields.title && (
                        <h4 className="font-bold text-forest mt-2">
                          {fields.title}
                        </h4>
                      )}
                      {fields.description && (
                        <p className="text-sage mt-2">{fields.description}</p>
                      )}
                    </div>
                  );
                },
                [INLINES.HYPERLINK]: (
                  node: Block | Inline,
                  children: ReactNode
                ) => {
                  const uri = (node as Inline).data.uri as string;
                  const linkText = (node as Inline).content
                    .map((c: any) => (typeof c?.value === "string" ? c.value : ""))
                    .join("")
                    .trim();
                  const isBareUrl = linkText === "" || linkText === uri;
                  const yt = isBareUrl ? parseYouTubeUrl(uri) : null;
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
                [INLINES.EMBEDDED_ENTRY]: (node: any) => {
                  const contentType = node.data.target.sys.contentType?.sys?.id;
                  const fields = node.data.target.fields;

                  if (contentType === "blogPost" && fields.title) {
                    return (
                      <Link
                        href={`/post/${fields.slug || node.data.target.sys.id}`}
                        className="inline-flex items-center gap-1 text-moss hover:text-forest font-medium transition-colors border-b-2 border-moss/30 hover:border-moss"
                      >
                        <span>🍃</span>
                        <span>{fields.title}</span>
                      </Link>
                    );
                  }

                  return (
                    <span className="inline-flex items-center gap-1 text-moss font-medium italic">
                      <span>✨</span>
                      <span>{fields.title || fields.name || "content"}</span>
                    </span>
                  );
                },
              },
            })}
          </div>
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
                      src={relatedPost.image}
                      alt={relatedPost.title}
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
