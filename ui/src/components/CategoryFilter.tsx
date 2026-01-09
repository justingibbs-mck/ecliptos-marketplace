'use client';

import { formatCategoryName } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onChange: (selected: string[]) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onChange,
}: CategoryFilterProps) {
  const handleToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  const handleSelectAll = () => {
    onChange([...categories]);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const allSelected = categories.length > 0 && selectedCategories.length === categories.length;
  const someSelected = selectedCategories.length > 0 && selectedCategories.length < categories.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            disabled={allSelected}
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            disabled={selectedCategories.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories available</p>
        ) : (
          categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <label
                key={category}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(category)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{formatCategoryName(category)}</span>
              </label>
            );
          })
        )}
      </div>
      {someSelected && (
        <p className="text-xs text-gray-500">
          {selectedCategories.length} of {categories.length} selected
        </p>
      )}
    </div>
  );
}

