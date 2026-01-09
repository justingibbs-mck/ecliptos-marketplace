'use client';

import { useState } from 'react';
import { formatKindLabel } from '@/lib/utils';

interface KindFilterProps {
  kindsByType: {
    functions: string[];
    modules: string[];
  };
  selectedKinds: string[];
  onChange: (selected: string[]) => void;
}

export default function KindFilter({
  kindsByType,
  selectedKinds,
  onChange,
}: KindFilterProps) {
  const [expandedFunctions, setExpandedFunctions] = useState(true);
  const [expandedModules, setExpandedModules] = useState(true);

  const handleToggle = (kind: string) => {
    if (selectedKinds.includes(kind)) {
      onChange(selectedKinds.filter((k) => k !== kind));
    } else {
      onChange([...selectedKinds, kind]);
    }
  };

  const hasFunctionsKinds = kindsByType.functions.length > 0;
  const hasModulesKinds = kindsByType.modules.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Kind</h3>

      {/* Functions Section */}
      {hasFunctionsKinds && (
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setExpandedFunctions(!expandedFunctions)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-t-lg"
            aria-expanded={expandedFunctions}
          >
            <span className="text-sm font-medium text-gray-900">Functions</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedFunctions ? 'transform rotate-180' : ''
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
          {expandedFunctions && (
            <div className="p-2 space-y-2 border-t border-gray-200">
              {kindsByType.functions.map((kind) => {
                const isSelected = selectedKinds.includes(kind);
                return (
                  <label
                    key={kind}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(kind)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{formatKindLabel(kind)}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modules Section */}
      {hasModulesKinds && (
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setExpandedModules(!expandedModules)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-t-lg"
            aria-expanded={expandedModules}
          >
            <span className="text-sm font-medium text-gray-900">Modules</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expandedModules ? 'transform rotate-180' : ''
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
          {expandedModules && (
            <div className="p-2 space-y-2 border-t border-gray-200">
              {kindsByType.modules.map((kind) => {
                const isSelected = selectedKinds.includes(kind);
                return (
                  <label
                    key={kind}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(kind)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{formatKindLabel(kind)}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!hasFunctionsKinds && !hasModulesKinds && (
        <p className="text-sm text-gray-500">No kinds available</p>
      )}
    </div>
  );
}

