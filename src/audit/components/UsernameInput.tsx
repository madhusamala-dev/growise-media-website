import { useState } from 'react'
import { ArrowRight, AtSign, Sparkles } from 'lucide-react'
import { normalizeInstagramUsername } from '../utils/usernameNormalizer'

interface UsernameInputProps {
  onSubmit: (username: string) => void
  isLoading?: boolean
  initialValue?: string
  placeholder?: string
  buttonText?: string
  size?: 'md' | 'lg'
}

export function UsernameInput({
  onSubmit,
  isLoading = false,
  initialValue = '',
  placeholder = 'enter instagram username (e.g. @demo_cafe)',
  buttonText = 'Analyze My Instagram',
  size = 'lg',
}: UsernameInputProps) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = normalizeInstagramUsername(value)
    if (!result.isValid) {
      setError(result.error || 'Invalid Instagram username')
      return
    }

    onSubmit(result.username)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-2">
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-xl transition-all focus-within:border-ember-500/80 focus-within:ring-2 focus-within:ring-ember-500/20">
        <div className="relative flex-1 flex items-center pl-3">
          <AtSign className="h-5 w-5 text-ember-400 shrink-0" aria-hidden />
          <span className="pl-2 pr-1 text-slate-400 font-mono text-sm select-none">@</span>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            placeholder={placeholder.replace(/^@/, '')}
            disabled={isLoading}
            className="w-full bg-transparent py-3 pr-4 text-white placeholder-slate-500 focus:outline-none font-medium text-base sm:text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className={`shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 px-6 py-3.5 font-display font-bold text-white shadow-lg shadow-ember-500/25 transition-all hover:from-ember-600 hover:to-ember-700 hover:shadow-ember-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
            size === 'lg' ? 'text-base sm:text-lg' : 'text-sm'
          }`}
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 text-amber-300" aria-hidden />
              <span>{buttonText}</span>
              <ArrowRight className="h-5 w-5" aria-hidden />
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-rose-400 text-sm font-medium pl-4 animate-fade-in">
          ⚠️ {error}
        </p>
      )}

      <p className="text-xs text-slate-400 text-center pt-1 font-medium">
        ✨ Free • AI-powered • Takes less than a minute
      </p>
    </form>
  )
}
