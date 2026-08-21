import { Mail, MessageCircle, Shield, HelpCircle } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'

const contactMethods = [
  {
    icon: HelpCircle,
    title: 'General Support',
    description: 'Questions about GroWise, your account, or how to get started.',
    action: { label: 'support@growise.media', href: 'mailto:support@growise.media' },
  },
  {
    icon: Shield,
    title: 'Privacy & Data Requests',
    description: 'Requests related to your personal data, data access, or data correction.',
    action: { label: 'support@growise.media', href: 'mailto:support@growise.media' },
  },
  {
    icon: Mail,
    title: 'Data Deletion Requests',
    description: 'Request deletion of your GroWise account and associated data.',
    action: { label: 'support@growise.media', href: 'mailto:support@growise.media' },
  },
  {
    icon: MessageCircle,
    title: 'Social Media Integration Support',
    description: 'Help with connecting or disconnecting your Instagram or other social accounts.',
    action: { label: 'support@growise.media', href: 'mailto:support@growise.media' },
  },
]

export function ContactPage() {
  return (
    <section className="relative bg-ink-950 py-24 lg:py-32">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-30" />
      <Container className="relative">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-paper-50 sm:text-4xl lg:text-5xl">
            Contact GroWise
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-300">
            Have a question, need help, or want to request data deletion? We&apos;re here to help.
            Reach out to us and we&apos;ll get back to you as soon as possible.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {contactMethods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.title}
                  className="rounded-3xl border border-white/10 bg-ink-900 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ember-500/50"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember-500/10">
                    <Icon className="h-6 w-6 text-ember-400" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">
                    {method.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">
                    {method.description}
                  </p>
                  <Button
                    href={method.action.href}
                    variant="outlineLight"
                    size="sm"
                    className="mt-5"
                  >
                    {method.action.label}
                  </Button>
                </div>
              )
            })}
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-ink-900 p-8 text-center">
            <h2 className="font-display text-xl font-bold text-paper-50">
              Response Time
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-300">
              We aim to respond to all inquiries within 2 business days. For urgent data deletion
              requests, please include &quot;Urgent — Data Deletion&quot; in your subject line.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
