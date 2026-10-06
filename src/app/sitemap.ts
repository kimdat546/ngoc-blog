import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blogData";
import { getCategories } from "@/lib/categoryData";
import { SITE_URL } from "@/lib/site";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getBlogPosts(), getCategories()]);
  const latest = posts[0]?.updatedAt;

  return [
    { url: SITE_URL, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/posts`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    ...categories
      .filter((c) => c.slug)
      .map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...posts
      .filter((p) => p.slug)
      .map((p) => ({ url: `${SITE_URL}/post/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
