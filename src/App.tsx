import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { FreeAudit } from './components/FreeAudit'
import { AuditModelAndOnboarding } from './components/AuditModelAndOnboarding'
import { BrandStrategySection } from './components/BrandStrategySection'
import { ContentEngine } from './components/ContentEngine'
import { AnalyticsAndGrowthLoop } from './components/AnalyticsAndGrowthLoop'
import { LeadsAndWhatsApp } from './components/LeadsAndWhatsApp'
import { AdManagementSection } from './components/AdManagementSection'
import { GrowthEngineFlow } from './components/GrowthEngineFlow'
import { HowItWorks } from './components/HowItWorks'
import { AICopilotSection } from './components/AICopilotSection'
import { ProductArchitectureSection } from './components/ProductArchitectureSection'
import { BeforeAfter } from './components/BeforeAfter'
import { WhyGrowise } from './components/WhyGrowise'
import { Pricing } from './components/Pricing'
import { FAQ } from './components/FAQ'
import { FinalCTA } from './components/FinalCTA'
import { LeadForm } from './components/LeadForm'
import { Footer } from './components/Footer'
import { cn } from './lib/cn'
import { AuthProvider, RequireAuth, RequireGuest, RequireOnboarding } from './portal/lib/auth'
import { PortalProvider } from './portal/lib/store'
import { ToastProvider } from './portal/lib/toast'
import { PortalLayout } from './portal/components/layout/PortalLayout'
import { Login } from './portal/pages/auth/Login'
import { Signup } from './portal/pages/auth/Signup'
import { ForgotPassword } from './portal/pages/auth/ForgotPassword'
import { OAuthCallback } from './portal/pages/auth/OAuthCallback'
import { OAUTH_CALLBACK_PATH } from './portal/lib/authConfig'
import { Onboarding } from './portal/pages/Onboarding'
import { Dashboard } from './portal/pages/Dashboard'
import { ContentLibrary } from './portal/pages/ContentLibrary'
import { ContentDetail } from './portal/pages/ContentDetail'
import { Approvals } from './portal/pages/Approvals'
import { CalendarPage } from './portal/pages/CalendarPage'
import { AnalyticsPage } from './portal/pages/AnalyticsPage'
import { SocialAccounts } from './portal/pages/SocialAccounts'
import { BrandKit } from './portal/pages/BrandKit'
import { Messages } from './portal/pages/Messages'
import { Settings } from './portal/pages/Settings'
import { NotFound } from './portal/pages/NotFound'
import { AuditLandingPage } from './audit/pages/LandingPage'
import { AnalyzingPage } from './audit/pages/AnalyzingPage'
import { AuditReportPage } from './audit/pages/AuditReportPage'
import { LeadPreviewPage } from './audit/pages/LeadPreviewPage'
import { AdminDashboardPage } from './audit/pages/admin/AdminDashboardPage'
import { AdminAuditsPage } from './audit/pages/admin/AdminAuditsPage'
import { AdminLeadsPage } from './audit/pages/admin/AdminLeadsPage'
import { AuditModalProvider } from './audit/context/AuditModalContext'

/* ---------------- Landing page (AI Growth Platform Narrative) ---------------- */

function LandingPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ember-500 focus:px-5 focus:py-2.5 focus:font-display focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        {/* 1. Hero: Your AI-Powered Growth Partner */}
        <Hero />

        {/* 2. Free AI Growth Audit: Before you grow, understand where you stand */}
        <FreeAudit />

        {/* 3. Two-Level Audit Model & Client Onboarding */}
        <AuditModelAndOnboarding />

        {/* 4. Brand Strategy: Turn Data Into a Growth Strategy */}
        <BrandStrategySection />

        {/* 5. Content Engine: AI Strategy, 30-Day Calendar, Creation & Multi-Channel Publishing */}
        <ContentEngine />

        {/* 6. Analytics & Growth Loop: Learn What Works & Monthly AI Growth Review */}
        <AnalyticsAndGrowthLoop />

        {/* 7. Lead Generation & WhatsApp Engine */}
        <LeadsAndWhatsApp />

        {/* 8. Ad Management & Paid Scaling */}
        <AdManagementSection />

        {/* 9. Complete Growth Engine Flow (11-Step Loop Diagram) */}
        <GrowthEngineFlow />

        {/* 10. How It Works 5-Step Process */}
        <HowItWorks />

        {/* 10. AI Growth Copilot Q&A Console */}
        <AICopilotSection />

        {/* 11. Product Architecture (8 Core Pillars) */}
        <ProductArchitectureSection />

        {/* 12. Value Proposition & Before / After */}
        <BeforeAfter />

        {/* 13. Target Customer Positioning */}
        <WhyGrowise />

        {/* 14. Growth Platform Pricing */}
        <Pricing />

        {/* 15. FAQs */}
        <FAQ />

        {/* 16. Final CTA */}
        <FinalCTA />

        {/* 17. Free Audit Lead Form */}
        <LeadForm />
      </main>

      <Footer />
      <BackToTop />
    </>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="#home"
      aria-label="Back to top"
      className={cn(
        'fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ember-500 text-white shadow-[0_14px_36px_-12px_rgba(255,74,17,0.8)] transition-all duration-300 hover:-translate-y-1 hover:bg-ember-600',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </a>
  )
}

/* ------------------------------- App -------------------------------- */

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PortalProvider>
          <AuditModalProvider>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/audit" element={<AuditLandingPage />} />
            <Route path="/audit/analyzing/:auditId" element={<AnalyzingPage />} />
            <Route path="/audit/:auditId" element={<AuditReportPage />} />
            <Route path="/audit/:auditId/preview" element={<LeadPreviewPage />} />

            {/* Admin Audit & Lead Dashboard */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/audits" element={<AdminAuditsPage />} />
            <Route path="/admin/leads" element={<AdminLeadsPage />} />

            {/* Auth */}
            <Route
              path="/login"
              element={
                <RequireGuest>
                  <Login />
                </RequireGuest>
              }
            />
            <Route
              path="/signup"
              element={
                <RequireGuest>
                  <Signup />
                </RequireGuest>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <RequireGuest>
                  <ForgotPassword />
                </RequireGuest>
              }
            />
            <Route path={OAUTH_CALLBACK_PATH} element={<OAuthCallback />} />
            <Route
              path="/onboarding"
              element={
                <RequireOnboarding>
                  <Onboarding />
                </RequireOnboarding>
              }
            />

            {/* Protected client portal */}
            <Route
              element={
                <RequireAuth>
                  <PortalLayout />
                </RequireAuth>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/content" element={<ContentLibrary />} />
              <Route path="/content/:id" element={<ContentDetail />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/social-accounts" element={<SocialAccounts />} />
              <Route path="/brand" element={<BrandKit />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuditModalProvider>
        </PortalProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

/** Scroll to top on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
