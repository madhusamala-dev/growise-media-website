import { LegalLayout } from './LegalLayout'

export function CookiePolicy() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="August 22, 2026">
      <h2>What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help the
        website remember your actions and preferences over a period of time.
      </p>

      <h2>Essential Cookies</h2>
      <p>
        GroWise uses essential cookies that are necessary for the website to function. These cookies
        enable core features such as:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Session management</strong> — Keeping you signed in during your visit</li>
        <li><strong>Authentication</strong> — Verifying your identity when accessing protected pages</li>
        <li><strong>Security</strong> — Protecting against cross-site request forgery</li>
      </ul>
      <p>
        These cookies do not require your consent as they are strictly necessary for the service
        you have requested.
      </p>

      <h2>Authentication / Session Cookies</h2>
      <p>
        GroWise uses session-based authentication through Supabase. A session cookie is set when
        you log in and is used to maintain your authenticated state. This cookie is removed when
        you log out or your session expires.
      </p>

      <h2>LocalStorage</h2>
      <p>
        In addition to cookies, GroWise uses browser localStorage to store:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Your session data (for keeping you logged in)</li>
        <li>Portal preferences (content status, brand kit, notification settings)</li>
        <li>Onboarding progress</li>
      </ul>
      <p>
        LocalStorage data stays on your device and is not sent to our servers. You can clear it
        at any time through your browser settings.
      </p>

      <h2>Analytics Cookies</h2>
      <p>
        GroWise does not currently use Google Analytics, Meta Pixel, or third-party analytics
        tracking cookies. If this changes in the future, this policy will be updated accordingly.
      </p>

      <h2>Third-Party Cookies</h2>
      <p>
        GroWise does not currently embed third-party content that sets advertising or tracking
        cookies. If third-party embeds are added in the future, this policy will be updated.
      </p>

      <h2>How to Manage Cookies</h2>
      <p>You can control and manage cookies through your browser settings:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Chrome</strong> — Settings &gt; Privacy and Security &gt; Cookies</li>
        <li><strong>Firefox</strong> — Settings &gt; Privacy &amp; Security &gt; Cookies</li>
        <li><strong>Safari</strong> — Preferences &gt; Privacy &gt; Cookies</li>
        <li><strong>Edge</strong> — Settings &gt; Privacy &gt; Cookies</li>
      </ul>

      <h2>Consequences of Disabling Cookies</h2>
      <p>
        Disabling essential cookies will prevent GroWise from functioning correctly. You may not
        be able to log in, access your dashboard, or use features that require authentication.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. Any changes will be reflected on this
        page with a revised &quot;Last Updated&quot; date.
      </p>

      <h2>Contact Us</h2>
      <p>
        For questions about our use of cookies, contact us at{' '}
        <a href="mailto:support@growise.media">support@growise.media</a>.
      </p>
    </LegalLayout>
  )
}
