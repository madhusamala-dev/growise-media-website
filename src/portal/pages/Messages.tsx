import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, MessageSquare, Paperclip, Send } from 'lucide-react'
import { usePortal } from '../lib/store'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { cn } from '../../lib/cn'
import { Avatar } from '../components/ui/Avatar'
import { EmptyState } from '../components/ui/EmptyState'

export function Messages() {
  const { conversations, sendMessage, markConversationRead } = usePortal()
  const { user } = useAuth()
  const { toast } = useToast()

  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id ?? null)
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const selected = conversations.find((c) => c.id === selectedId) ?? null

  useEffect(() => {
    if (selected) markConversationRead(selected.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [selected?.messages.length])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim() || !selected) return
    sendMessage(selected.id, draft)
    setDraft('')
  }

  return (
    <div className="flex h-[calc(100vh-12.5rem)] min-h-[30rem] overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60">
      {/* Conversation list */}
      <aside
        className={cn(
          'w-full flex-col border-r border-white/10 bg-ink-900/40 lg:flex lg:w-[19rem]',
          selected ? 'hidden lg:flex' : 'flex'
        )}
      >
        <div className="border-b border-white/10 px-5 py-4">
          <h1 className="font-display text-lg font-bold text-paper-50">Messages</h1>
          <p className="mt-0.5 text-[12px] text-ink-500">Client ↔ GroWise team</p>
        </div>
        <div className="flex-1 overflow-y-auto portal-scroll p-2">
          {conversations.map((conv) => {
            const last = conv.messages[conv.messages.length - 1]
            const active = conv.id === selectedId
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelectedId(conv.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors',
                  active ? 'bg-ember-500/10' : 'hover:bg-white/[0.04]'
                )}
              >
                <Avatar name={conv.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-semibold text-paper-50">{conv.name}</p>
                    <span className="shrink-0 text-[10px] text-ink-500">{last?.time}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-ink-400">{last?.body}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-600">{conv.subtitle}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="mt-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-ember-500 px-1.5 font-display text-[10px] font-bold text-white">
                    {conv.unread}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Thread */}
      <section className="flex min-w-0 flex-1 flex-col">
        {!selected ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              compact
              icon={MessageSquare}
              title="Select a conversation"
              description="Messages between you and the GroWise team live here."
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Back to conversations"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink-300 lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <Avatar name={selected.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[14px] font-bold text-paper-50">{selected.name}</p>
                <p className="text-[11px] text-ink-500">Usually replies within a few hours</p>
              </div>
            </div>

            <div ref={scrollRef} className="portal-scroll flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {selected.messages.map((msg) => {
                const isClient = msg.from === 'client'
                return (
                  <div key={msg.id} className={cn('flex items-end gap-2.5', isClient && 'flex-row-reverse')}>
                    {isClient && <Avatar name={user?.fullName ?? 'Client'} size="sm" className="h-7 w-7" />}
                    <div className={cn('max-w-[78%] sm:max-w-[65%]', isClient && 'text-right')}>
                      <div
                        className={cn(
                          'inline-block rounded-2xl px-4 py-2.5 text-left text-[13.5px] leading-relaxed',
                          isClient
                            ? 'rounded-br-md bg-ember-500 text-white shadow-[0_10px_24px_-12px_rgba(255,74,17,0.6)]'
                            : 'rounded-bl-md border border-white/10 bg-ink-800/80 text-paper-100/95'
                        )}
                      >
                        {msg.body}
                        {msg.attachmentName && (
                          <span className="mt-2 flex items-center gap-2 rounded-lg border border-white/15 bg-ink-950/50 px-3 py-2 text-[12px] font-medium text-ink-300">
                            <Paperclip className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden />
                            {msg.attachmentName}
                          </span>
                        )}
                      </div>
                      <p className={cn('mt-1 text-[10px] text-ink-600', isClient ? 'pr-1' : 'pl-1')}>{msg.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <form onSubmit={submit} className="flex items-center gap-2.5 border-t border-white/10 px-4 py-3.5">
              <button
                type="button"
                aria-label="Attach file (coming soon)"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-400 transition-colors hover:text-paper-100"
                onClick={() => toast('Attachments are coming soon', 'info')}
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message to the GroWise team…"
                aria-label="Message"
                className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-800/70 px-4 text-[13.5px] text-paper-100 placeholder:text-ink-500 focus:border-ember-500 focus:outline-none focus:ring-4 focus:ring-ember-500/15"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!draft.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember-500 text-white shadow-[0_10px_24px_-10px_rgba(255,74,17,0.7)] transition-all duration-200 hover:bg-ember-600 disabled:opacity-40 disabled:hover:bg-ember-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}
