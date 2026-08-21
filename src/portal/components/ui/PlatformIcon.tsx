import type { PlatformId } from '../../data/types'
import { PLATFORM_META } from '../../lib/meta'

export function PlatformIcon({
  id,
  size = 16,
  className,
}: {
  id: PlatformId
  size?: number
  className?: string
}) {
  const meta = PLATFORM_META[id]
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-md ${className ?? ''}`}
      style={{ background: `${meta.color}1f`, color: meta.color }}
      role="img"
      aria-label={meta.name}
      title={meta.name}
    >
      <Icon size={size} strokeWidth={2.2} />
    </span>
  )
}

/** Sized container so all platform icons look uniform. */
export function PlatformIconTile({ id, size = 18, className }: { id: PlatformId; size?: number; className?: string }) {
  const meta = PLATFORM_META[id]
  const Icon = meta.icon
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${className ?? ''}`}
      style={{ background: `${meta.color}1a`, borderColor: `${meta.color}40`, color: meta.color }}
      aria-label={meta.name}
      title={meta.name}
    >
      <Icon size={size} strokeWidth={2.2} />
    </span>
  )
}

/** Row of small platform icons with separators — used in content cards. */
export function PlatformRow({ ids, className }: { ids: PlatformId[]; className?: string }) {
  return (
    <span className={`flex items-center gap-1 ${className ?? ''}`}>
      {ids.map((id) => (
        <PlatformIcon key={id} id={id} size={14} className="h-6 w-6" />
      ))}
    </span>
  )
}
