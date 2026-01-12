'use client';

import { SortOption } from '@/lib/search';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-mckinsey-blue-500 focus:border-mckinsey-blue-500 outline-none text-sm bg-white shadow-sm transition-all hover:border-gray-400"
        aria-label="Sort items"
      >
        <option value="name">Title (A-Z)</option>
        <option value="modified">Last Modified</option>
      </select>
    </div>
  );
}

