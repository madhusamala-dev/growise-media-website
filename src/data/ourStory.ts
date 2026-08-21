import type { LucideIcon } from 'lucide-react'

export interface Person {
  name: string
  role: string
  tag: string
  descriptor: string
  story: string
  quote?: string
  tone: 'ember' | 'gold' | 'ink'
  imageUrl?: string
  avatarBadge?: LucideIcon
  strengths: string[]
}

/** Placeholder — real team story to be added before launch. */
export const people: Person[] = []

export const ourStory = { eyebrow: 'Our Story', description: '' }

export const familyStory = { title: '', paragraphs: [] as string[], emphasize: '' }

export const brandMeaning = { name: 'GroWise', equals: ['Growth', 'Wise'] as [string, string], support: '' }

export const reasonBlock = {
  title: '',
  intro: '',
  body: [] as string[],
  outro: '',
  signature: '',
}

export const storyCta = { title: '', support: '', button: '' }
