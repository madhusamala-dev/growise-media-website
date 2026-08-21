import { useState } from 'react'
import { ImagePlus, Palette, Save } from 'lucide-react'
import { usePortal } from '../lib/store'
import { useToast } from '../lib/toast'
import type { BrandKit as BrandKitType } from '../data/types'
import { fontOptions } from '../data/demo'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader } from '../components/ui/Card'
import { Field, SelectInput, TextArea, TextInput } from '../components/ui/Field'
import { LogoMark } from '../components/Logo'

const TONES = ['Professional', 'Friendly', 'Trustworthy', 'Bold', 'Warm', 'Minimal']
const CONTENT_STYLES = ['Educational', 'Promotional', 'Behind the scenes', 'Customer stories']

export function BrandKit() {
  const { brand, updateBrand } = usePortal()
  const { toast } = useToast()
  const [form, setForm] = useState<BrandKitType>(brand)
  const [logoPreview, setLogoPreview] = useState<string | undefined>(brand.logoUrl)

  const set = <K extends keyof BrandKitType>(key: K, value: BrandKitType[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const save = () => {
    updateBrand({ ...form, logoUrl: logoPreview })
    toast('Brand kit saved — GroWise will keep everything on-brand.')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Brand"
        title="Your Brand Kit"
        description="How GroWise represents you in every piece of content."
        action={
          <Button onClick={save}>
            <Save className="h-4 w-4" aria-hidden />
            Save changes
          </Button>
        }
      />

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_22rem]">
        {/* Forms */}
        <div className="space-y-5">
          <Card className="p-6">
            <CardHeader title="Logo & identity" subtitle="Your mark, colors and typography" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Brand logo" optional className="sm:col-span-2">
                <label
                  htmlFor="brand-logo"
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/15 bg-ink-800/60 p-4 transition-colors hover:border-ember-500/50"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Brand logo" className="h-14 w-14 rounded-xl object-cover" />
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
                    id="brand-logo"
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
                    value={form.primaryColor}
                    onChange={(e) => set('primaryColor', e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-white/10"
                    aria-label="Primary color"
                  />
                  <TextInput value={form.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} />
                </div>
              </Field>
              <Field label="Secondary color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.secondaryColor}
                    onChange={(e) => set('secondaryColor', e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-white/10"
                    aria-label="Secondary color"
                  />
                  <TextInput value={form.secondaryColor} onChange={(e) => set('secondaryColor', e.target.value)} />
                </div>
              </Field>
              <Field label="Display font">
                <SelectInput value={form.font} onChange={(e) => set('font', e.target.value)}>
                  {fontOptions.map((f) => (
                    <option key={f} value={f} className="bg-ink-900">
                      {f}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Tagline">
                <TextInput value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Your tagline" />
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader title="Brand voice" subtitle="How your brand sounds and what it promises" />
            <div className="mt-5 space-y-5">
              <Field label="Brand description">
                <TextArea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
              </Field>
              <div>
                <p className="mb-2 font-display text-[13px] font-semibold text-paper-100">Tone of voice</p>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((tone) => {
                    const active = form.tone.includes(tone)
                    return (
                      <button
                        key={tone}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          const current = form.tone
                            .split('·')
                            .map((t) => t.trim())
                            .filter(Boolean)
                          const next = active ? current.filter((t) => t !== tone) : [...current, tone]
                          set('tone', next.join(' · ') || 'Professional')
                        }}
                        className={
                          active
                            ? 'rounded-full border border-ember-500 bg-ember-500 px-3.5 py-1.5 text-[13px] font-semibold text-white'
                            : 'rounded-full border border-white/15 bg-ink-800 px-3.5 py-1.5 text-[13px] font-medium text-ink-300 transition-colors hover:border-ember-500/60'
                        }
                      >
                        {tone}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader title="Contact information" subtitle="Shown on your published content" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Website">
                <TextInput value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://…" />
              </Field>
              <Field label="Contact email">
                <TextInput value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="hello@business.com" />
              </Field>
              <Field label="Contact phone" className="sm:col-span-2">
                <TextInput value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} placeholder="+91 …" />
              </Field>
            </div>
          </Card>
        </div>

        {/* Preview + guidelines */}
        <div className="space-y-5">
          <Card glow className="p-6">
            <CardHeader title="Live preview" subtitle="How your brand looks" />
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="h-24 w-full" style={{ background: `linear-gradient(120deg, ${form.primaryColor}, ${form.secondaryColor})` }} />
              <div className="bg-paper-50 p-5">
                <div className="flex items-center gap-3">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Brand logo" className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <LogoMark className="h-10 w-10 rounded-lg" />
                  )}
                  <div>
                    <p className="font-display text-base font-bold text-ink-950" style={{ fontFamily: form.font }}>
                      {form.tagline || 'Your Brand Name'}
                    </p>
                    <p className="text-xs text-ink-500">@yourbrand</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-ink-600">{form.description || 'Your brand description appears here.'}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-[11px] font-bold text-white" style={{ background: form.primaryColor }}>
                    CTA
                  </span>
                  <span className="rounded-full px-3 py-1 text-[11px] font-bold text-ink-950" style={{ background: form.secondaryColor }}>
                    Highlight
                  </span>
                  <span className="rounded-full border border-ink-300 px-3 py-1 text-[11px] font-bold text-ink-700">
                    Outline
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader title="Brand guidelines" subtitle="What GroWise follows" />
            <div className="mt-5 space-y-5">
              <div>
                <p className="mb-2 flex items-center gap-2 font-display text-[13px] font-semibold text-paper-100">
                  <Palette className="h-4 w-4 text-ember-400" aria-hidden />
                  Tone
                </p>
                <div className="flex flex-wrap gap-2">
                  {form.tone
                    .split('·')
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <span key={t} className="rounded-full border border-white/15 bg-ink-800 px-3 py-1 text-[12px] font-medium text-paper-100">
                        {t}
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-display text-[13px] font-semibold text-paper-100">Content preferences</p>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_STYLES.map((s) => (
                    <span key={s} className="rounded-full bg-white/5 px-3 py-1 text-[12px] font-medium text-ink-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-ink-800/50 p-4">
                <p className="text-[13px] leading-relaxed text-ink-300">
                  <span className="font-semibold text-paper-100">Language:</span> English —{' '}
                  <span className="font-semibold text-paper-100">Frequency:</span> 2 videos / week
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
