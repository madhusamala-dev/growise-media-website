import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { GrowiseLogo } from '../../components/Logo'

export const lightInputClass =
  'w-full rounded-xl border border-paper-300 bg-white px-3.5 py-2.5 text-[15px] text-ink-950 placeholder:text-ink-400 transition-all duration-200 focus:border-ember-500 focus:outline-none focus:ring-4 focus:ring-ember-500/15'

const promises = [
  'Done-for-you content — planned, created & published',
  '1–2 premium videos every week, across your platforms',
  'Approvals in seconds, analytics that show results',
]

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-10 sm:px-6">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(255,74,17,0.55), transparent 60%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-[-25%] right-[-5%] h-[380px] w-[380px] rounded-full opacity-25 blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(255,212,0,0.5), transparent 60%)' }}
      />

      <Link
        to="/"
        className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-display text-[13px] font-semibold text-paper-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to GroWise
      </Link>

      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] md:grid md:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden p-10 md:flex">
          <div aria-hidden className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(90% 70% at 20% 0%, rgba(255,74,17,0.5), transparent 60%)' }} />
          <div className="relative">
            <Link to="/" className="inline-flex items-center" aria-label="GroWise home">
              <GrowiseLogo />
            </Link>
            <h2 className="mt-12 text-balance font-display text-3xl font-bold leading-[1.1] text-paper-50">
              You run the business.
              <br />
              <span className="text-accent text-gradient-ember">We run your social media.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-300">
              Your content is being created, managed and published while you focus on your business.
            </p>
          </div>

          <div className="relative mt-10 space-y-4">
            {promises.map((p) => (
              <p key={p} className="flex items-start gap-3 text-[14px] text-ink-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/15">
                  <Check className="h-3 w-3 text-gold-400" aria-hidden />
                </span>
                {p}
              </p>
            ))}
            <p className="flex items-center gap-2 pt-2 font-accent text-sm italic text-ink-400">
              <Sparkles className="h-4 w-4 text-gold-400" aria-hidden />
              From ₹4,999/month · AI-powered, done-for-you
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="relative bg-paper-50 p-7 sm:p-10">
          <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-ember-500 via-gold-400 to-ember-500" />
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
