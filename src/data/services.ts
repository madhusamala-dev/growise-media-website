import type { LucideIcon } from 'lucide-react'
import {
  Search,
  Target,
  CalendarDays,
  Video,
  MessageCircle,
  BarChart3,
  Megaphone,
  Rocket,
} from 'lucide-react'

export interface Service {
  icon: LucideIcon
  title: string
  description: string
  deliverables: string[]
}

export const services: Service[] = [
  {
    icon: Search,
    title: 'AI Growth Audit',
    description:
      'We analyze your digital presence across Instagram, YouTube, and the web to uncover your growth score and opportunities.',
    deliverables: [
      'Overall Growth Score',
      'Platform diagnostics',
      'Competitor benchmarking',
    ],
  },
  {
    icon: Target,
    title: 'Custom AI Strategy',
    description:
      'A tailored growth blueprint built around your business, audience, and goals \u2014 not a generic template.',
    deliverables: [
      'Growth Blueprint',
      'Audience targeting',
      'Content pillars',
    ],
  },
  {
    icon: CalendarDays,
    title: '30-Day Content Calendar',
    description:
      'A full month of content planned, scripted, and scheduled \u2014 Reels, carousels, stories, and hooks.',
    deliverables: [
      'Reels scripts',
      'Carousel designs',
      'Caption & hashtags',
    ],
  },
  {
    icon: Video,
    title: 'AI Content Production',
    description:
      'From scripting to editing, GroWise\u2019s AI handles content creation while human creatives ensure quality.',
    deliverables: [
      'Reels & short-form video',
      'Carousel posts',
      'Story sequences',
    ],
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Lead Engine',
    description:
      'Automated lead capture, qualification, and follow-up through WhatsApp \u2014 turning engagement into conversations.',
    deliverables: [
      'Lead capture funnels',
      'Auto follow-ups',
      'CRM pipeline',
    ],
  },
  {
    icon: BarChart3,
    title: 'Analytics & Growth Loop',
    description:
      'Weekly AI-powered insights and monthly growth reviews that tell you exactly what\u2019s working and what to do next.',
    deliverables: [
      'Weekly insights',
      'Monthly growth review',
      'Performance dashboard',
    ],
  },
  {
    icon: Megaphone,
    title: 'Ad Management',
    description:
      'We identify your best-performing organic content and scale it into paid campaigns on Instagram and Facebook.',
    deliverables: [
      'Ad creative selection',
      'Campaign setup',
      'Budget optimization',
    ],
  },
  {
    icon: Rocket,
    title: 'Growth Scaling',
    description:
      'Continuous optimization of your entire marketing engine \u2014 content, leads, and ads \u2014 for compounding growth.',
    deliverables: [
      'Monthly strategy updates',
      'A/B testing',
      'Scaling playbook',
    ],
  },
]

export const servicesNote =
  'Every service is part of the GroWise AI growth platform. You can start with one piece or activate the full engine \u2014 we\u2019ll build around what your business needs most.'
