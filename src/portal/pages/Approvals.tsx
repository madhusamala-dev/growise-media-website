import { useState } from 'react'
import { CheckCircle2, Clapperboard, PartyPopper, PenLine } from 'lucide-react'
import { usePortal } from '../lib/store'
import { useToast } from '../lib/toast'
import { formatDate } from '../lib/format'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { Thumbnail } from '../components/ui/Thumbnail'
import { PlatformRow } from '../components/ui/PlatformIcon'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { TextArea } from '../components/ui/Field'
import { CardSkeleton, useFakeLoading } from '../components/ui/Skeleton'

export function Approvals() {
  const { content, approveContent, requestChanges } = usePortal()
  const { toast } = useToast()
  const loading = useFakeLoading(600)

  const pending = content.filter((c) => c.status === 'approval')
  const [changesFor, setChangesFor] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const changesItem = content.find((c) => c.id === changesFor)

  const handleApprove = (id: string) => {
    approveContent(id)
    const item = content.find((c) => c.id === id)
    toast(`“${item?.title}” approved — we’ll schedule it. 🎬`)
  }

  const submitChanges = () => {
    if (!changesFor) return
    if (!note.trim()) {
      toast('Tell GroWise what you’d like changed', 'error')
      return
    }
    requestChanges(changesFor, note)
    setChangesFor(null)
    setNote('')
    toast('Feedback sent — GroWise will revise the video')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Approvals"
        title="Content Waiting for You"
        description="Review and approve your upcoming content. It takes seconds."
        action={
          pending.length > 0 ? (
            <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1.5 font-display text-[13px] font-bold text-gold-300">
              {pending.length} awaiting review
            </span>
          ) : undefined
        }
      />

      {loading ? (
        <div className="mt-7 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <EmptyState
          className="mt-7"
          icon={PartyPopper}
          title="You’re all caught up. 🎉"
          description="No content is waiting for your approval. GroWise will notify you the moment something needs your review."
          action={<Button to="/content">Browse your content</Button>}
        />
      ) : (
        <div className="mt-7 space-y-4">
          {pending.map((item) => (
            <div
              key={item.id}
              className="grid gap-5 rounded-2xl border border-white/10 bg-ink-850/80 p-5 transition-all duration-300 sm:grid-cols-[11rem_1fr] sm:p-6"
            >
              <Thumbnail palette={item.palette} title={item.title} duration={item.duration} icon={<Clapperboard className="h-6 w-6 text-white/40" />} className="w-full" />

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-paper-50">{item.title}</h2>
                  <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold-300">
                    {item.type}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-ink-400">{item.caption}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink-500">
                  <PlatformRow ids={item.platforms} />
                  {item.scheduledAt && <span>Goes live {formatDate(item.scheduledAt)}</span>}
                </div>

                {item.platforms.includes('youtube') && (
                  <p className="mt-3 text-[11px] leading-relaxed text-ink-500">
                    By approving for YouTube, you certify compliance with the{' '}
                    <a
                      href="https://www.youtube.com/t/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ember-400 hover:text-ember-300 underline"
                    >
                      YouTube Terms
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://www.youtube.com/howyoutubeworks/policies/community-guidelines/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ember-400 hover:text-ember-300 underline"
                    >
                      Community Guidelines
                    </a>.
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                  <Button onClick={() => handleApprove(item.id)}>
                    <CheckCircle2 className="h-4 w-4" aria-hidden /> Approve
                  </Button>
                  <Button variant="outlineLight" onClick={() => setChangesFor(item.id)}>
                    <PenLine className="h-4 w-4" aria-hidden />
                    Request changes
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={changesFor !== null}
        onClose={() => setChangesFor(null)}
        title="Request changes"
        description={changesItem ? `What should we change in “${changesItem.title}”?` : undefined}
        footer={
          <>
            <Button variant="outlineLight" size="sm" onClick={() => setChangesFor(null)}>
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
