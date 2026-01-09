'use client';

import { useEffect, useState, useMemo } from 'react';
import { loadCatalog, getAllItems, type Catalog } from '@/lib/catalog';
import {
  applyFilters,
  getAllCategories,
  getAllKinds,
  type FilterState,
  type SortOption,
} from '@/lib/search';
import ItemGrid from '@/components/ItemGrid';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import SortDropdown from '@/components/SortDropdown';
import ResultCount from '@/components/ResultCount';

export default function Home() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');

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
          functions: items.filter((i) => i.type === 'functions').length,
          modules: items.filter((i) => i.type === 'modules').length,
          steps: items.filter((i) => i.type === 'steps').length,
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

  // Get all items and filter data
  const { allItems, categories, kindsByType } = useMemo(() => {
    if (!catalog) {
      return {
        allItems: [],
        categories: [],
        kindsByType: { functions: [], modules: [] },
      };
    }

    const items = getAllItems(catalog);
    const allCategories = getAllCategories(items);
    const allKinds = getAllKinds(items);

    return {
      allItems: items,
      categories: allCategories,
      kindsByType: allKinds,
    };
  }, [catalog]);

  // Apply filters
  const filteredItems = useMemo(() => {
    if (allItems.length === 0) return [];

    const filters: FilterState = {
      searchQuery,
      selectedCategories,
      selectedKinds,
      sortBy,
    };

    return applyFilters(allItems, filters);
  }, [allItems, searchQuery, selectedCategories, selectedKinds, sortBy]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <FilterPanel
            categories={categories}
            kindsByType={kindsByType}
            selectedCategories={selectedCategories}
            selectedKinds={selectedKinds}
            onCategoriesChange={setSelectedCategories}
            onKindsChange={setSelectedKinds}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Sort and Result Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <ResultCount count={filteredItems.length} />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Item Grid */}
          <ItemGrid items={filteredItems} />
        </main>
      </div>
    </div>
  );
}

