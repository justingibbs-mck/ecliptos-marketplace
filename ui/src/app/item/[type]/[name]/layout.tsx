import { getAllItems, type Catalog } from '@/lib/catalog';
import fs from 'fs';
import path from 'path';

// Generate static params for all items in the catalog
// This is required for static export mode
// Note: This function runs at build time and in dev mode (with output: 'export')
export async function generateStaticParams() {
  try {
    const catalogPath = path.join(process.cwd(), 'public', 'catalog.json');
    
    // Check if catalog.json exists
    if (!fs.existsSync(catalogPath)) {
      console.warn('catalog.json not found, returning empty params. Make sure to run "make build-marketplace" and "make copy-ui" first.');
      return [];
    }
    
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as Catalog;
    const items = getAllItems(catalogData);
    
    console.log(`Generating static params for ${items.length} items`);
    
    // Generate params for all items
    return items.map((item) => ({
      type: item.type,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array if catalog can't be read
    return [];
  }
}

export default function ItemDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

