import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Globe,
  ImagePlus,
  Loader2,
  Palette,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { GrowiseLogo } from '../components/Logo'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import {
  ageRangeOptions,
  contentStyleOptions,
  defaultOnboardingSocial,
  frequencyOptions,
  industryOptions,
  languageOptions,
  toneOptions,
} from '../data/demo'
import type { BusinessInfo, OnboardingData, PlatformId, PlatformStatus } from '../data/types'
import { PLATFORM_META } from '../lib/meta'
import { Field, SelectInput, TextArea, TextInput } from '../components/ui/Field'
import { cn } from '../../lib/cn'

const STEPS = [
  { key: 'business', label: 'Business', icon: Building2 },
  { key: 'audience', label: 'Audience', icon: Users },
  { key: 'brand', label: 'Brand', icon: Palette },
  { key: 'social', label: 'Social', icon: Share2 },
  { key: 'content', label: 'Content', icon: Globe },
  { key: 'review', label: 'Review', icon: CheckCircle2 },
] as const

function ChipGroup({
  options,
  selected,
  onToggle,
  label,
}: {
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  label: string
}) {
  return (
    <div>
      <p className="mb-2 font-display text-[13px] font-semibold text-paper-100">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(opt)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200',
                active
                  ? 'border-ember-500 bg-ember-500 text-white'
                  : 'border-white/15 bg-ink-800 text-ink-300 hover:border-ember-500/60 hover:text-paper-100'
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ListInput({
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
}: {
  label: string
  placeholder: string
  items: string[]
  onAdd: (value: string) => void
  onRemove: (value: string) => void
}) {
  const [value, setValue] = useState('')
  return (
    <div>
      <p className="mb-2 font-display text-[13px] font-semibold text-paper-100">{label}</p>
      <div className="flex gap-2">
        <TextInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (value.trim()) {
                onAdd(value.trim())
                setValue('')
              }
            }
          }}
        />
        <Button
          type="button"
          variant="outlineLight"
          size="sm"
          className="shrink-0"
          onClick={() => {
            if (value.trim()) {
              onAdd(value.trim())
              setValue('')
            }
          }}
        >
          Add
        </Button>
      </div>
      {items.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-ember-500/30 bg-ember-500/10 px-3 py-1 text-[13px] font-medium text-ember-300"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                aria-label={`Remove ${item}`}
                className="text-ember-400/70 transition-colors hover:text-ember-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const emptyOnboarding: OnboardingData = {
  business: { name: '', industry: '', website: '', location: '', description: '' },
  audience: { targetAudience: '', customerType: '', geoMarket: '', ageRange: '', interests: [] },
  brand: {
    primaryColor: '#ff4a11',
    secondaryColor: '#ffd400',
    description: '',
    tone: 'Professional',
    language: 'English',
  },
  social: { ...defaultOnboardingSocial },
  content: { products: [], topics: [], avoid: [], style: 'Educational', frequency: '2 videos / week' },
}

export function Onboarding() {
  const { user, completeOnboarding } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [step, setStep] = useState<number>(0)
  const [data, setData] = useState<OnboardingData>(() => {
    const savedBusiness: Partial<BusinessInfo> = user?.onboarding?.business ?? {}
    return {
      ...emptyOnboarding,
      business: {
        ...emptyOnboarding.business,
        ...savedBusiness,
        name: savedBusiness.name || user?.businessName || '',
      },
    }
  })
  const [logoPreview, setLogoPreview] = useState<string | undefined>(data.brand.logoUrl)
  const [finishing, setFinishing] = useState(false)

  const stepKey = STEPS[step].key
  const isLast = step === STEPS.length - 1

  const set = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((d) => ({ ...d, [key]: value }))

  const toggleIn = (section: 'audience' | 'content', field: 'interests' | 'products' | 'topics' | 'avoid', value: string) =>
    setData((d) => {
      const sectionData = d[section] as unknown as Record<string, string[]>
      const list = sectionData[field] ?? []
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      return { ...d, [section]: { ...sectionData, [field]: next } }
    })

  const canContinue = useMemo(() => {
    if (stepKey === 'business') {
      return data.business.industry.trim().length > 0 && data.business.description.trim().length >= 10
    }
    return true
  }, [stepKey, data.business])

  const finish = async () => {
    setFinishing(true)
    await new Promise((r) => setTimeout(r, 900))
    completeOnboarding({ ...data, brand: { ...data.brand, logoUrl: logoPreview } })
    toast(`Welcome, ${(data.business.name || user?.businessName || 'friend').split(' ')[0]} — let’s get you set up. 🎉`)
    navigate('/dashboard', { replace: true })
  }

  const setSocial = (id: PlatformId, status: PlatformStatus) =>
    set('social', { ...data.social, [id]: status })

  return (
    <div className="grain relative min-h-screen bg-ink-950 text-paper-50">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[-15%] h-[420px] w-[680px] -translate-x-1/2 rounded-full opacity-35 blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(255,74,17,0.55), transparent 60%)' }}
      />

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <GrowiseLogo className="h-7 w-auto" />
          <span className="rounded-full border border-ember-500/40 bg-ember-500/10 px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-[0.18em] text-ember-400">
            Setup
          </span>
        </div>

        <div className="mt-8">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.26em] text-ember-400">
            Step {step + 1} of {STEPS.length} — {STEPS[step].label}
          </p>
          <h1 className="mt-2 text-balance font-display text-3xl font-bold leading-tight text-paper-50 sm:text-4xl">
            {stepKey === 'business' && <>Let’s understand your business.</>}
            {stepKey === 'audience' && <>Who should we be talking to?</>}
            {stepKey === 'brand' && <>What does your brand look like?</>}
            {stepKey === 'social' && <>Where should we publish?</>}
            {stepKey === 'content' && <>What should we create?</>}
            {stepKey === 'review' && <>Ready to hand over your social media?</>}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-ink-400">
            {stepKey === 'business' && 'The more we know, the better your content will perform.'}
            {stepKey === 'audience' && 'We create content your customers actually want to watch.'}
            {stepKey === 'brand' && 'Colors, tone and voice — we’ll keep everything on-brand.'}
            {stepKey === 'social' && 'Connect the channels you want us to manage. You can do this later too.'}
            {stepKey === 'content' && 'Tell us what to promote and what to avoid.'}
            {stepKey === 'review' && 'After this, we take over. You’ll mostly just review and approve.'}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-7">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.key} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ember-500 to-gold-400 transition-all duration-500"
                  style={{ width: i <= step ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 hidden items-center gap-2 sm:flex">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const done = i < step
              const active = i === step
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300',
                    active && 'border-ember-500/50 bg-ember-500/10 text-ember-300',
                    done && 'border-white/10 bg-white/5 text-ink-400 hover:text-paper-100',
                    !active && !done && 'border-transparent text-ink-600'
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Icon className="h-3.5 w-3.5" />}
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Step content */}
        <div key={stepKey} className="mt-8 animate-fade-up">
          {stepKey === 'business' && (
            <div className="grid gap-5 rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:grid-cols-2 sm:p-8">
              <Field label="Business name">
                <TextInput
                  value={data.business.name}
                  onChange={(e) => set('business', { ...data.business, name: e.target.value })}
                  placeholder="Your Business"
                />
              </Field>
              <Field label="Industry" error={!data.business.industry ? 'Select your industry' : undefined}>
                <SelectInput value={data.business.industry} onChange={(e) => set('business', { ...data.business, industry: e.target.value })}>
                  <option value="">Select an industry</option>
                  {industryOptions.map((o) => (
                    <option key={o} value={o} className="bg-ink-900">
                      {o}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Website" optional>
                <TextInput
                  value={data.business.website}
                  onChange={(e) => set('business', { ...data.business, website: e.target.value })}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Location" optional>
                <TextInput
                  value={data.business.location}
                  onChange={(e) => set('business', { ...data.business, location: e.target.value })}
                  placeholder="City / area"
                />
              </Field>
              <Field label="Describe your business" hint="What do you sell? What makes you different?" className="sm:col-span-2" error={data.business.description.trim().length < 10 ? 'Tell us a little more (10+ characters)' : undefined}>
                <TextArea
                  rows={3}
                  value={data.business.description}
                  onChange={(e) => set('business', { ...data.business, description: e.target.value })}
                  placeholder="We’re a physiotherapy and rehabilitation centre helping people move better and live pain-free…"
                />
              </Field>
            </div>
          )}

          {stepKey === 'audience' && (
            <div className="grid gap-5 rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:grid-cols-2 sm:p-8">
              <Field label="Who is your ideal customer?" className="sm:col-span-2">
                <TextArea
                  rows={2}
                  value={data.audience.targetAudience}
                  onChange={(e) => set('audience', { ...data.audience, targetAudience: e.target.value })}
                  placeholder="e.g. Office workers with back pain, athletes, seniors managing knee pain…"
                />
              </Field>
              <Field label="Customer type" optional>
                <SelectInput value={data.audience.customerType} onChange={(e) => set('audience', { ...data.audience, customerType: e.target.value })}>
                  <option value="">Select…</option>
                  {['Individuals', 'Businesses / B2B', 'Both'].map((o) => (
                    <option key={o} value={o} className="bg-ink-900">
                      {o}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Geographic market" optional>
                <TextInput
                  value={data.audience.geoMarket}
                  onChange={(e) => set('audience', { ...data.audience, geoMarket: e.target.value })}
                  placeholder="e.g. Bengaluru & nearby"
                />
              </Field>
              <Field label="Age range">
                <SelectInput value={data.audience.ageRange} onChange={(e) => set('audience', { ...data.audience, ageRange: e.target.value })}>
                  <option value="">Select…</option>
                  {ageRangeOptions.map((o) => (
                    <option key={o} value={o} className="bg-ink-900">
                      {o}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <div className="sm:col-span-2">
                <ChipGroup
                  label="What are they interested in?"
                  options={['Fitness & mobility', 'Pain relief', 'Sports recovery', 'Posture & desk health', 'Post-surgery rehab', 'Senior care', 'Wellness & prevention']}
                  selected={data.audience.interests}
                  onToggle={(v) => toggleIn('audience', 'interests', v)}
                />
              </div>
            </div>
          )}

          {stepKey === 'brand' && (
            <div className="grid gap-5 rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:grid-cols-2 sm:p-8">
              <Field label="Brand logo" optional className="sm:col-span-2">
                <label
                  htmlFor="onb-logo"
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/15 bg-ink-800/60 p-4 transition-colors hover:border-ember-500/50"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="h-14 w-14 rounded-xl object-cover" />
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">
                      <ImagePlus className="h-6 w-6 text-ink-400" />
                    </span>
                  )}
                  <span className="text-sm text-ink-300">
                    <span className="block font-semibold text-paper-100">Upload your logo</span>
                    PNG or SVG, square preferred
                  </span>
                  <input
                    id="onb-logo"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setLogoPreview(URL.createObjectURL(file))
                    }}
                  />
                </label>
              </Field>

              <Field label="Primary color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.brand.primaryColor}
                    onChange={(e) => set('brand', { ...data.brand, primaryColor: e.target.value })}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-white/10"
                    aria-label="Primary color"
                  />
                  <TextInput value={data.brand.primaryColor} onChange={(e) => set('brand', { ...data.brand, primaryColor: e.target.value })} className="flex-1" />
                </div>
              </Field>
              <Field label="Secondary color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.brand.secondaryColor}
                    onChange={(e) => set('brand', { ...data.brand, secondaryColor: e.target.value })}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-white/10"
                    aria-label="Secondary color"
                  />
                  <TextInput value={data.brand.secondaryColor} onChange={(e) => set('brand', { ...data.brand, secondaryColor: e.target.value })} className="flex-1" />
                </div>
              </Field>
              <Field label="Brand description" optional className="sm:col-span-2">
                <TextArea
                  rows={2}
                  value={data.brand.description}
                  onChange={(e) => set('brand', { ...data.brand, description: e.target.value })}
                  placeholder="What does your brand stand for?"
                />
              </Field>
              <div className="sm:col-span-2">
                <ChipGroup
                  label="Tone of voice"
                  options={toneOptions}
                  selected={[data.brand.tone]}
                  onToggle={(v) => set('brand', { ...data.brand, tone: v })}
                />
              </div>
              <Field label="Preferred language" className="sm:col-span-2">
                <SelectInput value={data.brand.language} onChange={(e) => set('brand', { ...data.brand, language: e.target.value })}>
                  {languageOptions.map((o) => (
                    <option key={o} value={o} className="bg-ink-900">
                      {o}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          )}

          {stepKey === 'social' && (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
              <p className="text-sm text-ink-400">
                These are placeholder connections for now — real platform accounts will be linked securely later.
              </p>
              {(['instagram', 'youtube', 'linkedin', 'facebook'] as PlatformId[]).map((id) => {
                const meta = PLATFORM_META[id]
                const Icon = meta.icon
                const status = data.social[id]
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-ink-800/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ background: `${meta.color}1a`, color: meta.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold text-paper-50">{meta.name}</p>
                        <p className="text-xs text-ink-400">
                          {status === 'connected' ? 'Connected — we can publish here' : status === 'connection_required' ? 'Connection required' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={status === 'connected' ? 'outlineLight' : 'primary'}
                      size="sm"
                      onClick={() => setSocial(id, status === 'connected' ? 'not_connected' : 'connected')}
                    >
                      {status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}

          {stepKey === 'content' && (
            <div className="space-y-5 rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
              <ListInput
                label="Products / services to promote"
                placeholder="e.g. Sports injury rehab"
                items={data.content.products}
                onAdd={(v) => set('content', { ...data.content, products: [...data.content.products, v] })}
                onRemove={(v) => set('content', { ...data.content, products: data.content.products.filter((x) => x !== v) })}
              />
              <ListInput
                label="Topics we should talk about"
                placeholder="e.g. Desk posture, recovery stories"
                items={data.content.topics}
                onAdd={(v) => set('content', { ...data.content, topics: [...data.content.topics, v] })}
                onRemove={(v) => set('content', { ...data.content, topics: data.content.topics.filter((x) => x !== v) })}
              />
              <ListInput
                label="Things to avoid"
                placeholder="e.g. Pricing specifics, before/after photos"
                items={data.content.avoid}
                onAdd={(v) => set('content', { ...data.content, avoid: [...data.content.avoid, v] })}
                onRemove={(v) => set('content', { ...data.content, avoid: data.content.avoid.filter((x) => x !== v) })}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <ChipGroup
                  label="Preferred content style"
                  options={contentStyleOptions}
                  selected={[data.content.style]}
                  onToggle={(v) => set('content', { ...data.content, style: v })}
                />
                <Field label="Posting frequency">
                  <SelectInput value={data.content.frequency} onChange={(e) => set('content', { ...data.content, frequency: e.target.value })}>
                    {frequencyOptions.map((o) => (
                      <option key={o} value={o} className="bg-ink-900">
                        {o}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
            </div>
          )}

          {stepKey === 'review' && (
            <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <SummaryRow label="Business" value={data.business.name || user?.businessName || ''} sub={data.business.industry} />
                <SummaryRow label="Audience" value={data.audience.targetAudience || data.audience.ageRange} sub={data.audience.geoMarket || 'Global'} />
                <SummaryRow label="Brand" value={data.brand.tone} sub={`${data.brand.language} · ${data.brand.primaryColor} / ${data.brand.secondaryColor}`} />
                <SummaryRow
                  label="Platforms"
                  value={Object.entries(data.social)
                    .filter(([, s]) => s === 'connected')
                    .map(([id]) => PLATFORM_META[id as PlatformId].name)
                    .join(', ') || 'None connected'}
                  sub="You can connect more later"
                />
                <SummaryRow label="Content" value={data.content.style} sub={data.content.frequency} />
              </div>
              <div className="mt-7 rounded-xl border border-gold-400/20 bg-gold-400/5 p-5">
                <p className="flex items-center gap-2 font-display text-sm font-bold text-gold-300">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  What happens next
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">
                  GroWise takes it from here — ideas, scripts, production, publishing and analytics.
                  You’ll mostly <span className="font-semibold text-paper-100">review → approve → watch results</span>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            type="button"
            variant="ghostLight"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={cn(step === 0 && 'invisible')}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </Button>
          {isLast ? (
            <Button type="button" size="lg" onClick={finish} disabled={finishing}>
              {finishing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Setting up…
                </>
              ) : (
                <>
                  Let’s build your social presence
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink-800/50 p-4">
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink-500">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-paper-50">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-400">{sub}</p>}
    </div>
  )
}
