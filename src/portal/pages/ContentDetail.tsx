import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clapperboard,
  Copy,
  Heart,
  MessageCircle,
  PenLine,
  Share2,
} from 'lucide-react'
import { usePortal } from '../lib/store'
import { useToast } from '../lib/toast'
import { PIPELINE_STAGES } from '../data/types'
import { STATUS_META } from '../lib/meta'
import { compact, formatFull } from '../lib/format'
import { Button } from '../../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PlatformRow } from '../components/ui/PlatformIcon'
import { Thumbnail } from '../components/ui/Thumbnail'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { TextArea } from '../components/ui/Field'
import { cn } from '../../lib/cn'

export function ContentDetail() {
  const { id } = useParams<{ id: string }>()
  const { content, approveContent, requestChanges } = usePortal()
  const { toast } = useToast()

  const item = content.find((c) => c.id === id)
  const [changesOpen, setChangesOpen] = useState(false)
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)

  if (!item) {
    return (
      <EmptyState
        icon={Clapperboard}
        title="Content not found"
        description="This piece of content doesn’t exist or was removed."
        action={<Button to="/content">Back to content</Button>}
      />
    )
  }

  const stageIndex = PIPELINE_STAGES.findIndex((s) => s.label === STATUS_META[item.status].stage)
  const needsAction = item.status === 'approval' || item.status === 'revision'

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(`${item.caption}\n\n${item.hashtags.join(' ')}`)
      setCopied(true)
      toast('Caption copied to clipboard')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Could not copy — select the text manually', 'error')
    }
  }

  const handleApprove = () => {
    approveContent(item.id)
    toast(`“${item.title}” approved — we’ll schedule it. 🎬`)
  }

  const submitChanges = () => {
    if (!note.trim()) {
      toast('Tell GroWise what you’d like changed', 'error')
      return
    }
    requestChanges(item.id, note)
    setChangesOpen(false)
    setNote('')
    toast('Feedback sent — GroWise will revise the video')
  }

  return (
    <div>
      <Link
        to="/content"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-400 transition-colors hover:text-paper-100"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to content
      </Link>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        {/* Preview */}
        <div>
          <div className="group relative overflow-hidden rounded-2xl border border-white/10">
            <Thumbnail palette={item.palette} title={item.title} duration={item.duration} aspect="aspect-video" icon={<Clapperboard className="h-10 w-10 text-white/40" />} />
            {/* fake scrubber */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-ink-950/90 to-transparent p-4 pt-10">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-1/3 rounded-full bg-ember-500" />
              </div>
              <span className="font-display text-[11px] font-semibold text-white/80">0:11 / {item.duration}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-800/70 px-3.5 py-2 text-[13px] font-semibold text-paper-100 transition-colors hover:bg-white/10"
            >
              <Heart className="h-4 w-4 text-ember-400" aria-hidden />
              {compact(item.stats.likes)}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-800/70 px-3.5 py-2 text-[13px] font-semibold text-paper-100 transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4 text-sky-400" aria-hidden />
              {compact(item.stats.comments)}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-800/70 px-3.5 py-2 text-[13px] font-semibold text-paper-100 transition-colors hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 text-gold-400" aria-hidden />
              {compact(item.stats.shares)}
            </button>
            <span className="ml-auto text-[12px] text-ink-500">{compact(item.stats.views)} views</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="min-w-0 flex-1 text-balance font-display text-2xl font-bold leading-tight text-paper-50">
              {item.title}
            </h1>
            <StatusBadge status={item.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Meta label="Type" value={item.type} />
            <Meta label="Duration" value={item.duration} />
            <Meta label="Created" value={formatDay(item.createdAt)} />
            <Meta label="Scheduled" value={item.scheduledAt ? formatDay(item.scheduledAt) : '—'} />
            <Meta label="Published" value={item.publishedAt ? formatDay(item.publishedAt) : '—'} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Platforms</p>
              <PlatformRow ids={item.platforms} className="mt-1.5" />
            </div>
          </div>

          {/* Pipeline position */}
          <Card className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Pipeline position</p>
            <div className="mt-3 flex items-center gap-1.5">
              {PIPELINE_STAGES.map((s, i) => (
                <div key={s.key} className="flex flex-1 flex-col items-center gap-1">
                  <span
                    className={cn(
                      'h-1.5 w-full rounded-full transition-colors',
                      i <= stageIndex ? STATUS_META[item.status].bar : 'bg-white/10'
                    )}
                    title={s.label}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-ink-500">
              {PIPELINE_STAGES.map((s) => (
                <span key={s.key} className="hidden first:block last:block sm:block">
                  {s.label}
                </span>
              ))}
            </div>
          </Card>

          {needsAction && (
            <div className="rounded-2xl border border-gold-400/25 bg-gold-400/5 p-5">
              <p className="flex items-center gap-2 font-display text-sm font-bold text-gold-300">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {item.status === 'revision' ? 'In revision' : 'Your review needed'}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-300">
                {item.status === 'revision'
                  ? `GroWise is updating the video based on your feedback${
                      item.feedbackNote ? `: “${item.feedbackNote}”` : ''
                    }. It will be back with you shortly.`
                  : 'Approve this video and we’ll schedule it, or tell us what to change first.'}
              </p>
              {item.status === 'approval' && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={handleApprove}>
                    <CheckCircle2 className="h-4 w-4" aria-hidden /> Approve video
                  </Button>
                  <Button variant="outlineLight" onClick={() => setChangesOpen(true)}>
                    <PenLine className="h-4 w-4" aria-hidden />
                    Request changes
                  </Button>
                </div>
              )}
            </div>
          )}

          <Card className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">About this video</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-300">{item.description}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Caption</p>
              <button
                type="button"
                onClick={copyCaption}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ember-400 transition-colors hover:text-ember-300"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-paper-100/90">{item.caption}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.hashtags.map((tag) => (
                <span key={tag} className="rounded-full bg-ember-500/10 px-2.5 py-1 text-[11px] font-semibold text-ember-300">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Request changes modal */}
      <Modal
        open={changesOpen}
        onClose={() => setChangesOpen(false)}
        title="Request changes"
        description="Tell GroWise what you’d like changed. We’ll send it back to the team."
        footer={
          <>
            <Button variant="outlineLight" size="sm" onClick={() => setChangesOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={submitChanges}>
              Send feedback
            </Button>
          </>
        }
      >
        <TextArea
          rows={4}
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tell GroWise what you'd like changed…"
        />
      </Modal>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-1 text-[13px] font-semibold text-paper-100">{value}</p>
    </div>
  )
}

function formatDay(iso?: string): string {
  if (!iso) return '—'
  return formatFull(iso)
}
