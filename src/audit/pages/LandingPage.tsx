import { useAuditModal } from '../context/AuditModalContext'
import { AuditHeader } from '../components/AuditHeader'
import { UsernameInput } from '../components/UsernameInput'
import { DemoSelector } from '../components/DemoSelector'
import { ScoreRing } from '../components/ScoreRing'
import {
  UserCheck,
  FileText,
  Video,
  Activity,
  Calendar,
  Sparkles,
  Target,
  ArrowRight,
} from 'lucide-react'

export function AuditLandingPage() {
  const { openAuditModal } = useAuditModal()

  const handleStartAudit = (username: string) => {
    openAuditModal(username)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-ember-500 selection:text-white">
      <AuditHeader />

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 px-4 lg:px-8 max-w-6xl mx-auto text-center space-y-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ember-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-ember-400 uppercase tracking-widest shadow-lg">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>Growise AI Instagram Audit 1.0</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-tight max-w-4xl mx-auto">
          How strong is your <span className="text-transparent bg-clip-text bg-gradient-to-r from-ember-400 via-amber-300 to-amber-500">Instagram?</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Get your free AI-powered Instagram Growth Audit and discover what's stopping your Instagram from generating more engagement and customers.
        </p>

        {/* Input Box */}
        <div className="pt-4">
          <UsernameInput onSubmit={handleStartAudit} />
        </div>

        {/* Demo Account Quick Selector */}
        <div className="pt-2">
          <DemoSelector onSelectDemo={handleStartAudit} />
        </div>

        {/* Marketing Score Preview Card */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
              <div className="text-left space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ember-400">
                  Sample Audit Preview
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Instagram Growth Score
                </h3>
                <p className="text-xs text-slate-400">
                  Comprehensive 7-category evaluation powered by GroWise engine.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <ScoreRing score={72} size={130} strokeWidth={10} />
              </div>
            </div>

            {/* Category breakdown preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
              {[
                { name: 'Profile', score: 82, color: 'text-emerald-400' },
                { name: 'Content', score: 68, color: 'text-amber-400' },
                { name: 'Reels', score: 61, color: 'text-amber-400' },
                { name: 'Engagement', score: 74, color: 'text-blue-400' },
                { name: 'Consistency', score: 79, color: 'text-blue-400' },
                { name: 'Branding', score: 73, color: 'text-blue-400' },
                { name: 'Conversion', score: 58, color: 'text-rose-400' },
              ].map((item) => (
                <div key={item.name} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    {item.name}
                  </span>
                  <span className={`font-display font-extrabold text-lg ${item.color}`}>
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="py-16 px-4 lg:px-8 max-w-6xl mx-auto border-t border-slate-900 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-ember-400">Simple Process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Enter Your Instagram',
              desc: 'Provide your Instagram handle. No passwords or scraping permissions required.',
            },
            {
              step: '02',
              title: 'AI Evaluates Presence',
              desc: 'Our engine analyzes bio clarity, Reels reach, posting consistency & conversion triggers.',
            },
            {
              step: '03',
              title: 'Get Growth Strategy',
              desc: 'Receive your score out of 100 with a custom 30-day action plan to scale your leads.',
            },
          ].map((card) => (
            <div key={card.step} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative group hover:border-slate-700 transition-all">
              <span className="font-mono font-black text-4xl text-ember-500/30 group-hover:text-ember-500/50 transition-colors">
                {card.step}
              </span>
              <h3 className="font-display font-bold text-xl text-white">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. What We Analyze Cards */}
      <section className="py-16 px-4 lg:px-8 max-w-6xl mx-auto border-t border-slate-900 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-ember-400">
            Comprehensive Analysis
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">What We Analyze</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Profile Optimization', icon: UserCheck, desc: 'Bio clarity, search keywords, CTA quality & link setup.' },
            { title: 'Content Strategy', icon: FileText, desc: 'Educational vs promotional mix & post distribution.' },
            { title: 'Reels Performance', icon: Video, desc: 'Short-form video frequency, views & opening hooks.' },
            { title: 'Engagement Rate', icon: Activity, desc: 'Interaction velocity relative to your follower base.' },
            { title: 'Consistency', icon: Calendar, desc: 'Weekly publishing cadence & scheduling gaps.' },
            { title: 'Brand Identity', icon: Sparkles, desc: 'Visual identity, tone & visual consistency.' },
            { title: 'Conversion Path', icon: Target, desc: 'Direct lead capture triggers & WhatsApp routing.' },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <item.icon className="h-6 w-6 text-ember-400" />
              <h4 className="font-display font-bold text-base text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Growise */}
      <section className="py-16 px-4 lg:px-8 max-w-4xl mx-auto text-center border-t border-slate-900 space-y-6">
        <h2 className="font-display text-3xl font-bold text-white">Why Growise?</h2>
        <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Growise acts as your AI Growth Partner — helping businesses create consistent, high-converting social media content without the headache of managing everything manually.
        </p>

        <div className="pt-4">
          <button
            onClick={() => handleStartAudit('demo_cafe')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-ember-500 to-ember-600 font-display font-bold text-white text-lg shadow-xl shadow-ember-500/25 hover:from-ember-600 hover:to-ember-700 transition-all active:scale-95"
          >
            <span>Analyze My Instagram Now</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  )
}
