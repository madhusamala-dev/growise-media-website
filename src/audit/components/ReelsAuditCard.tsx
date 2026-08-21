import { Video, Heart, MessageSquare, Play, Sparkles } from 'lucide-react'
import type { InstagramMedia } from '../types'

interface ReelsAuditCardProps {
  media: InstagramMedia[]
}

export function ReelsAuditCard({ media }: ReelsAuditCardProps) {
  const reels = media.filter((m) => m.media_type === 'REEL')
  const reelRatio = media.length > 0 ? Math.round((reels.length / media.length) * 100) : 0

  const totalViews = reels.reduce((acc, r) => acc + (r.view_count || 0), 0)
  const avgViews = reels.length > 0 ? Math.round(totalViews / reels.length) : 0

  const top3Reels = [...reels].sort((a, b) => b.like_count - a.like_count).slice(0, 3)

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-ember-500/10 text-ember-400">
              <Video className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Reels & Video Performance</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Short-form video is the primary organic reach engine on Instagram today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Reel Share
            </span>
            <span className="font-display font-bold text-ember-400 text-base">{reelRatio}%</span>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Avg Views
            </span>
            <span className="font-display font-bold text-white text-base">
              {avgViews.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Reels Showcase */}
      {top3Reels.length > 0 ? (
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Top Performing Video Content
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3Reels.map((reel, i) => (
              <div
                key={reel.external_media_id || i}
                className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between p-4 min-h-[220px]"
              >
                <img
                  src={reel.thumbnail_url || reel.media_url}
                  alt={reel.caption}
                  className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-ember-500 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                    #{i + 1} Top Reel
                  </span>
                  <div className="flex items-center gap-1 text-slate-300 text-xs font-mono bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    <Play className="h-3 w-3 fill-current text-ember-400" />
                    <span>{reel.view_count.toLocaleString()}</span>
                  </div>
                </div>

                <div className="relative z-10 space-y-2 mt-auto pt-8">
                  <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-snug">
                    {reel.caption}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400/20" />
                      {reel.like_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                      {reel.comment_count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
          <Sparkles className="h-8 w-8 text-amber-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-white">No Reels Found in Recent Posts</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Adding 3 Reels per week can increase your account's organic reach by up to 240%.
          </p>
        </div>
      )}
    </div>
  )
}
