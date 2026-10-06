"use client";

import type { PostSummary } from "@/lib/blogData";
import type { Category } from "@/lib/categoryData";
import { contentfulImageUrl } from "@/lib/gallery";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BsCalendar2Heart } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { TbClockHeart } from "react-icons/tb";
import { VscDebugDisconnect } from "react-icons/vsc";

// Interactive part of /posts: category filter + search over server-provided posts.
export default function PostsBrowser({ posts, categories }: { posts: PostSummary[]; categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedDescription = categories.find(
    (c) => c.name === selectedCategory
  )?.description;

  // Preselect the category from ?category=<slug> (e.g. a post's category badge).
  // Read on the client so the page itself stays static/cacheable.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("category");
    const fromUrl = categories.find((c) => c.slug === slug);
    if (fromUrl) setSelectedCategory(fromUrl.name);
  }, [categories]);

  const selectCategory = (category: Category | null) => {
    setSelectedCategory(category ? category.name : "All");
    // Keep the URL in sync so the filtered view can be shared or reloaded.
    const url = category ? `/posts?category=${category.slug}` : "/posts";
    window.history.replaceState(null, "", url);
  };

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((post) => post.searchText?.includes(q));
    }
    return filtered;
  }, [posts, selectedCategory, searchTerm]);

  return (
    <>

      <div className="pt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-forest mb-6">
              All Stories & Articles
            </h1>
            <p className="text-xl text-sage max-w-3xl mx-auto mb-8">
              Explore all my writings about nature, adventures, and magical
              moments
            </p>

            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-full border border-sage/30 focus:outline-none focus:ring-1 focus:ring-moss"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sage">
                  <IoSearch className="size-5" />
                </div>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => selectCategory(null)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === "All"
                      ? "bg-moss text-white shadow-lg"
                      : "bg-white text-sage hover:bg-sage hover:text-white"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => selectCategory(category)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === category.name
                        ? "bg-moss text-white shadow-lg"
                        : "bg-white text-sage hover:bg-sage hover:text-white"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {selectedDescription && (
              <p className="mt-8 max-w-2xl mx-auto text-lg text-forest/80 leading-relaxed whitespace-pre-line">
                {selectedDescription}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
                  <article key={post.id} className="floating-card overflow-hidden">
                    <Link href={`/post/${post.slug}`} className="block">
                      <div className="aspect-video bg-sage/20 relative overflow-hidden">
                        <img
                          src={contentfulImageUrl(post.image, 800)}
                          alt={post.title}
                          loading="lazy"
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

                        <h3 className="text-xl font-bold text-forest mb-3">
                          {post.title}
                        </h3>

                        <p className="text-sage leading-relaxed mb-4">
                          {post.excerpt}
                        </p>

                        <div className="inline-flex items-center text-moss hover:text-forest font-medium transition-colors">
                          Đọc nè
                          <FaArrowRightLong className="ml-2" />
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl text-moss">
                  <VscDebugDisconnect className="size-12" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-forest mb-2">
                No posts found
              </h3>
              <p className="text-sage">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
