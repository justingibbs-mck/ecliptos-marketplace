'use client';

interface ResultCountProps {
  count: number;
}

export default function ResultCount({ count }: ResultCountProps) {
  return (
    <p className="text-sm text-gray-600">
      {count} {count === 1 ? 'result' : 'results'}
    </p>
  );
}

