import { useId } from 'react'
import { compact } from './format'

/* Smooth path from points (Catmull-Rom → cubic bezier). */
function smoothPath(values: number[], width: number, height: number, pad = 4): string {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const step = (width - pad * 2) / (values.length - 1)
  const pts = values.map((v, i) => ({
    x: pad + i * step,
    y: height - pad - ((v - min) / range) * (height - pad * 2),
  }))
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

export function AreaChart({
  values,
  color = '#ff4a11',
  height = 160,
  showAxis = true,
}: {
  values: number[]
  color?: string
  height?: number
  showAxis?: boolean
}) {
  const uid = useId().replace(/[:]/g, '')
  const width = 320
  const line = smoothPath(values, width, height)
  const area = line ? `${line} L ${width - 4} ${height} L 4 ${height} Z` : ''
  const last = values[values.length - 1] ?? 0
  const first = values[0] ?? 0
  const delta = last - first
  const max = Math.max(...values)

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`Trend chart, current value ${compact(last)}`}>
        <defs>
          <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {showAxis && (
          <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
            <line x1="4" y1="40" x2={width - 4} y2="40" />
            <line x1="4" y1="80" x2={width - 4} y2="80" />
            <line x1="4" y1="120" x2={width - 4} y2="120" />
          </g>
        )}
        {area && <path d={area} fill={`url(#area-${uid})`} />}
        {line && (
          <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        <circle cx={width - 4} cy={height - 4 - ((last - Math.min(...values)) / (max - Math.min(...values) || 1)) * (height - 8)} r="4" fill={color} />
      </svg>
      {showAxis && (
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium text-ink-500">
          <span className={delta >= 0 ? 'text-emerald-400' : 'text-ember-400'}>
            {delta >= 0 ? '▲' : '▼'} {compact(Math.abs(delta))}
          </span>
          <span>{compact(max)} peak</span>
        </div>
      )}
    </div>
  )
}

export function Sparkline({ values, color = '#ff4a11', width = 96, height = 32 }: { values: number[]; color?: string; width?: number; height?: number }) {
  const line = smoothPath(values, width, height, 2)
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-24" aria-hidden>
      {line && <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />}
    </svg>
  )
}


