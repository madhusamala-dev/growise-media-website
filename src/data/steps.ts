import type { LucideIcon } from 'lucide-react'
import { Search, Target, Sparkles, CalendarCheck, TrendingUp } from 'lucide-react'

export interface Step {
  icon: LucideIcon
  title: string
  description: string
}

export const steps: Step[] = [
  {
    icon: Search,
    title: 'Free Growth Audit',
    description:
      'GroWise analyzes your digital presence across Instagram, YouTube & web to uncover your Overall Growth Score and opportunities.',
  },
  {
    icon: Target,
    title: 'Custom AI Strategy',
    description:
      'Connect your business details, products & audience goals. GroWise builds a Growth Blueprint specifically for your brand.',
  },
  {
    icon: Sparkles,
    title: 'AI Content Execution',
    description:
      'Receive a 30-day content calendar with Reels scripts, carousels, and hooks built around education, trust, and lead generation.',
  },
  {
    icon: CalendarCheck,
    title: 'Approve & Auto-Publish',
    description:
      'Review and approve content in your workflow dashboard. GroWise handles multi-channel scheduling and automated publishing.',
  },
  {
    icon: TrendingUp,
    title: 'Automate Leads & Scale Ads',
    description:
      'Turn social engagement into automated WhatsApp leads, analyze AI insights, and scale winning organic content into paid campaigns.',
  },
]
