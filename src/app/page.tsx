import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import BlogPosts from '@/components/BlogPosts';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <BlogPosts />
      <Contact />
      <Footer />
    </main>
  );
}
