import { CatalogItem } from '@/lib/catalog';
import FunctionCard from './FunctionCard';

interface ItemGridProps {
  items: Array<{
    type: 'functions' | 'modules' | 'steps';
    name: string;
    item: CatalogItem;
    channel: string;
  }>;
}

export default function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">No items found in the marketplace.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <FunctionCard key={`${item.type}-${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

