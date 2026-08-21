import { Play } from 'lucide-react'
import { cn } from '../../../lib/cn'

/** Gradient video thumbnail placeholder — swap for <img> when real media exists. */
export function Thumbnail({
  palette,
  title,
  duration,
  className,
  icon,
  aspect = 'aspect-video',
}: {
  palette: [string, string]
  title: string
  duration?: string
  className?: string
  icon?: React.ReactNode
  aspect?: string
}) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-xl', aspect, className)}
      style={{ background: `linear-gradient(140deg, ${palette[0]}, ${palette[1]})` }}
      role="img"
      aria-label={title}
    >
      {/* light bleed */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 80% 8%, rgba(255,255,255,0.35), transparent 55%)' }}
      />
      {icon && <div aria-hidden className="absolute inset-0 flex items-center justify-center opacity-40">{icon}</div>}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-950/80 to-transparent" aria-hidden />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-950 shadow-lg transition-transform duration-300 group-hover:scale-110"
      >
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </span>
      {duration && (
        <span className="absolute bottom-2 right-2 rounded-md bg-ink-950/80 px-1.5 py-0.5 font-display text-[10px] font-semibold text-white/90 backdrop-blur-sm">
          {duration}
        </span>
      )}
    </div>
  )
}
