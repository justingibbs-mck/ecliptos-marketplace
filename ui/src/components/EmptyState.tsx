interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  showSearch?: boolean;
}

export default function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your filters or search query to find what you\'re looking for.',
  actionLabel,
  onAction,
  showSearch = false,
}: EmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center">
      <div className="max-w-md mx-auto">
        {/* Icon/Illustration */}
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showSearch && (
            <button
              onClick={onAction}
              className="inline-flex items-center px-4 py-2 border-2 border-mckinsey-blue-500 text-mckinsey-blue-500 rounded-lg font-medium hover:bg-mckinsey-light-50 transition-colors"
            >
              Clear Search
            </button>
          )}
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center px-4 py-2 bg-mckinsey-blue-500 text-white rounded-lg font-medium hover:bg-mckinsey-blue-600 transition-colors shadow-sm"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

