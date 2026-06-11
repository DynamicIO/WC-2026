/** Shimmer skeleton blocks for loading states. */

export function Skeleton({ className = '' }) {
  return (
    <div className={`skeleton rounded-lg ${className}`} aria-hidden="true" />
  )
}

const ROW_WIDTHS = ['w-full', 'w-11/12', 'w-4/5', 'w-3/4']

export function SkeletonCard({ rows = 4, height = 'h-48' }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-white/5 bg-bg-card p-5 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className={`${height} w-full`} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${ROW_WIDTHS[i % ROW_WIDTHS.length]}`} />
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/4', 'w-2/3']
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${widths[i % widths.length]}`} />
      ))}
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-black/20 px-3 py-2">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-3 flex-1" />
      <Skeleton className="h-3 w-10" />
      <Skeleton className="h-5 w-8" />
    </div>
  )
}
