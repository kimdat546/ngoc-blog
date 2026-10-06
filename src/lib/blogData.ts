import { cache } from 'react';
import client from './contentful';
import { Entry, EntrySkeletonType } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { stripColorSyntax } from './textColor';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  excerptRichText: Document;
  content: string;
  contentRichText: Document;
  category: string;
  categoryId: string;
  categorySlug: string;
  date: string;
  readTime: string;
  featured: boolean;
  image: string;
  updatedAt: string;
}

interface ContentfulBlogPost extends EntrySkeletonType {
  contentTypeId: 'blogPost';
  fields: {
    title: string;
    slug: string;
    excerpt: Document;
    content: Document;
    category?: Entry<{
      contentTypeId: 'category';
      fields: {
        name: string;
        slug: string;
      };
    }, undefined, string>;
    publishDate: string;
    readTime: string;
    featuredImage?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
  };
}

function transformContentfulPost(entry: any): BlogPost {
  const fields = entry.fields;
  const categoryName = fields.category?.fields?.name || '';
  const imageUrl = fields.featuredImage?.fields?.file?.url ? `https:${fields.featuredImage.fields.file.url}` : '';

  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    excerpt: stripColorSyntax(documentToPlainTextString(fields.excerpt)),
    excerptRichText: fields.excerpt,
    content: stripColorSyntax(documentToPlainTextString(fields.content)),
    contentRichText: fields.content,
    category: categoryName,
    categoryId: fields.category?.sys?.id || '',
    categorySlug: fields.category?.fields?.slug || '',
    date: fields.publishDate,
    readTime: fields.readTime,
    featured: false, // You can add a "featured" boolean field if needed
    image: imageUrl,
    updatedAt: entry.sys.updatedAt,
  };
}

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      order: ['-fields.publishDate'] as any,
    });
    return response.items.map(transformContentfulPost);
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    return [];
  }
});

export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      order: ['-fields.publishDate'] as any,
      limit: 3,
    });
    return response.items.map(transformContentfulPost);
  } catch (error) {
    console.error('Error fetching featured posts from Contentful:', error);
    return [];
  }
};

export const getPostsByCategoryIds = async (categoryIds: string[]): Promise<BlogPost[]> => {
  if (categoryIds.length === 0) return [];
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.category.sys.id[in]': categoryIds.join(','),
      order: ['-fields.publishDate'] as any,
    } as any);
    return response.items.map(transformContentfulPost);
  } catch (error) {
    console.error('Error fetching posts by category ids:', error);
    return [];
  }
};

export const getPostsByCategory = async (categorySlug: string): Promise<BlogPost[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.category.sys.contentType.sys.id': 'category',
      'fields.category.fields.slug': categorySlug,
      order: ['-fields.publishDate'] as any,
    } as any);
    return response.items.map(transformContentfulPost);
  } catch (error) {
    console.error('Error fetching posts by category from Contentful:', error);
    return [];
  }
};

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
      include: 3, // resolve assets inside embedded gallery entries
    } as any);
    if (response.items.length === 0) return null;
    return transformContentfulPost(response.items[0]);
  } catch (error) {
    console.error('Error fetching post by slug from Contentful:', error);
    return null;
  }
});

export const getPostById = cache(async (id: string): Promise<BlogPost | null> => {
  try {
    const entry = await client.getEntry(id, { include: 3 });
    return transformContentfulPost(entry);
  } catch (error) {
    console.error('Error fetching post by ID from Contentful:', error);
    return null;
  }
});

// Latest posts in the same category (excluding the post itself).
export const getRelatedPosts = async (post: BlogPost, limit = 3): Promise<BlogPost[]> => {
  if (!post.categoryId) return [];
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.category.sys.id': post.categoryId,
      'sys.id[ne]': post.id,
      order: ['-fields.publishDate'] as any,
      limit,
    } as any);
    return response.items.map(transformContentfulPost);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
};

// Lightweight shape for listing pages rendered by client components (keeps the
// rich-text documents out of the client payload).
export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  date: string;
  readTime: string;
  image: string;
  searchText?: string;
}

export function toPostSummary(post: BlogPost, { withSearchText = false } = {}): PostSummary {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    categorySlug: post.categorySlug,
    date: post.date,
    readTime: post.readTime,
    image: post.image,
    ...(withSearchText
      ? { searchText: `${post.title}\n${post.excerpt}\n${post.content}`.toLowerCase() }
      : {}),
  };
}
