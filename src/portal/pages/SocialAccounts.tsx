import { useState } from 'react'
import { Link2, Loader2, Unlink, Users } from 'lucide-react'
import { usePortal } from '../lib/store'
import { useToast } from '../lib/toast'
import type { PlatformId } from '../data/types'
import { PLATFORM_META } from '../lib/meta'
import { compact } from '../lib/format'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { CardSkeleton, useFakeLoading } from '../components/ui/Skeleton'
import { cn } from '../../lib/cn'

export function SocialAccounts() {
  const { platforms, connectPlatform, disconnectPlatform } = usePortal()
  const { toast } = useToast()
  const loading = useFakeLoading(550)
  const [connecting, setConnecting] = useState<PlatformId | null>(null)
  const [disconnecting, setDisconnecting] = useState<PlatformId | null>(null)

  const connectedCount = platforms.filter((p) => p.status === 'connected').length

  const handleConnect = async (id: PlatformId) => {
    setConnecting(id)
    await connectPlatform(id)
    setConnecting(null)
    toast(`${PLATFORM_META[id].name} connected — GroWise can publish there.`)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Social accounts"
        title="Your Connected Platforms"
        description={
          connectedCount === 0
            ? 'Give GroWise the channels we need to manage your social presence.'
            : `${connectedCount} of ${platforms.length} platforms connected. GroWise handles the rest.`
        }
      />

      {!loading && connectedCount === 0 && (
        <div className="mt-6 rounded-2xl border border-gold-400/25 bg-gold-400/5 p-5">
          <p className="flex items-center gap-2 font-display text-sm font-bold text-gold-300">
            <Link2 className="h-4 w-4" aria-hidden />
            Connect your social accounts
          </p>
          <p className="mt-1 text-[13px] text-ink-300">
            Once connected, GroWise can schedule and publish your approved content automatically.
          </p>
        </div>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : platforms.map((p) => {
              const meta = PLATFORM_META[p.id]
              const Icon = meta.icon
              const isConnecting = connecting === p.id
              const isConnected = p.status === 'connected'
              return (
                <Card key={p.id} hover className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                        style={{ background: `${meta.color}1a`, borderColor: `${meta.color}40`, color: meta.color }}
                      >
                        <Icon className="h-6 w-6" strokeWidth={2.1} />
                      </span>
                      <div>
                        <p className="font-display text-base font-bold text-paper-50">{meta.name}</p>
                        <p className="max-w-[12rem] truncate text-[12px] text-ink-400">{p.handle}</p>
                      </div>
                    </div>
                    <StatusChip status={p.status} />
                  </div>

                  <div className="mt-5 flex items-center gap-6 border-t border-white/10 pt-4">
                    <div>
                      <p className="font-display text-xl font-bold text-paper-50">{compact(p.followers)}</p>
                      <p className="text-[11px] text-ink-500">followers</p>
                    </div>
                    <div>
                      <p className="font-display text-xl font-bold text-paper-50">{p.engagement}%</p>
                      <p className="text-[11px] text-ink-500">engagement</p>
                    </div>
                    <div>
                      <p className={cn('font-display text-xl font-bold', p.followersTrend >= 0 ? 'text-emerald-400' : 'text-ember-400')}>
                        {p.followersTrend >= 0 ? '+' : ''}
                        {p.followersTrend}%
                      </p>
                      <p className="text-[11px] text-ink-500">this month</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    {isConnected ? (
                      <Button variant="outlineLight" className="w-full" onClick={() => setDisconnecting(p.id)}>
                        <Unlink className="h-4 w-4" aria-hidden />
                        Disconnect
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => handleConnect(p.id)} disabled={isConnecting}>
                        {isConnecting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            Connecting…
                          </>
                        ) : (
                          <>
                            <Link2 className="h-4 w-4" aria-hidden />
                            {p.status === 'connection_required' ? 'Connect & authorize' : 'Connect'}
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {p.status === 'connection_required' && (
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-gold-300">
                      <Users className="h-3 w-3" aria-hidden />
                      Requires page admin permission
                    </p>
                  )}
                </Card>
              )
            })}
      </div>

      <Modal
        open={disconnecting !== null}
        onClose={() => setDisconnecting(null)}
        title="Disconnect platform?"
        description={
          disconnecting
            ? `GroWise will stop publishing to ${PLATFORM_META[disconnecting].name}. Your content and history stay safe.`
            : undefined
        }
        footer={
          <>
            <Button variant="outlineLight" size="sm" onClick={() => setDisconnecting(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                if (disconnecting) {
                  disconnectPlatform(disconnecting)
                  toast(`${PLATFORM_META[disconnecting].name} disconnected`, 'info')
                  setDisconnecting(null)
                }
              }}
            >
              Disconnect
            </Button>
          </>
        }
      />
    </div>
  )
}

function StatusChip({ status }: { status: 'connected' | 'not_connected' | 'connection_required' }) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Connected
      </span>
    )
  }
  if (status === 'connection_required') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1 text-[11px] font-semibold text-gold-300">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> Connection required
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-ink-300">
      Not connected
    </span>
  )
}
