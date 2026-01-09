'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  loadCatalog,
  getItem,
  getItemKind,
  getItemGenerationDate,
  getItemTypeLabel,
  getStaticFilePath,
  fileExists,
  type Catalog,
} from '@/lib/catalog';
import { formatRelativeDate, formatCategoryName, formatKindLabel, copyToClipboard } from '@/lib/utils';
import Toast from '@/components/Toast';

export default function ItemDetailPage() {
  const params = useParams();
  const type = params.type as 'functions' | 'modules' | 'steps';
  const name = params.name as string;

  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileExistence, setFileExistence] = useState<{
    documentation: boolean;
    example: boolean;
    source: boolean;
  }>({
    documentation: false,
    example: false,
    source: false,
  });
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await loadCatalog();
        setCatalog(data);

        const item = getItem(data, type, name);
        if (!item) {
          setError('Item not found');
          setLoading(false);
          return;
        }

        // Check file existence
        const channel = item.channel;
        const docPath = getStaticFilePath(type, channel, name, 'documentation.html');
        const examplePath = getStaticFilePath(type, channel, name, 'example.html');
        const sourcePath = getStaticFilePath(type, channel, name, 'source.html');

        const [docExists, exampleExists, sourceExists] = await Promise.all([
          fileExists(docPath),
          fileExists(examplePath),
          fileExists(sourcePath),
        ]);

        setFileExistence({
          documentation: docExists,
          example: exampleExists,
          source: sourceExists,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Failed to load item:', err);
      } finally {
        setLoading(false);
      }
    }

    if (type && name) {
      fetchData();
    }
  }, [type, name]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading item details...</p>
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Error: {error || 'Item not found'}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to marketplace
        </Link>
      </div>
    );
  }

  const item = getItem(catalog, type, name);
  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Item not found</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to marketplace
        </Link>
      </div>
    );
  }

  const { item: catalogItem, channel } = item;
  const latest = catalogItem.latest;
  const description = latest.description || '';
  const categories = latest.categories || [];
  const kind = getItemKind(catalogItem);
  const generationDate = getItemGenerationDate(catalogItem);
  const relativeDate = formatRelativeDate(generationDate);
  const typeLabel = getItemTypeLabel(type);
  const version = latest.version || 'latest';

  // Type badge colors
  const typeBadgeColors = {
    functions: 'bg-blue-100 text-blue-800',
    modules: 'bg-green-100 text-green-800',
    steps: 'bg-purple-100 text-purple-800',
  };

  // Generate file paths
  const docPath = getStaticFilePath(type, channel, name, 'documentation.html');
  const examplePath = getStaticFilePath(type, channel, name, 'example.html');
  const sourcePath = getStaticFilePath(type, channel, name, 'source.html');

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
      {/* Back button */}
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 hover:underline mb-4 sm:mb-6 inline-block text-sm sm:text-base"
      >
        ← Back to marketplace
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{name}</h1>
          <span className={`px-3 py-1 text-sm font-medium rounded ${typeBadgeColors[type]}`}>
            {typeLabel}
          </span>
          {kind && (
            <span className="px-3 py-1 text-sm font-medium rounded bg-gray-100 text-gray-800">
              {formatKindLabel(kind)}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-700 text-base sm:text-lg mb-3 sm:mb-4">{description}</p>
        )}

        {/* Metadata */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
          {version && (
            <div>
              <span className="font-medium">Version:</span> {version}
            </div>
          )}
          {relativeDate && (
            <div>
              <span className="font-medium">Updated:</span> {relativeDate}
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded bg-gray-50 text-gray-700 border border-gray-200"
              >
                {formatCategoryName(category)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links Section */}
      {(fileExistence.documentation || fileExistence.example || fileExistence.source) && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Documentation & Resources</h2>
          <div className="flex flex-col gap-3">
            {fileExistence.documentation && (
              <a
                href={docPath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                📖 View Documentation
              </a>
            )}
            {fileExistence.example && (
              <a
                href={examplePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                📓 View Example Notebook
              </a>
            )}
            {fileExistence.source && (
              <a
                href={sourcePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                💻 View Source Code
              </a>
            )}
          </div>
        </div>
      )}

      {/* Copy Import Command Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Import Command</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          Copy this command to import this {typeLabel.toLowerCase().slice(0, -1)} into your MLRun
          project:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
          <code>
            import mlrun
            <br />
            <br />
            fn = mlrun.import_function(&apos;hub://{name}&apos;)
          </code>
        </div>
        <button
          className={`mt-3 sm:mt-4 px-4 py-2.5 sm:py-2 rounded transition-colors text-sm sm:text-base min-h-[44px] ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={async () => {
            const importCommand = `import mlrun\n\nfn = mlrun.import_function('hub://${name}')`;
            try {
              await copyToClipboard(importCommand);
              setCopied(true);
              setShowToast(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            } catch (error) {
              console.error('Failed to copy:', error);
              // Could show error toast here if needed
            }
          }}
        >
          {copied ? '✓ Copied!' : 'Copy to Clipboard'}
        </button>
      </div>

      {/* Toast notification */}
      <Toast
        message="Import command copied to clipboard!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

