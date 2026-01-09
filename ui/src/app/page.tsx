'use client';

import { useEffect, useState } from 'react';
import { loadCatalog, getAllItems, type Catalog } from '@/lib/catalog';
import ItemGrid from '@/components/ItemGrid';

export default function Home() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoading(true);
        const data = await loadCatalog();
        setCatalog(data);
        
        // Log catalog data to console
        console.log('Catalog loaded:', data);
        const items = getAllItems(data);
        console.log(`Total items: ${items.length}`);
        console.log('Items breakdown:', {
          functions: items.filter(i => i.type === 'functions').length,
          modules: items.filter(i => i.type === 'modules').length,
          steps: items.filter(i => i.type === 'steps').length,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Error loading catalog: {error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Make sure the marketplace has been built and catalog.json exists in the public directory.
        </p>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">No catalog data available.</p>
      </div>
    );
  }

  const items = getAllItems(catalog);

  return <ItemGrid items={items} />;
}

