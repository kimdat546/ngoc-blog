"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BlogPost, getBlogPosts } from "@/lib/blogData";
import { Category, getCategories } from "@/lib/categoryData";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsCalendar2Heart } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { TbClockHeart } from "react-icons/tb";
import { VscDebugDisconnect } from "react-icons/vsc";

export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allPosts = await getBlogPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);

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

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-warm-white">
      <Header />

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

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
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
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "bg-moss text-white shadow-lg"
                      : "bg-white text-sage hover:bg-sage"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeletons
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="floating-card overflow-hidden animate-pulse">
                  <div className="aspect-video bg-sage/20"></div>
                  <div className="p-6">
                    <div className="h-4 bg-sage/20 rounded mb-3"></div>
                    <div className="h-6 bg-sage/20 rounded mb-3"></div>
                    <div className="h-4 bg-sage/20 rounded mb-2"></div>
                    <div className="h-4 bg-sage/20 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredPosts.map((post) => (
                <article key={post.id} className="floating-card overflow-hidden">
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

                    <h3 className="text-xl font-bold text-forest mb-3">
                      {post.title}
                    </h3>

                    <p className="text-sage leading-relaxed mb-4">
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
              ))
            )}
          </div>

          {!loading && filteredPosts.length === 0 && (
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

      <Footer />
    </div>
  );
}
