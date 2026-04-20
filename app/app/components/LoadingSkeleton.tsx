'use client';

/**
 * Loading Skeleton para feedback visual
 * Mostra placeholder enquanto dados carregam
 */

export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header */}
      <div className="h-8 bg-gray-200 rounded w-3/4" />

      {/* Preview */}
      <div className="h-64 bg-gray-200 rounded" />

      {/* Content */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>

      {/* Button */}
      <div className="h-10 bg-gray-200 rounded" />
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function InputFormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-1/2" />

      {/* Large textarea */}
      <div className="h-24 bg-gray-200 rounded" />

      {/* Medium textarea */}
      <div className="h-16 bg-gray-200 rounded" />

      {/* Slider */}
      <div className="h-12 bg-gray-200 rounded" />

      {/* Button */}
      <div className="h-12 bg-gray-200 rounded w-full" />
    </div>
  );
}

export function PublishButtonSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-12 bg-gray-300 rounded w-full" />
      <div className="h-2 bg-gray-200 rounded w-full" />
    </div>
  );
}
