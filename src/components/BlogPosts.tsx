"use client";

import { BlogPost, getBlogPosts } from "@/lib/blogData";
import { Category, getCategories } from "@/lib/categoryData";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsCalendar2Heart } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { TbClockHeart } from "react-icons/tb";

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allPosts = await getBlogPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts.slice(0, 3)); // Show only first 3 posts on homepage

      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered.slice(0, 3)); // Always show max 3 posts on homepage
  }, [posts, selectedCategory]);

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

          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-4">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                  selectedCategory === "All"
                    ? "bg-moss text-white shadow-lg"
                    : "bg-white text-sage hover:bg-sage"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "bg-moss text-white shadow-lg"
                      : "bg-white text-sage hover:bg-sage"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {loading
            ? // Loading skeletons
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="floating-card overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-sage/20"></div>
                  <div className="p-4 sm:p-6">
                    <div className="h-4 bg-sage/20 rounded mb-3"></div>
                    <div className="h-6 bg-sage/20 rounded mb-3"></div>
                    <div className="h-4 bg-sage/20 rounded mb-2"></div>
                    <div className="h-4 bg-sage/20 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            : filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="floating-card overflow-hidden"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <Link href={`/post/${post.id}`} className="block">
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
                        <span className="text-xs sm:text-sm">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <span className="mx-1 sm:mx-2">•</span>
                        <div className="text-xs sm:text-sm mr-1 sm:mr-2">
                          <TbClockHeart />
                        </div>
                        <span className="text-xs sm:text-sm">
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-forest mb-2 sm:mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sm sm:text-base text-sage leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="inline-flex items-center text-sm sm:text-base text-moss hover:text-forest font-medium transition-colors">
                        Đọc nè
                        <FaArrowRightLong className="ml-2" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
        </div>

        <div className="text-center px-4">
          <Link
            href="/posts"
            className="btn-forest text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center space-x-2"
          >
            <span>Xem tất cả bài viết</span>
            <FaArrowRightLong />
          </Link>
        </div>
      </div>
    </section>
  );
}
