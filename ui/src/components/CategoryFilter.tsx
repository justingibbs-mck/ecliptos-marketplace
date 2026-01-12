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
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Categories</h3>
        <div className="flex gap-2">
            <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-mckinsey-blue-600 hover:text-mckinsey-blue-700 font-medium transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:underline"
            disabled={allSelected}
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-mckinsey-blue-600 hover:text-mckinsey-blue-700 font-medium transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:underline"
            disabled={selectedCategories.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories available</p>
        ) : (
          categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <label
                key={category}
                className="flex items-center space-x-3 cursor-pointer hover:bg-mckinsey-light-50 p-2 rounded transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(category)}
                  className="w-4 h-4 text-mckinsey-blue-500 border-gray-300 rounded focus:ring-mckinsey-blue-500 focus:ring-1 focus:ring-offset-1 focus:outline-none transition-colors"
                />
                <span className={`text-sm flex-1 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                  {formatCategoryName(category)}
                </span>
              </label>
            );
          })
        )}
      </div>
      {someSelected && (
        <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          {selectedCategories.length} of {categories.length} selected
        </p>
      )}
    </div>
  );
}

