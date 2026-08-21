import {
  ArrowRight,
  ChevronRight,
  MessageCircle,
  Users,
} from 'lucide-react'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

export function LeadsAndWhatsApp() {
  return (
    <section id="leads" className="grain relative bg-ink-950 py-20 lg:py-28">
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />

      <Container className="relative space-y-24">
        {/* Lead Generation Section */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-sm">
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Lead Conversion Architecture
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Turn social attention <br />
                <span className="text-gradient-ember">into high-value leads.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-4 text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
                Your marketing shouldn't stop at likes and comments. GroWise captures audience interest and builds a clean lead pipeline for your business.
              </p>
            </Reveal>
          </div>

          {/* Lead Pipeline Visual */}
          <div className="mt-12">
            <Reveal delay={180}>
              <div className="rounded-2xl border border-white/15 bg-ink-900/95 p-6 shadow-2xl backdrop-blur-2xl lg:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-display text-sm font-bold text-white">Live Business Lead Pipeline</span>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-display text-xs font-bold text-emerald-400">
                    34 Active Leads
                  </span>
                </div>

                {/* Pipeline Stages */}
                <div className="mt-6 grid gap-4 sm:grid-cols-5">
                  {[
                    { stage: 'NEW', count: '12', color: 'border-sky-500/30 bg-sky-500/10 text-sky-400', desc: 'Inquiries from IG & YT' },
                    { stage: 'CONTACTED', count: '8', color: 'border-amber-500/30 bg-amber-500/10 text-amber-400', desc: 'Auto WhatsApp response' },
                    { stage: 'QUALIFIED', count: '6', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', desc: 'AI verified intent' },
                    { stage: 'FOLLOW-UP', count: '5', color: 'border-purple-500/30 bg-purple-500/10 text-purple-400', desc: 'Scheduled demo/visit' },
                    { stage: 'CONVERTED', count: '3', color: 'border-gold-400/30 bg-gold-400/10 text-gold-300', desc: 'Closed customer' },
                  ].map((p) => (
                    <div key={p.stage} className={`rounded-xl border p-4 backdrop-blur-md ${p.color}`}>
                      <span className="font-display text-[10px] font-bold uppercase tracking-wider">{p.stage}</span>
                      <span className="mt-2 block font-display text-3xl font-extrabold text-white">{p.count}</span>
                      <p className="mt-1 text-[11px] text-ink-300">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* WhatsApp Integration & AI Lead Automation */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-ink-900 to-ink-950 p-8 backdrop-blur-xl lg:p-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6 space-y-5">
              <span className="rounded-full bg-emerald-500/20 px-3.5 py-1.5 font-display text-xs font-bold text-emerald-400">
                WHATSAPP AUTOMATION ENGINE
              </span>
              <h3 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Turn conversations <br />
                <span className="text-gradient-ember">into paying customers.</span>
              </h3>
              <p className="text-sm text-ink-300 leading-relaxed">
                Connect your social campaigns directly to WhatsApp. Let AI handle instant responses, lead qualification, and follow-up reminders while your team focuses on closing deals.
              </p>

              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <span className="font-display text-xs font-bold text-emerald-400 uppercase tracking-wider">The Complete Funnel:</span>
                <div className="mt-3 flex flex-wrap items-center gap-2 font-display text-xs font-bold text-white">
                  <span>Instagram</span>
                  <ChevronRight className="h-4 w-4 text-emerald-400" />
                  <span>Lead</span>
                  <ChevronRight className="h-4 w-4 text-emerald-400" />
                  <span>WhatsApp</span>
                  <ChevronRight className="h-4 w-4 text-emerald-400" />
                  <span>AI Qualification</span>
                  <ChevronRight className="h-4 w-4 text-emerald-400" />
                  <span className="text-gold-400">Customer</span>
                </div>
              </div>

              <div className="pt-2">
                <Button href="#lead-form" size="lg">
                  Deploy WhatsApp Lead Engine
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* WhatsApp Chat Simulation Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-white/15 bg-ink-950 p-6 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-ink-950 font-bold">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">GroWise WhatsApp Assistant</h4>
                    <p className="text-[11px] text-emerald-400">Instant AI Lead Qualification</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3 font-sans text-xs">
                  {/* Prospect message */}
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-none bg-emerald-600 px-4 py-2.5 text-white max-w-[80%]">
                      "Hi! I saw your Instagram Reel about the business growth package. Can I get details?"
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-none bg-white/10 px-4 py-2.5 text-white/90 max-w-[85%] border border-white/10">
                      "Hello! 👋 GroWise provides a complete AI Growth Audit & Strategy for your business. What industry are you operating in?"
                    </div>
                  </div>

                  {/* Prospect message */}
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-none bg-emerald-600 px-4 py-2.5 text-white max-w-[80%]">
                      "We run a specialty clinic in Mumbai."
                    </div>
                  </div>

                  {/* AI Qualification + Booking Link */}
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-none bg-white/10 px-4 py-2.5 text-white/90 max-w-[85%] border border-white/10">
                      "Great! We've prepared a customized clinic growth audit preview for you. Click here to view your free score: <span className="text-gold-400 underline">growise.app/audit/clinic</span>"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
