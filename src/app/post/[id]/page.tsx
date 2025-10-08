'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBlogPosts, getPostById, BlogPost } from '@/lib/blogData';
import { BsCalendar2Heart } from 'react-icons/bs';
import { TbClockHeart } from 'react-icons/tb';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const postId = params.id as string;

      if (postId) {
        const foundPost = await getPostById(postId);
        setPost(foundPost);

        if (foundPost) {
          const allPosts = await getBlogPosts();
          const related = allPosts
            .filter(p => p.id !== foundPost.id && p.category === foundPost.category)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Header />
        <article className="container mx-auto px-6 py-12 max-w-4xl pt-24 animate-pulse">
          <div className="mb-8">
            <div className="h-8 bg-sage/20 rounded w-32 mb-6"></div>
            <div className="h-4 bg-sage/20 rounded w-24 mb-6"></div>
            <div className="h-12 bg-sage/20 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-sage/20 rounded w-48 mb-8"></div>
          </div>
          <div className="aspect-video bg-sage/20 rounded-2xl mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-sage/20 rounded"></div>
            <div className="h-4 bg-sage/20 rounded"></div>
            <div className="h-4 bg-sage/20 rounded w-5/6"></div>
          </div>
        </article>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Header />
        <div className="flex items-center justify-center pt-24 min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-forest mb-4">Post not found</h1>
            <Link href="/posts" className="btn-forest">View All Posts</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                [BLOCKS.PARAGRAPH]: (node, children) => (
                  <p className="mb-4">{children}</p>
                ),
              },
            })}
          </div>

          <div className="text-lg leading-relaxed text-forest">
            {documentToReactComponents(post.contentRichText, {
              renderNode: {
                [BLOCKS.PARAGRAPH]: (node, children) => (
                  <p className="mb-6">{children}</p>
                ),
                [BLOCKS.HEADING_1]: (node, children) => (
                  <h1 className="text-3xl font-bold mb-4 mt-8">{children}</h1>
                ),
                [BLOCKS.HEADING_2]: (node, children) => (
                  <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>
                ),
                [BLOCKS.HEADING_3]: (node, children) => (
                  <h3 className="text-xl font-bold mb-3 mt-4">{children}</h3>
                ),
                [BLOCKS.UL_LIST]: (node, children) => (
                  <ul className="list-disc ml-6 mb-6">{children}</ul>
                ),
                [BLOCKS.OL_LIST]: (node, children) => (
                  <ol className="list-decimal ml-6 mb-6">{children}</ol>
                ),
                [BLOCKS.LIST_ITEM]: (node, children) => (
                  <li className="mb-2">{children}</li>
                ),
              },
            })}
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-sage/20">
            <h3 className="text-2xl font-bold text-forest mb-8">
              Related Posts
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/post/${relatedPost.id}`}
                  className="floating-card overflow-hidden block"
                >
                  <div className="aspect-video bg-sage/20 overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
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
