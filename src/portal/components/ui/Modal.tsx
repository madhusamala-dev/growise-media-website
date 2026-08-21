import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../../lib/cn'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-fade-up"
        style={{ animationDuration: '0.2s' }}
      />
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] animate-scale-in',
          size === 'sm' && 'max-w-md',
          size === 'md' && 'max-w-lg',
          size === 'lg' && 'max-w-2xl'
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-bold text-paper-50">{title}</h2>
            {description && <p className="mt-1 text-sm text-ink-400">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink-300 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children && <div className="px-6 py-5">{children}</div>}
        {footer && <div className="flex justify-end gap-3 border-t border-white/10 bg-ink-950/40 px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
