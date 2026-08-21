import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../../lib/cn'

export const inputClass =
  'w-full rounded-xl border border-white/10 bg-ink-800/80 px-3.5 py-2.5 text-[14px] text-paper-100 placeholder:text-ink-500 transition-all duration-200 focus:border-ember-500 focus:outline-none focus:ring-4 focus:ring-ember-500/15'

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
  optional = false,
}: {
  label: string
  hint?: string
  error?: string
  htmlFor?: string
  children: ReactNode
  className?: string
  optional?: boolean
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="font-display text-[13px] font-semibold text-paper-100">
          {label}
        </label>
        {optional && <span className="text-[11px] text-ink-500">Optional</span>}
      </div>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
      {error && <p role="alert" className="mt-1.5 text-xs font-medium text-ember-400">{error}</p>}
    </div>
  )
}

export function TextInput({ invalid, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={cn(inputClass, invalid && 'border-ember-500/60')} {...props} />
}

export function TextArea({
  invalid,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea className={cn(inputClass, 'resize-none', invalid && 'border-ember-500/60')} {...props} />
}

export function SelectInput({
  invalid,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select className={cn(inputClass, 'appearance-none', invalid && 'border-ember-500/60')} {...props}>
      {children}
    </select>
  )
}


