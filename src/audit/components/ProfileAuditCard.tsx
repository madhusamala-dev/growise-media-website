import { Check, AlertTriangle, Globe, Users, Grid, UserCheck } from 'lucide-react'
import type { InstagramProfile } from '../types'

interface ProfileAuditCardProps {
  profile: InstagramProfile
}

export function ProfileAuditCard({ profile }: ProfileAuditCardProps) {
  const hasWebsite = Boolean(profile.website_url && profile.website_url.length > 5)
  const hasCta = profile.bio.includes('Book') || profile.bio.includes('DM') || profile.bio.includes('👇') || profile.bio.includes('Visit')
  const hasBenefit = profile.bio.length >= 30

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <img
            src={profile.profile_image_url}
            alt={profile.display_name}
            className="h-16 w-16 rounded-full object-cover border-2 border-ember-500/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold text-white">{profile.display_name}</h3>
              {profile.is_business_account && (
                <span className="bg-ember-500/10 text-ember-400 border border-ember-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Business
                </span>
              )}
            </div>
            <p className="text-sm font-mono text-slate-400">@{profile.username}</p>
            <p className="text-xs text-ember-400/80 font-medium mt-0.5">{profile.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center bg-slate-950/60 border border-slate-800 px-5 py-3 rounded-2xl">
          <div>
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-medium">
              <Users className="h-3.5 w-3.5 text-ember-400" />
              <span>Followers</span>
            </div>
            <span className="font-display font-bold text-white text-base">
              {profile.followers_count.toLocaleString()}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-medium">
              <UserCheck className="h-3.5 w-3.5 text-blue-400" />
              <span>Following</span>
            </div>
            <span className="font-display font-bold text-white text-base">
              {profile.following_count.toLocaleString()}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-medium">
              <Grid className="h-3.5 w-3.5 text-amber-400" />
              <span>Posts</span>
            </div>
            <span className="font-display font-bold text-white text-base">
              {profile.posts_count.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bio Display */}
      <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Current Bio Preview
        </span>
        <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
          {profile.bio}
        </p>
        {profile.website_url && (
          <a
            href={profile.website_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-ember-400 hover:text-ember-300 font-semibold mt-3 underline"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{profile.website_url}</span>
          </a>
        )}
      </div>

      {/* Profile Breakdown checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${hasBenefit ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
          {hasBenefit ? (
            <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="text-sm font-bold text-white block">Value Proposition</span>
            <span className="text-xs text-slate-400">
              {hasBenefit ? 'Bio contains sufficient detail outlining offerings.' : 'Bio is too short to communicate clear customer value.'}
            </span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${hasCta ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
          {hasCta ? (
            <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="text-sm font-bold text-white block">Call To Action (CTA)</span>
            <span className="text-xs text-slate-400">
              {hasCta ? 'Bio includes direct action prompt.' : 'Missing direct CTA directing visitors on next step.'}
            </span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${hasWebsite ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
          {hasWebsite ? (
            <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="text-sm font-bold text-white block">Website & Lead Link</span>
            <span className="text-xs text-slate-400">
              {hasWebsite ? 'Profile includes link in bio.' : 'No website URL configured in profile.'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border bg-emerald-500/5 border-emerald-500/20 flex items-start gap-3">
          <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-sm font-bold text-white block">Account Category</span>
            <span className="text-xs text-slate-400">Categorized as {profile.category}.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
