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
    <section id="blog" className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest mb-4 sm:mb-6">
            Latest Stories & Articles
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-sage max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Explore my recent writings about nature, adventures, and the magical
            moments that make life extraordinary.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
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

              <div className="p-4 sm:p-6">
                <div className="flex items-center text-xs sm:text-sm text-sage mb-2 sm:mb-3">
                  <div className="text-xs sm:text-sm mr-1 sm:mr-2">
                    <BsCalendar2Heart />
                  </div>
                  <span className="text-xs sm:text-sm">{new Date(post.date).toLocaleDateString()}</span>
                  <span className="mx-1 sm:mx-2">•</span>
                  <div className="text-xs sm:text-sm mr-1 sm:mr-2">
                    <TbClockHeart />
                  </div>
                  <span className="text-xs sm:text-sm">{post.readTime}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-forest mb-2 sm:mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm sm:text-base text-sage leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link
                  href={`/post/${post.id}`}
                  className="inline-flex items-center text-sm sm:text-base text-moss hover:text-forest font-medium transition-colors"
                >
                  Read More
                  <div className="icon-arrow-right text-xs sm:text-sm ml-2"></div>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center px-4">
          <Link
            href="/posts"
            className="btn-forest text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center space-x-2"
          >
            <span>View All Posts</span>
            <div className="icon-arrow-right text-base sm:text-lg"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
