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
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Kind</h3>

      {/* Functions Section */}
      {hasFunctionsKinds && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedFunctions(!expandedFunctions)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-mckinsey-light-50 transition-colors duration-200"
            aria-expanded={expandedFunctions}
          >
            <span className="text-sm font-medium text-gray-900">Functions</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
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
            <div className="p-2 space-y-1 border-t border-gray-200 bg-gray-50">
              {kindsByType.functions.map((kind) => {
                const isSelected = selectedKinds.includes(kind);
                return (
                  <label
                    key={kind}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(kind)}
                      className="w-4 h-4 text-mckinsey-blue-500 border-gray-300 rounded focus:ring-mckinsey-blue-500 focus:ring-1 focus:ring-offset-1 focus:outline-none transition-colors"
                    />
                    <span className={`text-sm flex-1 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                      {formatKindLabel(kind)}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modules Section */}
      {hasModulesKinds && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedModules(!expandedModules)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-mckinsey-light-50 transition-colors duration-200"
            aria-expanded={expandedModules}
          >
            <span className="text-sm font-medium text-gray-900">Modules</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
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
            <div className="p-2 space-y-1 border-t border-gray-200 bg-gray-50">
              {kindsByType.modules.map((kind) => {
                const isSelected = selectedKinds.includes(kind);
                return (
                  <label
                    key={kind}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(kind)}
                      className="w-4 h-4 text-mckinsey-blue-500 border-gray-300 rounded focus:ring-mckinsey-blue-500 focus:ring-1 focus:ring-offset-1 focus:outline-none transition-colors"
                    />
                    <span className={`text-sm flex-1 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                      {formatKindLabel(kind)}
                    </span>
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

