import { useEffect, useState } from 'react'
import { cn } from '../../../lib/cn'

/** Returns true for `ms` after mount — simulates initial data loading. */
export function useFakeLoading(ms = 700): boolean {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), ms)
    return () => window.clearTimeout(t)
  }, [ms])
  return loading
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-white/[0.06]', className)} />
}

export function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-850/80 p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-7 w-20" />
      <Skeleton className="mt-2 h-3 w-28" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-850/80 p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-3/4" />
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
    </div>
  )
}
