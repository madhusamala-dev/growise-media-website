import type { LucideIcon } from 'lucide-react'
import { Repeat, Sparkles, Cpu, PenTool, CheckCircle2, BadgeIndianRupee } from 'lucide-react'

export interface Reason {
  icon: LucideIcon
  title: string
  description: string
}

export const reasons: Reason[] = [
  {
    icon: Repeat,
    title: 'Consistency',
    description:
      'Your brand shows up every day with a steady stream of content \u2014 no gaps, no guesswork, no burnout.',
  },
  {
    icon: Sparkles,
    title: 'Professional Content',
    description:
      'Studio-quality Reels, carousels, and stories crafted by GroWise\u2019s AI \u2014 polished, on-brand, and scroll-stopping.',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Production',
    description:
      'From scripting to scheduling, GroWise handles the entire production pipeline using artificial intelligence.',
  },
  {
    icon: PenTool,
    title: 'Human Creative Direction',
    description:
      'Real creative minds review and refine every piece \u2014 AI does the heavy lifting, humans ensure it feels right.',
  },
  {
    icon: CheckCircle2,
    title: 'Done For You',
    description:
      'You approve, we publish. No tools to learn, no dashboards to manage \u2014 GroWise runs your marketing engine for you.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Value-Based Pricing',
    description:
      'Transparent plans built around your growth goals \u2014 not hidden fees, not per-post charges, not surprises.',
  },
]
