import Link from 'next/link';
import { CatalogItem, getItemKind, getItemGenerationDate, getItemTypeLabel } from '@/lib/catalog';
import { formatRelativeDate, formatCategoryName, formatKindLabel } from '@/lib/utils';

interface FunctionCardProps {
  item: {
    type: 'functions' | 'modules' | 'steps';
    name: string;
    item: CatalogItem;
    channel: string;
  };
}

export default function FunctionCard({ item }: FunctionCardProps) {
  const { type, name, item: catalogItem } = item;
  const latest = catalogItem.latest;
  const description = latest.description || '';
  const categories = latest.categories || [];
  const kind = getItemKind(catalogItem);
  const generationDate = getItemGenerationDate(catalogItem);
  const relativeDate = formatRelativeDate(generationDate);
  const typeLabel = getItemTypeLabel(type);

  // Display first 3-4 categories, show "+X more" if more exist
  const maxCategories = 4;
  const displayedCategories = categories.slice(0, maxCategories);
  const remainingCount = categories.length - maxCategories;

  // Type badge colors - McKinsey-inspired blue theme
  const typeBadgeColors = {
    functions: 'bg-mckinsey-blue-500 text-white',
    modules: 'bg-mckinsey-blue-600 text-white',
    steps: 'bg-mckinsey-blue-700 text-white',
  };

  const detailUrl = `/item/${type}/${name}`;

  return (
    <Link
      href={detailUrl}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-card-hover hover:border-mckinsey-blue-200 transition-all duration-200 flex flex-col h-full cursor-pointer block group shadow-card"
    >
      {/* Header with name and badges */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-mckinsey-blue-600 transition-colors">{name}</h3>
        <div className="flex flex-wrap gap-2">
          {/* Type badge - McKinsey blue */}
          <span className={`px-3 py-1 text-xs font-semibold rounded ${typeBadgeColors[type]}`}>
            {typeLabel}
          </span>
          {/* Kind badge - subtle with blue text */}
          {kind && (
            <span className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-mckinsey-blue-700">
              {formatKindLabel(kind)}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2 flex-grow leading-relaxed">{description}</p>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {displayedCategories.map((category, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs rounded bg-mckinsey-light-100 text-mckinsey-blue-700 border border-mckinsey-light-200"
              >
                {formatCategoryName(category)}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="px-2.5 py-1 text-xs text-gray-500">
                +{remainingCount} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Updated date - always at bottom */}
      {relativeDate && (
        <div className="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
          {relativeDate}
        </div>
      )}
    </Link>
  );
}

