import type { LucideIcon } from 'lucide-react'
import {
  HelpCircle,
  Pencil,
  BarChart3,
  UserX,
  Search,
  Target,
  CalendarDays,
  TrendingUp,
  MessageCircle,
  Rocket,
} from 'lucide-react'

export interface VisualTile {
  tone: 'ember' | 'gold' | 'ink'
  label: string
  imageUrl?: string
  icon: LucideIcon
}

export interface CardContent {
  label: string
  heading: string
  subheading: string
  points: string[]
  visualsCaption: string
  visuals: VisualTile[]
}

export const beforeAfter = {
  eyebrow: 'From Chaos to Growth Engine',
  description:
    "Marketing shouldn\u2019t feel like a second full-time job. See how your business moves from fragmented, manual effort to a unified, AI-powered growth platform with GroWise.",
}

/* ------------------------------------------------------------------ */
/*  WITHOUT GROWISE                                                    */
/* ------------------------------------------------------------------ */

export const beforeCard: CardContent = {
  label: 'WITHOUT GROWISE',
  heading: 'Fragmented & Exhausting',
  subheading: 'Manual marketing across scattered, unpredictable channels',
  points: [
    'Guessing what content to create',
    'Creating and editing posts manually',
    'Juggling logins for multiple platforms',
    'Checking raw analytics without clear answers',
    'Missing customer leads in comments and DMs',
    'Manually following up with inquiries',
    'Spending ad spend with completely separate tools',
    'Starting from scratch every single time',
  ],
  visualsCaption: 'VISUAL CHAOS',
  visuals: [
    { tone: 'ink', label: 'Guessing Topics', imageUrl: '/visuals/guessing-topics.png', icon: HelpCircle },
    { tone: 'ink', label: 'Manual Posting', imageUrl: '/visuals/manual-posting.png', icon: Pencil },
    { tone: 'ink', label: 'Raw Data Noise', imageUrl: '/visuals/raw-data-noise.png', icon: BarChart3 },
    { tone: 'ink', label: 'Missed Leads', imageUrl: '/visuals/missed-leads.png', icon: UserX },
  ],
}

/* ------------------------------------------------------------------ */
/*  WITH GROWISE                                                       */
/* ------------------------------------------------------------------ */

export const afterCard: CardContent = {
  label: 'WITH GROWISE',
  heading: 'Unified & Automated',
  subheading: 'One dashboard, one engine, one continuous growth system.',
  points: [
    'Free AI digital presence & growth audit',
    'Custom strategy based on your business & audience',
    'AI-powered content plan: 30-day calendar',
    'Reels scripts, carousels & hooks built for you',
    'AI insights with AI explains what to do next',
    'Automated lead capture & instant WhatsApp routing',
    'AI lead qualification & pipeline tracking',
    'Content published across Instagram, YouTube, Facebook',
    'Ad campaign launch: promote winning organic content into paid ad campaigns',
    'Monthly AI growth review that improves every cycle',
  ],
  visualsCaption: 'STREAMLINED GROWTH',
  visuals: [
    { tone: 'ember', label: 'AI Growth Audit', icon: Search },
    { tone: 'gold', label: 'Custom Blueprint', icon: Target },
    { tone: 'ember', label: '30 Day Calendar', icon: CalendarDays },
    { tone: 'gold', label: 'AI Insights', icon: TrendingUp },
    { tone: 'ember', label: 'WhatsApp Leads', icon: MessageCircle },
    { tone: 'gold', label: 'Ad Scaling', icon: Rocket },
  ],
}

/* ------------------------------------------------------------------ */
/*  Core message                                                       */
/* ------------------------------------------------------------------ */

export const coreMessage = {
  title: 'Stop Guessing. Stop Managing. Start Growing.',
  support:
    'GroWise connects strategy, content creation, publishing, analytics, lead automation, and paid advertising into one continuous growth loop.',
  words: ['STRATEGY', 'CONTENT', 'LEADS', 'ADS', 'GROWTH'],
}

/* ------------------------------------------------------------------ */
/*  Viral note                                                         */
/* ------------------------------------------------------------------ */

export const viralNote = {
  title: 'Built for businesses that want to grow.',
  support:
    'GroWise handles your social media, marketing & growth \u2014 so you can focus on running your core business.',
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

export const differenceCta = {
  title: 'Ready to turn your marketing into a growth engine?',
  button: 'Get Your Free Growth Audit',
}
