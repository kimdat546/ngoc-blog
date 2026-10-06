import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PostsBrowser from "@/components/PostsBrowser";
import { getBlogPosts, toPostSummary } from "@/lib/blogData";
import { getCategories } from "@/lib/categoryData";

export const metadata: Metadata = {
  title: "Tất cả bài viết",
  description: "Tất cả câu chuyện, bài viết và trải nghiệm trên My Forest Blog.",
  alternates: { canonical: "/posts" },
};

// Rebuilt in the background at most every 10 minutes (and on demand via /api/revalidate).
export const revalidate = 600;

export default async function PostsPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getCategories()]);

  return (
    <div className="min-h-screen bg-warm-white">
      <PostsBrowser
        posts={posts.map((p) => toPostSummary(p, { withSearchText: true }))}
        categories={categories}
      />
      <Footer />
    </div>
  );
}
