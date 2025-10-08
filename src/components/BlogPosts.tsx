"use client";

import { BlogPost, getBlogPosts } from "@/lib/blogData";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsCalendar2Heart } from "react-icons/bs";
import { TbClockHeart } from "react-icons/tb";

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const allPosts = getBlogPosts();
    setPosts(allPosts.slice(0, 3)); // Show only first 3 posts on homepage
  }, []);

  const categories = ["All", "Story", "Article", "Adventure"];

  return (
    <section id="blog" className="py-20 bg-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-forest mb-6">
            Latest Stories & Articles
          </h2>
          <p className="text-xl text-sage max-w-3xl mx-auto mb-8">
            Explore my recent writings about nature, adventures, and the magical
            moments that make life extraordinary.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-moss text-white shadow-lg"
                    : "bg-white text-sage hover:bg-sage"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="floating-card overflow-hidden"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="aspect-video bg-sage/20 relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-moss text-white rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-sage mb-3">
                  <div className="text-sm mr-2">
                    <BsCalendar2Heart />
                  </div>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <div className="text-sm mr-2">
                    <TbClockHeart />
                  </div>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-forest mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sage leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link
                  href={`/post/${post.id}`}
                  className="inline-flex items-center text-moss hover:text-forest font-medium transition-colors"
                >
                  Read More
                  <div className="icon-arrow-right text-sm ml-2"></div>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/posts"
            className="btn-forest text-lg px-8 py-4 inline-flex items-center space-x-2"
          >
            <span>View All Posts</span>
            <div className="icon-arrow-right text-lg"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
