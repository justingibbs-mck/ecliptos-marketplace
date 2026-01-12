export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      {/* Header with name and badges */}
      <div className="mb-3">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Categories */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1.5">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-28"></div>
        </div>
      </div>

      {/* Updated date */}
      <div className="h-3 bg-gray-200 rounded w-32 mt-auto pt-2 border-t border-gray-100"></div>
    </div>
  );
}

