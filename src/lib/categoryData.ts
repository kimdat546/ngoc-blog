import client from './contentful';
import { Entry, EntrySkeletonType } from 'contentful';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ContentfulCategory extends EntrySkeletonType {
  contentTypeId: 'category';
  fields: {
    name: string;
    slug: string;
  };
}

function transformContentfulCategory(entry: any): Category {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    name: fields.name,
    slug: fields.slug,
  };
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'category',
      order: ['fields.name'] as any,
    });
    return response.items.map(transformContentfulCategory);
  } catch (error) {
    console.error('Error fetching categories from Contentful:', error);
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const entry = await client.getEntry(id);
    return transformContentfulCategory(entry);
  } catch (error) {
    console.error('Error fetching category by ID from Contentful:', error);
    return null;
  }
};
