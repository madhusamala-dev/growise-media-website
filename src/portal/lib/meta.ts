import type { ComponentType } from 'react'
import type { ContentStatus, PlatformId } from '../data/types'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  type BrandIconProps,
} from './brandIcons'

/** Visual metadata for every content pipeline status. */
export const STATUS_META: Record<
  ContentStatus,
  { label: string; badge: string; dot: string; bar: string; stage: string }
> = {
  idea: {
    label: 'Idea',
    badge: 'border-white/10 bg-white/5 text-ink-300',
    dot: 'bg-ink-400',
    bar: 'bg-ink-500',
    stage: 'Idea',
  },
  script: {
    label: 'Script',
    badge: 'border-teal-500/25 bg-teal-500/10 text-teal-300',
    dot: 'bg-teal-400',
    bar: 'bg-teal-400',
    stage: 'Script',
  },
  production: {
    label: 'In Production',
    badge: 'border-indigo-500/25 bg-indigo-500/10 text-indigo-300',
    dot: 'bg-indigo-400',
    bar: 'bg-indigo-400',
    stage: 'Production',
  },
  editing: {
    label: 'Editing',
    badge: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
    dot: 'bg-violet-400',
    bar: 'bg-violet-400',
    stage: 'Editing',
  },
  approval: {
    label: 'Awaiting Approval',
    badge: 'border-gold-400/30 bg-gold-400/10 text-gold-300',
    dot: 'bg-gold-400',
    bar: 'bg-gold-400',
    stage: 'Client Approval',
  },
  revision: {
    label: 'In Revision',
    badge: 'border-ember-500/30 bg-ember-500/10 text-ember-300',
    dot: 'bg-ember-400',
    bar: 'bg-ember-400',
    stage: 'Editing',
  },
  scheduled: {
    label: 'Scheduled',
    badge: 'border-sky-500/25 bg-sky-500/10 text-sky-300',
    dot: 'bg-sky-400',
    bar: 'bg-sky-400',
    stage: 'Scheduled',
  },
  published: {
    label: 'Published',
    badge: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400',
    bar: 'bg-emerald-400',
    stage: 'Published',
  },
}

export const PLATFORM_META: Record<PlatformId, { name: string; color: string; icon: ComponentType<BrandIconProps> }> = {
  instagram: { name: 'Instagram', color: '#e1306c', icon: InstagramIcon },
  youtube: { name: 'YouTube', color: '#ff0033', icon: YoutubeIcon },
  linkedin: { name: 'LinkedIn', color: '#0a66c2', icon: LinkedinIcon },
  facebook: { name: 'Facebook', color: '#1877f2', icon: FacebookIcon },
}
