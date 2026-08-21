import { getScoreLabelInfo } from '../engine/overallScorer'

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function ScoreRing({ score, size = 180, strokeWidth = 14 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  const info = getScoreLabelInfo(score)

  const strokeColorMap = {
    emerald: '#10b981',
    green: '#22c55e',
    blue: '#3b82f6',
    amber: '#f59e0b',
    orange: '#f97316',
    rose: '#f43f5e',
  }

  const colorHex = strokeColorMap[info.color] || '#ff4a11'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorHex}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
          {score}
        </span>
        <span className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-0.5">
          out of 100
        </span>
        <span
          className="mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase"
          style={{ backgroundColor: `${colorHex}20`, color: colorHex }}
        >
          {info.label}
        </span>
      </div>
    </div>
  )
}
