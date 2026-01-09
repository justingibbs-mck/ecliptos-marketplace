'use client';

import { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import KindFilter from './KindFilter';

interface FilterPanelProps {
  categories: string[];
  kindsByType: {
    functions: string[];
    modules: string[];
  };
  selectedCategories: string[];
  selectedKinds: string[];
  onCategoriesChange: (selected: string[]) => void;
  onKindsChange: (selected: string[]) => void;
}

export default function FilterPanel({
  categories,
  kindsByType,
  selectedCategories,
  selectedKinds,
  onCategoriesChange,
  onKindsChange,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile/Tablet Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-4"
        aria-expanded={isOpen}
        aria-label="Toggle filters"
      >
        <span className="text-sm font-semibold text-gray-900">Filters</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filter Panel */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block bg-white border border-gray-200 rounded-lg p-4 space-y-6`}
      >
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onChange={onCategoriesChange}
        />
        <div className="border-t border-gray-200 pt-6">
          <KindFilter
            kindsByType={kindsByType}
            selectedKinds={selectedKinds}
            onChange={onKindsChange}
          />
        </div>
      </div>
    </>
  );
}

