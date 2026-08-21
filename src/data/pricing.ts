import type { LucideIcon } from 'lucide-react'
import {
  Target,
  TrendingUp,
  CalendarDays,
  MessageCircle,
  BarChart3,
  Rocket,
} from 'lucide-react'

export interface PricingPlan {
  name: string
  tagline: string
  price: string
  priceNote?: string
  featured?: boolean
  badge?: string
  cta: string
  footnote?: string
  ctaMicroMessage?: string
  valueStatement?: { title: string; support: string }
  heroFeature?: string
  featureGroups?: { label: string; features: string[] }[]
  whyCard?: { title: string; text: string }
  features?: string[]
}

export interface ValuePillar {
  icon: LucideIcon
  title: string
  description: string
}

/* ------------------------------------------------------------------ */
/*  Plans                                                              */
/* ------------------------------------------------------------------ */

export const plans: PricingPlan[] = [
  {
    name: 'Essential',
    tagline: 'Content creation & scheduling',
    price: '\u20B94,999',
    priceNote: '/month',
    cta: 'Get Started',
    footnote: 'Perfect for businesses just getting started with social media.',
    features: [
      'AI content strategy & calendar',
      '8 Reels / month (2 per week)',
      'Caption & hashtag generation',
      'Multi-platform scheduling',
      'Monthly performance report',
      'WhatsApp support',
    ],
  },
  {
    name: 'Growth',
    tagline: 'Full-stack AI marketing engine',
    price: '\u20B99,999',
    priceNote: '/month',
    featured: true,
    badge: 'Most Popular',
    cta: 'Start Free Audit',
    ctaMicroMessage: 'Start with a free AI growth audit \u2014 no commitment required.',
    valueStatement: {
      title: 'Everything in Essential, plus a full growth system',
      support:
        'Strategy, content, leads, ads, analytics \u2014 all handled by GroWise so you can focus on your business.',
    },
    heroFeature: 'Free AI Digital Presence & Growth Audit included',
    featureGroups: [
      {
        label: 'Content & Strategy',
        features: [
          '20 Reels / month (5 per week)',
          '30-day content calendar',
          'Reels scripts, carousels & hooks',
          'Brand-aligned creative direction',
        ],
      },
      {
        label: 'Leads & Automation',
        features: [
          'WhatsApp lead capture funnel',
          'AI lead qualification & routing',
          'Automated follow-up sequences',
          'CRM-ready pipeline tracking',
        ],
      },
      {
        label: 'Ads & Analytics',
        features: [
          'Ad campaign setup & management',
          'Winning content -> paid scaling',
          'Weekly AI growth insights',
          'Monthly performance review',
        ],
      },
    ],
    whyCard: {
      title: 'Why Growth?',
      text: 'Businesses that combine content + leads + ads grow 3x faster than those using content alone.',
    },
  },
]

/* ------------------------------------------------------------------ */
/*  Pricing messaging                                                  */
/* ------------------------------------------------------------------ */

export const pricingMessage = {
  support:
    'GroWise isn\u2019t a content agency \u2014 it\u2019s an AI-powered growth platform that handles strategy, creation, publishing, leads, and ads in one system.',
}

export const pricingNote =
  'Most businesses spend \u20B930,000\u2013\u20B950,000/mo on a marketing team. GroWise delivers more, for less \u2014 powered by AI.\u201D'

export const pricingFootnote =
  'All plans include a free AI growth audit. No lock-in. Cancel anytime. Custom enterprise plans available on request.'

/* ------------------------------------------------------------------ */
/*  Why GroWise is different                                            */
/* ------------------------------------------------------------------ */

export const whyDifferent = {
  title: 'Why GroWise is different',
  intro:
    'Traditional agencies charge per post. GroWise delivers a complete growth system \u2014 strategy, content, leads, ads, and analytics \u2014 for a predictable monthly fee.',
}

export const valuePillars: ValuePillar[] = [
  {
    icon: Target,
    title: 'Strategy-First Approach',
    description:
      'Every piece of content ties back to a growth strategy built around your business goals, audience, and market.',
  },
  {
    icon: TrendingUp,
    title: 'AI-Powered Execution',
    description:
      'From scripting to scheduling to lead routing, GroWise\u2019s AI handles the heavy lifting so you don\u2019t have to.',
  },
  {
    icon: CalendarDays,
    title: '30-Day Content Calendar',
    description:
      'A month of content planned, scripted, and ready to publish \u2014 updated weekly based on performance data.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Lead Engine',
    description:
      'Turn social engagement into qualified leads with automated WhatsApp funnels and instant follow-ups.',
  },
  {
    icon: BarChart3,
    title: 'Weekly AI Growth Insights',
    description:
      'Clear, actionable reports that show what\u2019s working, what\u2019s not, and what to do next \u2014 no data science degree required.',
  },
  {
    icon: Rocket,
    title: 'Content-to-Ads Pipeline',
    description:
      'GroWise identifies your best-performing organic content and scales it into paid campaigns automatically.',
  },
]
