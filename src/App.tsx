import { Suspense, lazy, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ArrowUp, Loader2 } from 'lucide-react'
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
import { OAUTH_CALLBACK_PATH } from './portal/lib/authConfig'
import { AuditModalProvider } from './audit/context/AuditModalContext'
import { PrivacyPolicy } from './components/legal/PrivacyPolicy'
import { TermsOfService } from './components/legal/TermsOfService'
import { DataDeletion } from './components/legal/DataDeletion'
import { CookiePolicy } from './components/legal/CookiePolicy'
import { ContactPage } from './components/legal/ContactPage'

/* ---------------- Lazy-loaded portal pages ---------------- */
const PortalLayout = lazy(() => import('./portal/components/layout/PortalLayout').then(m => ({ default: m.PortalLayout })))
const Login = lazy(() => import('./portal/pages/auth/Login').then(m => ({ default: m.Login })))
const Signup = lazy(() => import('./portal/pages/auth/Signup').then(m => ({ default: m.Signup })))
const ForgotPassword = lazy(() => import('./portal/pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const OAuthCallback = lazy(() => import('./portal/pages/auth/OAuthCallback').then(m => ({ default: m.OAuthCallback })))
const Onboarding = lazy(() => import('./portal/pages/Onboarding').then(m => ({ default: m.Onboarding })))
const Dashboard = lazy(() => import('./portal/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const ContentLibrary = lazy(() => import('./portal/pages/ContentLibrary').then(m => ({ default: m.ContentLibrary })))
const ContentDetail = lazy(() => import('./portal/pages/ContentDetail').then(m => ({ default: m.ContentDetail })))
const Approvals = lazy(() => import('./portal/pages/Approvals').then(m => ({ default: m.Approvals })))
const CalendarPage = lazy(() => import('./portal/pages/CalendarPage').then(m => ({ default: m.CalendarPage })))
const AnalyticsPage = lazy(() => import('./portal/pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const SocialAccounts = lazy(() => import('./portal/pages/SocialAccounts').then(m => ({ default: m.SocialAccounts })))
const BrandKit = lazy(() => import('./portal/pages/BrandKit').then(m => ({ default: m.BrandKit })))
const Messages = lazy(() => import('./portal/pages/Messages').then(m => ({ default: m.Messages })))
const Settings = lazy(() => import('./portal/pages/Settings').then(m => ({ default: m.Settings })))
const NotFound = lazy(() => import('./portal/pages/NotFound').then(m => ({ default: m.NotFound })))

/* ---------------- Lazy-loaded audit pages ---------------- */
const AuditLandingPage = lazy(() => import('./audit/pages/LandingPage').then(m => ({ default: m.AuditLandingPage })))
const AnalyzingPage = lazy(() => import('./audit/pages/AnalyzingPage').then(m => ({ default: m.AnalyzingPage })))
const AuditReportPage = lazy(() => import('./audit/pages/AuditReportPage').then(m => ({ default: m.AuditReportPage })))
const LeadPreviewPage = lazy(() => import('./audit/pages/LeadPreviewPage').then(m => ({ default: m.LeadPreviewPage })))
const AdminDashboardPage = lazy(() => import('./audit/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const AdminAuditsPage = lazy(() => import('./audit/pages/admin/AdminAuditsPage').then(m => ({ default: m.AdminAuditsPage })))
const AdminLeadsPage = lazy(() => import('./audit/pages/admin/AdminLeadsPage').then(m => ({ default: m.AdminLeadsPage })))

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

/* ---------------- Loading fallback ---------------- */
function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-ember-500" />
    </div>
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
            <Suspense fallback={<PageLoader />}>
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

            {/* Legal / Public pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/data-deletion" element={<DataDeletion />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
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
