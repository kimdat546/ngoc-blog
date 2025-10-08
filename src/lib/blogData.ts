import client from './contentful';
import { Entry } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  excerptRichText: Document;
  content: string;
  contentRichText: Document;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  image: string;
}

interface ContentfulBlogPost {
  title: string;
  slug: string;
  excerpt: Document;
  content: Document;
  category: {
    sys: {
      id: string;
    };
    fields: {
      name: string;
      slug: string;
    };
  };
  publishDate: string;
  readTime: string;
  featuredImage: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

function transformContentfulPost(entry: Entry<ContentfulBlogPost>): BlogPost {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    excerpt: documentToPlainTextString(fields.excerpt),
    excerptRichText: fields.excerpt,
    content: documentToPlainTextString(fields.content),
    contentRichText: fields.content,
    category: fields.category?.fields?.name || '',
    date: fields.publishDate,
    readTime: fields.readTime,
    featured: false, // You can add a "featured" boolean field if needed
    image: fields.featuredImage?.fields?.file?.url ? `https:${fields.featuredImage.fields.file.url}` : '',
  };
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await client.getEntries<ContentfulBlogPost>({
      content_type: 'blogPost',
      order: ['-fields.publishDate'],
    });
    return response.items.map(transformContentfulPost);
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    return [];
  }
};

export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await client.getEntries<ContentfulBlogPost>({
      content_type: 'blogPost',
      order: ['-fields.publishDate'],
      limit: 3,
    });
    return response.items.map(transformContentfulPost);
  } catch (error) {
    console.error('Error fetching featured posts from Contentful:', error);
    return [];
  }
};

export const getPostsByCategory = async (categorySlug: string): Promise<BlogPost[]> => {
  try {
    const response = await client.getEntries<ContentfulBlogPost>({
      content_type: 'blogPost',
      'fields.category.sys.contentType.sys.id': 'category',
      'fields.category.fields.slug': categorySlug,
      order: ['-fields.publishDate'],
    });
    return response.items.map(transformContentfulPost);
  } catch (error) {
    console.error('Error fetching posts by category from Contentful:', error);
    return [];
  }
};

export const getPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const entry = await client.getEntry<ContentfulBlogPost>(id);
    return transformContentfulPost(entry);
  } catch (error) {
    console.error('Error fetching post by ID from Contentful:', error);
    return null;
  }
};