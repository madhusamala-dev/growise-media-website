import { LegalLayout } from './LegalLayout'

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="August 22, 2026">
      <h2>1. Introduction</h2>
      <p>
        GroWise (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is an AI-powered growth and marketing platform for businesses.
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
        visit our website and use our services, including our social media auditing, content analysis, and
        marketing automation features.
      </p>
      <p>
        By accessing or using GroWise, you agree to the collection and use of information in accordance with
        this policy. If you do not agree, please discontinue use of our services.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect information in the following categories:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Information from social media platforms (see Section 3 and 4)</li>
        <li>Information you provide directly (see Section 5)</li>
        <li>Automatically collected information (see Section 6)</li>
      </ul>

      <h2>3. Information Collected From Social Media Platforms</h2>
      <p>
        GroWise may retrieve information from social media platforms through their official APIs, subject to
        the permissions granted to our application and the authorization you provide.
      </p>

      <h2>4. Instagram / Meta Data</h2>
      <p>
        GroWise integrates with Meta&apos;s Instagram Platform. Our data access depends on the phase of interaction:
      </p>

      <h3>Phase 1 — Public / Basic Information (Audit)</h3>
      <p>
        When a visitor enters an Instagram username for an audit, GroWise may retrieve permitted public and
        basic information about eligible Instagram Professional accounts using Meta&apos;s Business Discovery
        capabilities. This may include:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Instagram username, name, and biography</li>
        <li>Website link</li>
        <li>Profile picture</li>
        <li>Follower and following counts</li>
        <li>Media count</li>
        <li>Public media information (content type, posting frequency)</li>
        <li>Public engagement metrics where permitted by Meta (likes, comments, views)</li>
      </ul>
      <p>
        This information is obtained from publicly available data through Meta&apos;s APIs and is used solely
        to generate the audit report.
      </p>

      <h3>Phase 2 — Connected Account Data (Onboarded Clients)</h3>
      <p>
        When a business becomes an onboarded GroWise client and explicitly connects their Instagram
        Professional account, GroWise may access additional account and media insights permitted by Meta,
        subject to:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Your explicit authorization</li>
        <li>Meta&apos;s API permissions and access levels</li>
        <li>Applicable Meta policies and platform terms</li>
      </ul>
      <p>
        GroWise does not access private Instagram information, arbitrary personal Instagram accounts, or
        information beyond what Meta&apos;s APIs provide.
      </p>

      <h2>5. Information Provided Directly by Users</h2>
      <p>When you create an account or use our services, we may collect:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Name, email address, and phone number</li>
        <li>Business name, industry, and location</li>
        <li>Onboarding details (target audience, brand preferences, content preferences)</li>
        <li>Communications you send to us (support requests, feedback)</li>
      </ul>

      <h2>6. Automatically Collected Information</h2>
      <p>When you access GroWise, we may automatically collect:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Device and browser information</li>
        <li>IP address and approximate location</li>
        <li>Pages visited and interaction data</li>
        <li>Session information for authentication</li>
      </ul>

      <h2>7. How We Use Information</h2>
      <p>We use collected information to:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Provide, maintain, and improve GroWise services</li>
        <li>Generate audit reports, growth insights, and marketing recommendations</li>
        <li>Create content strategies and marketing plans</li>
        <li>Manage social media scheduling and publishing</li>
        <li>Process leads and manage WhatsApp integrations</li>
        <li>Communicate with you about your account and our services</li>
        <li>Ensure compliance with platform policies</li>
      </ul>

      <h2>8. AI and Automated Analysis</h2>
      <p>
        GroWise uses artificial intelligence and automated analysis to process collected data and generate
        marketing recommendations, content strategies, and growth insights. These AI-generated outputs are
        informational and should not be treated as guaranteed business outcomes.
      </p>

      <h2>9. How We Share Information</h2>
      <p>We do not sell your personal information. We may share information with:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Service providers who assist in operating GroWise (hosting, analytics)</li>
        <li>Social media platforms as required by their APIs and your authorization</li>
        <li>AI/LLM providers where applicable for content generation and analysis</li>
        <li>When required by law or to protect our rights</li>
      </ul>

      <h2>10. Third-Party Services</h2>
      <p>GroWise uses the following third-party services:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Supabase</strong> — Database and authentication</li>
        <li><strong>Vercel</strong> — Website hosting and deployment</li>
        <li><strong>Meta / Facebook / Instagram APIs</strong> — Social media data and integration</li>
        <li><strong>AI/LLM providers</strong> — Content generation and analysis (where applicable)</li>
      </ul>
      <p>
        Each third-party service has its own privacy policy. We encourage you to review their policies.
      </p>

      <h2>11. Data Storage and Security</h2>
      <p>
        We implement industry-standard security measures to protect your data. However, no method of
        electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2>12. Data Retention</h2>
      <p>
        We retain your information for as long as your account is active or as needed to provide services.
        We may retain certain information as required by law or for legitimate business purposes.
      </p>

      <h2>13. User Rights and Choices</h2>
      <p>You have the right to:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Access the information we hold about you</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your data (see Section 15)</li>
        <li>Disconnect or revoke access to connected social accounts</li>
        <li>Opt out of non-essential communications</li>
      </ul>

      <h2>14. Instagram / Meta Data Deletion</h2>
      <p>
        You can revoke GroWise&apos;s access to your Instagram account at any time through:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Instagram Settings &gt; Security &gt; Apps and Websites</li>
        <li>GroWise dashboard Settings &gt; Social Accounts</li>
      </ul>
      <p>
        Revoking access stops future data retrieval but does not automatically delete data already stored
        by GroWise. To request deletion of stored data, see Section 15.
      </p>

      <h2>15. Account / Data Deletion Requests</h2>
      <p>
        You may request deletion of your GroWise account and associated data by contacting us at{' '}
        <a href="mailto:support@growise.media">support@growise.media</a>. We will process deletion
        requests within a reasonable timeframe and may need to verify your identity before processing.
      </p>
      <p>
        Some information may need to be retained where legally required or for legitimate business purposes
        (e.g., financial records, compliance obligations).
      </p>

      <h2>16. Cookies and Similar Technologies</h2>
      <p>
        GroWise uses essential cookies for authentication and session management. For details, see our{' '}
        <a href="/cookie-policy">Cookie Policy</a>.
      </p>

      <h2>17. Children&apos;s Privacy</h2>
      <p>
        GroWise is not intended for children under 13. We do not knowingly collect information from
        children. If you believe a child has provided us with personal information, please contact us
        and we will delete it.
      </p>

      <h2>18. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your country of
        residence. By using GroWise, you consent to such transfers.
      </p>

      <h2>19. Changes to This Privacy Policy</h2>
      <p>
        We may update this policy from time to time. We will notify you of material changes by posting
        the updated policy on this page with a revised &quot;Last Updated&quot; date.
      </p>

      <h2>20. Contact Information</h2>
      <p>
        For questions about this Privacy Policy or to submit a data request, contact us at:
      </p>
      <p>
        <a href="mailto:support@growise.media">support@growise.media</a>
      </p>
    </LegalLayout>
  )
}
