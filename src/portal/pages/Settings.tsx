import { useState, type FormEvent } from 'react'
import { Building2, LogOut, Save, Shield, User } from 'lucide-react'
import { usePortal } from '../lib/store'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader } from '../components/ui/Card'
import { Field, TextInput } from '../components/ui/Field'
import { Toggle } from '../components/ui/Toggle'
import { demoClient } from '../data/demo'

export function Settings() {
  const { settings, updateSettings, brand } = usePortal()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const [profile, setProfile] = useState(settings.profile)
  const [business, setBusiness] = useState(settings.business)
  const [notifications, setNotifications] = useState(settings.notifications)
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    updateSettings({ profile })
    toast('Profile updated')
  }

  const saveBusiness = (e: FormEvent) => {
    e.preventDefault()
    updateSettings({ business })
    toast('Business details updated')
  }

  const savePassword = (e: FormEvent) => {
    e.preventDefault()
    if (password.next.length < 6) {
      toast('New password must be at least 6 characters', 'error')
      return
    }
    if (password.next !== password.confirm) {
      toast('New passwords do not match', 'error')
      return
    }
    setPassword({ current: '', next: '', confirm: '' })
    toast('Password changed successfully')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Account & Preferences"
        description="Manage your profile, business details and notifications."
      />

      <div className="mt-7 space-y-5">
        {/* Profile */}
        <Card className="p-6">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-ember-400" aria-hidden /> Profile
              </span>
            }
            subtitle="How we address you"
          />
          <form onSubmit={saveProfile} className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Full name">
              <TextInput value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} />
            </Field>
            <Field label="Email">
              <TextInput type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
            </Field>
            <Field label="Phone">
              <TextInput value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
            </Field>
            <div className="sm:col-span-2 lg:col-span-3">
              <Button type="submit" size="sm">
                <Save className="h-4 w-4" aria-hidden />
                Save profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Business */}
        <Card className="p-6">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-ember-400" aria-hidden /> Business
              </span>
            }
            subtitle="The details GroWise uses to create your content"
          />
          <form onSubmit={saveBusiness} className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Business name">
              <TextInput value={business.name} onChange={(e) => setBusiness((b) => ({ ...b, name: e.target.value }))} />
            </Field>
            <Field label="Industry">
              <TextInput value={business.industry} onChange={(e) => setBusiness((b) => ({ ...b, industry: e.target.value }))} />
            </Field>
            <Field label="Website">
              <TextInput value={business.website} onChange={(e) => setBusiness((b) => ({ ...b, website: e.target.value }))} />
            </Field>
            <Field label="Location">
              <TextInput value={business.location} onChange={(e) => setBusiness((b) => ({ ...b, location: e.target.value }))} />
            </Field>
            <div>
              <Button type="submit" size="sm">
                <Save className="h-4 w-4" aria-hidden />
                Save business
              </Button>
            </div>
          </form>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <CardHeader title="Notifications" subtitle="Choose what you hear about" />
          <div className="mt-5 space-y-4">
            {(
              [
                ['email', 'Email notifications', 'Product updates and account activity'],
                ['approvals', 'Approval notifications', 'When new content is waiting for your review'],
                ['publishing', 'Publishing notifications', 'When your posts go live'],
                ['weeklyReport', 'Weekly report', 'A summary of your social media results every Friday'],
              ] as const
            ).map(([key, label, hint]) => (
              <div key={key} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-ink-800/40 px-4 py-3.5">
                <div>
                  <p className="text-[13.5px] font-semibold text-paper-100">{label}</p>
                  <p className="mt-0.5 text-[12px] text-ink-500">{hint}</p>
                </div>
                <Toggle
                  id={`ntf-${key}`}
                  checked={notifications[key]}
                  onChange={(v) => {
                    setNotifications((n) => ({ ...n, [key]: v }))
                    updateSettings({ notifications: { ...notifications, [key]: v } })
                  }}
                  label={label}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-ember-400" aria-hidden /> Security
              </span>
            }
            subtitle={`Signed in as ${user?.email ?? ''}`}
          />
          <form onSubmit={savePassword} className="mt-5 grid gap-5 sm:grid-cols-3">
            <Field label="Current password">
              <TextInput
                type="password"
                value={password.current}
                onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
                placeholder="••••••••"
              />
            </Field>
            <Field label="New password">
              <TextInput
                type="password"
                value={password.next}
                onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))}
                placeholder="At least 6 characters"
              />
            </Field>
            <Field label="Confirm new password">
              <TextInput
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password"
              />
            </Field>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
              <Button type="submit" size="sm">
                <Shield className="h-4 w-4" aria-hidden />
                Change password
              </Button>
              <Button variant="outlineLight" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" aria-hidden />
                Log out
              </Button>
            </div>
          </form>
          <p className="mt-4 text-[11px] text-ink-600">
            Role: <span className="font-semibold text-ink-400">CLIENT</span> · Brand kit:{' '}
            <span className="font-semibold text-ink-400">{brand.primaryColor} / {brand.secondaryColor}</span>
          </p>
          <p className="mt-2 text-[11px] text-ink-600">
            Demo data belongs to {demoClient.businessName} — swap {`src/portal/data/demo.ts`} for real APIs when the backend is ready.
          </p>
        </Card>
      </div>
    </div>
  )
}
