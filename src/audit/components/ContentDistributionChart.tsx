import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { InstagramMedia } from '../types'

interface ContentDistributionChartProps {
  media: InstagramMedia[]
}

const CATEGORY_COLORS: Record<string, string> = {
  EDUCATIONAL: '#10b981',
  PROMOTIONAL: '#f43f5e',
  PRODUCT: '#3b82f6',
  TESTIMONIAL: '#f59e0b',
  ENTERTAINMENT: '#8b5cf6',
  BEHIND_THE_SCENES: '#ec4899',
  AUTHORITY: '#06b6d4',
  COMMUNITY: '#14b8a6',
  OTHER: '#64748b',
}

export function ContentDistributionChart({ media }: ContentDistributionChartProps) {
  if (!media || media.length === 0) return null

  const counts: Record<string, number> = {}
  media.forEach((item) => {
    const cat = item.content_category || 'OTHER'
    counts[cat] = (counts[cat] || 0) + 1
  })

  const data = Object.entries(counts).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    rawCategory: name,
    value,
    percentage: Math.round((value / media.length) * 100),
  }))

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 lg:p-8 space-y-6">
      <div>
        <h3 className="font-display text-xl font-bold text-white">Content Strategy & Category Mix</h3>
        <p className="text-xs text-slate-400 mt-1">
          Analysis of {media.length} recent posts categorized by intent and marketing purpose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.rawCategory}
                    fill={CATEGORY_COLORS[entry.rawCategory] || '#64748b'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(val: any, name: any) => [`${val} posts`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2.5">
          {data.map((item) => (
            <div
              key={item.rawCategory}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[item.rawCategory] || '#64748b' }}
                />
                <span className="text-xs font-bold text-slate-200 capitalize">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono">{item.value} posts</span>
                <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
