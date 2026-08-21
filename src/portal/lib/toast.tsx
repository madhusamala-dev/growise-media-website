import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

type Tone = 'success' | 'error' | 'info'

interface Toast {
  id: number
  tone: Tone
  message: string
}

interface ToastContextValue {
  toast: (message: string, tone?: Tone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, tone: Tone = 'success') => {
      const id = ++idRef.current
      setToasts((t) => [...t, { id, tone, message }])
      window.setTimeout(() => dismiss(id), 4000)
    },
    [dismiss]
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-2xl border bg-ink-900/95 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md animate-scale-in',
              t.tone === 'success' && 'border-emerald-500/30',
              t.tone === 'error' && 'border-ember-500/40',
              t.tone === 'info' && 'border-sky-500/30'
            )}
          >
            {t.tone === 'success' && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden />}
            {t.tone === 'error' && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-ember-400" aria-hidden />}
            {t.tone === 'info' && <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />}
            <p className="flex-1 text-sm leading-snug text-paper-100">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-ink-500 transition-colors hover:text-paper-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
