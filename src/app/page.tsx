import Hero from '@/components/Hero';
import About from '@/components/About';
import BlogPosts from '@/components/BlogPosts';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getBlogPosts, toPostSummary } from '@/lib/blogData';
import { getCategories } from '@/lib/categoryData';

// Rebuilt in the background at most every 10 minutes (and on demand via /api/revalidate).
export const revalidate = 600;

export default async function Home() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getCategories()]);

  return (
    <main>
      <Hero />
      <About />
      <BlogPosts posts={posts.map((p) => toPostSummary(p))} categories={categories} />
      <Contact />
      <Footer />
    </main>
  );
}
