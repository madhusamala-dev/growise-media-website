import { ArrowLeft, Compass } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../lib/auth'
import { GrowiseLogo } from '../components/Logo'

export function NotFound() {
  const { user } = useAuth()
  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 h-[380px] w-[600px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(255,74,17,0.55), transparent 60%)' }}
      />
      <div className="relative text-center">
        <div className="flex items-center justify-center">
          <GrowiseLogo className="h-9 w-auto" />
        </div>
        <p className="mt-10 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-ember-400">Error 404</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-bold text-paper-50 sm:text-5xl">
          This page went off-script.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-300">
          The page you’re looking for doesn’t exist — but your social media is still running smoothly.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button to={user ? '/dashboard' : '/'}>
            <Compass className="h-4 w-4" aria-hidden />
            {user ? 'Back to dashboard' : 'Back to GroWise'}
          </Button>
          <Button variant="outlineLight" to="/content">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Browse content
          </Button>
        </div>
      </div>
    </div>
  )
}
