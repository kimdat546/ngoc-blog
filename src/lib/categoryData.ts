import client from './contentful';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  showInMenu?: boolean;
  menuOrder?: number;
}

function transformContentfulCategory(entry: any): Category {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    name: fields.name,
    slug: fields.slug,
    parentId: fields.parent?.sys?.id,
    showInMenu: fields.showInMenu === true,
    menuOrder: typeof fields.menuOrder === 'number' ? fields.menuOrder : undefined,
  };
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'category',
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

// Top-level categories (no parent) with showInMenu=true, sorted by menuOrder asc.
export const getMenuCategories = async (): Promise<Category[]> => {
  const all = await getCategories();
  return all
    .filter((c) => !c.parentId && c.showInMenu)
    .sort((a, b) => {
      const ao = a.menuOrder ?? Number.MAX_SAFE_INTEGER;
      const bo = b.menuOrder ?? Number.MAX_SAFE_INTEGER;
      return ao - bo;
    });
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const response = await client.getEntries({
      content_type: 'category',
      'fields.slug': slug,
      limit: 1,
    } as any);
    if (response.items.length === 0) return null;
    return transformContentfulCategory(response.items[0]);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
};

export const getChildCategories = async (parentId: string): Promise<Category[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'category',
      'fields.parent.sys.id': parentId,
    } as any);
    return response.items.map(transformContentfulCategory);
  } catch (error) {
    console.error('Error fetching child categories:', error);
    return [];
  }
};
