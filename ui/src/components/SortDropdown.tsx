'use client';

import { SortOption } from '@/lib/search';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort-select" className="text-sm text-gray-700">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        aria-label="Sort items"
      >
        <option value="name">Title (A-Z)</option>
        <option value="modified">Last Modified</option>
      </select>
    </div>
  );
}

