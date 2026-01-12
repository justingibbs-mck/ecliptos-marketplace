import { CatalogItem } from '@/lib/catalog';
import FunctionCard from './FunctionCard';
import EmptyState from './EmptyState';

interface ItemGridProps {
  items: Array<{
    type: 'functions' | 'modules' | 'steps';
    name: string;
    item: CatalogItem;
    channel: string;
  }>;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export default function ItemGrid({ items, hasActiveFilters = false, onClearFilters }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={hasActiveFilters ? 'No results found' : 'No items available'}
        message={
          hasActiveFilters
            ? 'Try adjusting your filters or search query to find what you\'re looking for.'
            : 'There are currently no items in the marketplace.'
        }
        actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
        onAction={hasActiveFilters ? onClearFilters : undefined}
        showSearch={hasActiveFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div
          key={`${item.type}-${item.name}-${index}`}
          className="animate-fade-in"
          style={{
            animationDelay: `${Math.min(index * 30, 300)}ms`,
            animationFillMode: 'both',
          }}
        >
          <FunctionCard item={item} />
        </div>
      ))}
    </div>
  );
}

