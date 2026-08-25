import { useId, useState, type FormEvent, type ReactNode } from 'react'
import {
  CheckCircle2,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { cta, contact, whatsappHref } from '../data/site'
import { cn } from '../lib/cn'
import { supabase, isSupabaseConfigured } from '../audit/services/supabaseClient'

/* ---------------- field config ---------------- */

const businessCategories = [
  'Bakery / Food & Beverage',
  'Restaurant / Café',
  'Sweet Shop / Confectionery',
  'Cloud Kitchen',
  'Real Estate',
  'Clinic / Healthcare',
  'Salon / Spa',
  'Gym / Fitness',
  'Hotel / Hospitality',
  'Education / Coaching',
  'Retail Store',
  'E-commerce',
  'Automobile',
  'Local / Service Business',
  'Other',
]

const videoCounts = [
  '4 videos / month (about 1 per week)',
  '4–6 videos / month',
  '8+ videos / month',
  'Not sure yet — advise me',
]

const contentOptions = [
  'Instagram Reels',
  'YouTube Shorts',
  'Video advertisements',
  'Product ads',
  'Promotional campaigns',
  'Full social media management',
  'Not sure — advise me',
]

interface FormValues {
  name: string
  businessName: string
  phone: string
  email: string
  businessCategory: string
  location: string
  adTarget: string
  contentNeeds: string[]
  videoCount: string
  message: string
  website: string
  instagram: string
}

const emptyForm: FormValues = {
  name: '',
  businessName: '',
  phone: '',
  email: '',
  businessCategory: '',
  location: '',
  adTarget: '',
  contentNeeds: [],
  videoCount: '',
  message: '',
  website: '',
  instagram: '',
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

/* ---------------- small field primitives ---------------- */

const inputClass =
  'w-full rounded-xl border border-paper-300 bg-white px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-400 transition-all duration-200 focus:border-ember-500 focus:outline-none focus:ring-4 focus:ring-ember-500/15'

function Field({
  id,
  label,
  required,
  error,
  children,
  className,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-display text-[13px] font-semibold text-ink-900">
        {label}
        {required && (
          <span aria-hidden className="text-ember-600">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-ember-700">
          {error}
        </p>
      )}
    </div>
  )
}

/* ---------------- component ---------------- */

export function LeadForm() {
  const uid = useId()
  const [form, setForm] = useState<FormValues>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormValues, string>> = {}
    if (form.name.trim().length < 2) next.name = 'Please tell us your name'
    if (!form.businessName.trim()) next.businessName = 'Please add your business name'
    if (!/^[+]?[0-9\s\-()]{7,20}$/.test(form.phone.trim()))
      next.phone = 'Please enter a valid phone number'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = 'That email doesn’t look right'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (!isSupabaseConfigured || !supabase) {
      setServerError('Service is not configured. Please try again later.')
      return
    }

    setStatus('submitting')
    setServerError('')

    try {
      const { error } = await supabase.functions.invoke('inquiries', {
        body: {
          name: form.name.trim(),
          businessName: form.businessName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          businessCategory: form.businessCategory || undefined,
          location: form.location.trim() || undefined,
          advertisingRequirement: form.adTarget.trim() || undefined,
          contentTypes: form.contentNeeds.length > 0 ? form.contentNeeds : undefined,
          monthlyContentVolume: form.videoCount || undefined,
          website: form.website.trim() || undefined,
          instagram: form.instagram.trim() || undefined,
          additionalNotes: form.message.trim() || undefined,
        },
      })

      if (error) throw error

      setStatus('success')
    } catch (err) {
      console.error('[LeadForm] Submission failed:', err)
      setServerError('Something went wrong while submitting your enquiry. Please try again.')
      setStatus('idle')
    }
  }

  /* ---- success state ---- */
  if (status === 'success') {
    return (
      <section id="contact" aria-labelledby="contact-title" className="grain relative bg-ink-950 py-24 lg:py-32">
        <Container className="relative">
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-ink-900 p-10 text-center lg:p-14">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 className="h-9 w-9 text-emerald-400" aria-hidden />
              </span>
              <h2 id="contact-title" className="mt-6 font-display text-3xl font-bold text-paper-50">
                ✓ Enquiry Sent Successfully!
              </h2>
              <p className="mx-auto mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-ink-300">
                Thank you for reaching out to Growise Media.
                Our team will get in touch with you shortly.
              </p>
              {contact.whatsappNumber && (
                <p className="mt-4 text-sm text-ink-400">
                  Prefer WhatsApp? Message us anytime at{' '}
                  <a
                    href={whatsappHref(`Hi GroWise! I just submitted the enquiry form for ${form.businessName}.`)}
                    className="font-semibold text-ember-400 underline underline-offset-4 hover:text-ember-300"
                  >
                    {contact.whatsappDisplay}
                  </a>
                  .
                </p>
              )}
              <Button
                variant="outlineLight"
                className="mt-8"
                onClick={() => {
                  setForm(emptyForm)
                  setStatus('idle')
                }}
              >
                Send another enquiry
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    )
  }

  return (
    <section id="lead-form" aria-labelledby="lead-form-title" className="grain relative bg-ink-950 py-24 lg:py-32">
      <div id="contact" className="sr-only" />
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — pitch */}
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-ember-400">
                <span aria-hidden className="h-px w-6 bg-ember-500" />
                Free Level 1 Growth Audit
              </p>
              <h2 id="lead-form-title" className="text-balance font-display text-3xl font-bold leading-[1.08] text-paper-50 sm:text-4xl lg:text-5xl">
                Get your <span className="text-accent text-gradient-ember">Free AI Growth Audit.</span>
              </h2>
              <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-ink-300">
                Tell us about your business, Instagram handle, and primary goal. We’ll generate your Overall Growth Score and a custom strategy blueprint — completely free.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-9 rounded-3xl border border-white/10 bg-ink-900 p-7">
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-gold-400">
                  What happens next
                </h3>
                <ol className="mt-5 space-y-4">
                  {[
                    'GroWise runs a Level 1 AI Audit on your public digital presence',
                    'We generate your Overall Growth Score & Platform Diagnostics',
                    'You receive your Level 2 Deep Growth Blueprint & Strategy preview',
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ember-500/15 font-display text-xs font-bold text-ember-400">
                        {i + 1}
                      </span>
                      <span className="text-[15px] leading-relaxed text-ink-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {contact.whatsappNumber && (
                  <Button
                    href={whatsappHref('Hi GroWise! I want to get content for my business.')}
                    variant="outlineLight"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 text-gold-400" aria-hidden />
                    WhatsApp us
                  </Button>
                )}
                <Button href={`mailto:${contact.email}`} variant="ghostLight" size="sm">
                  <Mail className="h-4 w-4" aria-hidden />
                  {contact.email}
                </Button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-ink-400">
                <Sparkles className="h-4 w-4 text-gold-400" aria-hidden />
                No spam. No obligation. Just a straight answer.
              </p>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal delay={100}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative overflow-hidden rounded-3xl bg-paper-50 p-7 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-9 lg:p-10"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-ember-500 via-gold-400 to-ember-500" />

              {serverError && (
                <p role="alert" className="mb-6 rounded-xl border border-ember-600/40 bg-ember-500/10 px-4 py-3 text-sm font-medium text-ember-700">
                  {serverError}
                </p>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id={`${uid}-name`} label="Your name" required error={errors.name}>
                  <input
                    id={`${uid}-name`}
                    className={cn(inputClass, errors.name && 'border-ember-600')}
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                  />
                </Field>
                <Field id={`${uid}-business`} label="Business name" required error={errors.businessName}>
                  <input
                    id={`${uid}-business`}
                    className={cn(inputClass, errors.businessName && 'border-ember-600')}
                    placeholder="Sharma Sweets & Bakes"
                    value={form.businessName}
                    onChange={(e) => set('businessName', e.target.value)}
                    aria-invalid={!!errors.businessName}
                    aria-describedby={errors.businessName ? `${uid}-business-error` : undefined}
                  />
                </Field>
                <Field id={`${uid}-phone`} label="Phone / WhatsApp" required error={errors.phone}>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    className={cn(inputClass, errors.phone && 'border-ember-600')}
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
                  />
                </Field>
                <Field id={`${uid}-email`} label="Email" error={errors.email}>
                  <input
                    id={`${uid}-email`}
                    type="email"
                    className={cn(inputClass, errors.email && 'border-ember-600')}
                    placeholder="you@business.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                  />
                </Field>
                <Field id={`${uid}-category`} label="Business category">
                  <select
                    id={`${uid}-category`}
                    className={inputClass}
                    value={form.businessCategory}
                    onChange={(e) => set('businessCategory', e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {businessCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id={`${uid}-location`} label="Location">
                  <input
                    id={`${uid}-location`}
                    className={inputClass}
                    placeholder="City / area"
                    value={form.location}
                    onChange={(e) => set('location', e.target.value)}
                  />
                </Field>
              </div>

              <div className="mt-5">
                <Field id={`${uid}-adtarget`} label="What do you want to advertise?">
                  <textarea
                    id={`${uid}-adtarget`}
                    rows={2}
                    className={inputClass}
                    placeholder="e.g. Our signature cake, new batch offers, the shop itself…"
                    value={form.adTarget}
                    onChange={(e) => set('adTarget', e.target.value)}
                  />
                </Field>
              </div>

              <div className="mt-5">
                <p className="mb-2 font-display text-[13px] font-semibold text-ink-900">
                  What kind of content do you need?
                </p>
                <div role="group" aria-label="Content type needed" className="flex flex-wrap gap-2">
                  {contentOptions.map((option) => {
                    const selected = form.contentNeeds.includes(option)
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          set(
                            'contentNeeds',
                            selected
                              ? form.contentNeeds.filter((o) => o !== option)
                              : [...form.contentNeeds, option]
                          )
                        }
                        className={cn(
                          'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200',
                          selected
                            ? 'border-ember-500 bg-ember-500 text-white'
                            : 'border-paper-300 bg-white text-ink-600 hover:border-ember-500/60 hover:text-ink-950'
                        )}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-5">
                <Field id={`${uid}-videocount`} label="Approximate videos / content pieces per month">
                  <select
                    id={`${uid}-videocount`}
                    className={inputClass}
                    value={form.videoCount}
                    onChange={(e) => set('videoCount', e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {videoCounts.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field id={`${uid}-website`} label="Website (optional)">
                  <input
                    id={`${uid}-website`}
                    type="url"
                    className={inputClass}
                    placeholder="https://…"
                    value={form.website}
                    onChange={(e) => set('website', e.target.value)}
                  />
                </Field>
                <Field id={`${uid}-instagram`} label="Instagram (optional)">
                  <input
                    id={`${uid}-instagram`}
                    className={inputClass}
                    placeholder="@yourbrand"
                    value={form.instagram}
                    onChange={(e) => set('instagram', e.target.value)}
                  />
                </Field>
              </div>

              <div className="mt-5">
                <Field id={`${uid}-message`} label="Anything else we should know?">
                  <textarea
                    id={`${uid}-message`}
                    rows={3}
                    className={inputClass}
                    placeholder="Your goals, your offers, your deadlines — anything helps."
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                  />
                </Field>
              </div>

              <Button type="submit" size="lg" className="mt-8 w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    Sending Enquiry…
                  </>
                ) : (
                  <>
                    {cta.form}
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </>
                )}
              </Button>
              <p className="mt-4 text-center text-xs text-ink-500">
                Fields marked <span aria-hidden className="text-ember-600">*</span> are required.
                Your details go straight to the GroWise team.
              </p>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
