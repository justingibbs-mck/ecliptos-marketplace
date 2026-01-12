'use client';

interface ResultCountProps {
  count: number;
}

export default function ResultCount({ count }: ResultCountProps) {
  return (
    <p className="text-sm font-medium text-gray-700">
      <span className="text-mckinsey-blue-600 font-semibold">{count}</span>{' '}
      {count === 1 ? 'result' : 'results'}
    </p>
  );
}

