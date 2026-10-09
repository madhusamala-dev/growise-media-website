import { LegalLayout } from './LegalLayout'

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="October 8, 2026">
      <h2>1. Introduction</h2>
      <p>
        GroWise (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is an AI-powered growth and marketing platform for businesses.
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
        visit our website and use our services, including our social media auditing, content analysis, scheduling,
        publishing, and marketing automation features.
      </p>
      <p>
        By accessing or using GroWise, you agree to the collection and use of information in accordance with
        this policy. If you do not agree, please discontinue use of our services.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect information in the following categories:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Information from social media platforms including Meta/Instagram and YouTube/Google (see Sections 3, 4, and 5)</li>
        <li>Information you provide directly (see Section 6)</li>
        <li>Automatically collected technical and usage information (see Section 7)</li>
      </ul>

      <h2>3. Information Collected From Social Media Platforms</h2>
      <p>
        GroWise may retrieve information from social media platforms through their official APIs, subject to
        the permissions granted to our application and the explicit authorization you provide.
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

      <h2>5. YouTube / Google Data</h2>
      <p>
        GroWise provides features that integrate with Google and YouTube via official Google APIs. When a user
        explicitly connects their YouTube channel or Google account to GroWise, GroWise uses Google&apos;s
        standard OAuth 2.0 authorization process.
      </p>
      <p>
        GroWise does not collect, access, or store your Google password. You explicitly authorize GroWise to
        access specific Google and YouTube data through Google&apos;s consent screen, and GroWise only accesses
        the data necessary to provide the user-requested features.
      </p>
      <p>Depending on the authorized scopes and features used, GroWise may access:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>YouTube Channel Information:</strong> Channel name, title, description, channel ID/identifiers, custom URL, and profile/avatar thumbnail image.</li>
        <li><strong>Video and Content Metadata:</strong> Video titles, descriptions, tags, category IDs, thumbnail URLs, privacy/visibility status (public, unlisted, private), and publishing status.</li>
        <li><strong>User-Selected Videos &amp; Shorts:</strong> Video and Short files, captions, thumbnails, and metadata explicitly created, selected, or scheduled by the user for upload or publishing to YouTube.</li>
        <li><strong>Published Content Management:</strong> Information about videos published through GroWise, including video IDs, permalinks, and publication timestamps, required to manage and update video metadata or delete content where requested.</li>
        <li><strong>YouTube Analytics &amp; Performance Metrics:</strong> Aggregate channel-level and video-level performance metrics retrieved via the YouTube Analytics API, such as views, estimated watch time, likes, comments, shares, subscriber growth trends, and engagement rates.</li>
        <li><strong>Scheduling &amp; Automation State:</strong> Scheduled publication timestamps and pipeline status necessary to execute scheduled YouTube video uploads and Shorts publishing at your requested times.</li>
      </ul>

      <h2>6. Information Provided Directly by Users</h2>
      <p>When you create an account, onboard, or use our services, we may collect:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Name, email address, phone number, and account credentials</li>
        <li>Business name, industry, website, and physical location</li>
        <li>Onboarding details (target audience demographics, brand guidelines, color palettes, tone, content preferences, and topics to avoid)</li>
        <li>Communications, feedback, and support inquiries sent to our team</li>
      </ul>

      <h2>7. Automatically Collected Information</h2>
      <p>When you access GroWise, we may automatically collect:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Device information, browser type, and operating system</li>
        <li>IP address and approximate geographic location</li>
        <li>Pages visited, navigation paths, and interaction timestamps</li>
        <li>Session and authentication tokens for secure portal access</li>
      </ul>

      <h2>8. How We Use Information</h2>
      <p>
        We use collected information strictly to provide, maintain, and improve user-facing features requested
        by our users. Specifically, we use your data to:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Authenticate users and manage secure account sessions</li>
        <li>Connect authorized YouTube channels and social media accounts upon your explicit request</li>
        <li>Retrieve YouTube channel profile information and verify channel connection status</li>
        <li>Upload, schedule, and publish videos and YouTube Shorts directly to your authorized YouTube channel</li>
        <li>Update and manage video metadata (such as titles, descriptions, tags, and privacy settings) for content you publish</li>
        <li>Delete or unpublish YouTube videos upon your explicit instruction where supported</li>
        <li>Retrieve YouTube Analytics and performance metrics through the YouTube Analytics API to display actionable growth insights and charts inside the GroWise dashboard</li>
        <li>Generate AI-assisted content strategies, video hooks, and brand roadmaps tailored to your business inputs</li>
        <li>Facilitate client approvals, feedback loops, and content calendar management</li>
        <li>Provide customer support and ensure technical reliability and platform policy compliance</li>
      </ul>

      <h2>9. AI and Automated Analysis</h2>
      <p>
        GroWise uses artificial intelligence to generate marketing strategies, content concepts, hook suggestions,
        and growth recommendations based on your onboarding preferences and business guidelines.
      </p>
      <p>
        <strong>AI/ML Model Training Disclosure:</strong> Google and YouTube user data accessed through Google
        APIs is <strong>NOT</strong> used to train, retrain, fine-tune, or improve generalized artificial
        intelligence or machine-learning models. Any AI-assisted drafting is performed ephemerally for the sole
        benefit of the authenticated user to deliver requested features.
      </p>

      <h2>10. How We Share Information</h2>
      <p>We do not sell your personal data or social media data. Specifically:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>No Sale of Google Data:</strong> GroWise does not sell Google or YouTube user data to any third party.</li>
        <li><strong>No Advertising Use:</strong> GroWise does not sell or provide Google/YouTube user data to advertisers or ad networks, nor do we use Google user data for targeted advertising.</li>
        <li><strong>No Data Brokers:</strong> GroWise does not transfer Google user data to data brokers or information resellers.</li>
        <li><strong>Strict Service Provider Processing:</strong> Third-party service providers (such as hosting and database infrastructure) may only process data when necessary to provide the requested GroWise functionality, under strict confidentiality and security obligations.</li>
        <li><strong>Legal Obligations:</strong> We may disclose information only when strictly required by applicable law, regulation, or valid legal process.</li>
      </ul>

      <h2>11. Google API Services Limited Use Compliance</h2>
      <p>
        GroWise&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember-400 hover:text-ember-300 underline"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>
      <p>In particular:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>We only use Google/YouTube data to provide or improve user-facing features that are prominent in GroWise&apos;s user interface.</li>
        <li>We do not transfer Google user data to third parties unless necessary to provide or improve these user-facing features, comply with applicable laws, or as part of a merger or acquisition with explicit user consent.</li>
        <li>We do not use or transfer Google user data for serving advertisements, including personalized, re-targeted, or interest-based advertising.</li>
        <li>We do not allow humans to read Google user data unless we have obtained your affirmative agreement for specific messages, it is necessary for security purposes (such as investigating a bug or abuse), to comply with applicable law, or when the data is aggregated and anonymized for internal operations.</li>
        <li>Google user data is not used to train generalized AI/ML models.</li>
      </ul>

      <h2>12. Third-Party Services</h2>
      <p>GroWise uses the following third-party infrastructure and platform services to deliver our platform:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Supabase</strong> — Cloud database, storage, and authentication infrastructure.
        </li>
        <li>
          <strong>Vercel</strong> — Frontend application hosting, edge delivery, and deployment.
        </li>
        <li>
          <strong>Google APIs &amp; YouTube API Services</strong> — OAuth 2.0 authorization, YouTube video/Shorts upload, metadata management, and YouTube Analytics retrieval. By using YouTube integration features in GroWise, users are also subject to the{' '}
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember-400 hover:text-ember-300 underline"
          >
            YouTube Terms of Service
          </a>{' '}
          and the{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember-400 hover:text-ember-300 underline"
          >
            Google Privacy Policy
          </a>.
        </li>
        <li>
          <strong>Meta / Facebook / Instagram APIs</strong> — Instagram Professional account insights, auditing, and publishing integrations.
        </li>
        <li>
          <strong>AI/LLM Providers</strong> — Ephemeral processing of marketing prompts and strategy frameworks (where applicable) without persisting or training on user data.
        </li>
      </ul>

      <h2>13. Data Storage and Security</h2>
      <p>
        We implement rigorous technical, administrative, and physical security measures to safeguard user information
        and OAuth credentials:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>OAuth access tokens and refresh tokens are encrypted at rest and transmitted strictly over encrypted HTTPS/TLS channels.</li>
        <li>Client secrets and backend credentials are stored securely in server-side environment variables and are never exposed to browser-side code or public repositories.</li>
        <li>Access to production databases is restricted to authorized personnel with multi-factor authentication on a strict need-to-know basis.</li>
      </ul>

      <h2>14. Data Retention</h2>
      <p>
        We retain personal and social platform information only for as long as your GroWise account is active
        or as needed to provide the requested services:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Connected Account Data &amp; Tokens:</strong> OAuth tokens and channel metadata for YouTube and other platforms are retained as long as the account remains connected in GroWise to facilitate scheduled publishing and analytics syncing.</li>
        <li><strong>Disconnecting Accounts:</strong> When you disconnect a social platform (e.g., YouTube) from GroWise, stored OAuth tokens are immediately deleted or invalidated, preventing any further API calls. Cached platform metrics are removed from active synchronization.</li>
        <li><strong>Account Deletion:</strong> Upon deletion of your GroWise account, all associated account data, brand assets, social tokens, and analytics records are permanently purged from our active databases within 30 days.</li>
      </ul>

      <h2>15. User Rights and Choices</h2>
      <p>You have full control over your data. You may:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Review and update your profile and business details in your dashboard Settings</li>
        <li>Disconnect any connected social media platform at any time (see Section 16 &amp; 17)</li>
        <li>Revoke GroWise&apos;s authorization directly from Google or Meta account security portals</li>
        <li>Request access to or export of the data we hold about you</li>
        <li>Request complete deletion of your account and stored data (see Section 18)</li>
      </ul>

      <h2>16. YouTube / Google Data Disconnect &amp; Revocation</h2>
      <p>
        You can disconnect your YouTube channel and revoke GroWise&apos;s access at any time through either of the following methods:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Through GroWise:</strong> Navigate to <strong>Settings &gt; Social Accounts</strong> in your GroWise dashboard, find YouTube, and click <strong>Disconnect</strong>. This immediately removes your stored authorization tokens and stops all future API requests.
        </li>
        <li>
          <strong>Through Google Account Security:</strong> You can revoke GroWise&apos;s access directly via Google&apos;s permissions page at{' '}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember-400 hover:text-ember-300 underline"
          >
            https://myaccount.google.com/permissions
          </a>. Revoking access in Google immediately terminates GroWise&apos;s ability to make any authorized calls on your behalf.
        </li>
      </ul>

      <h2>17. Instagram / Meta Data Deletion</h2>
      <p>
        You can disconnect or revoke GroWise&apos;s access to your Instagram account at any time through:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Instagram Settings &gt; Security &gt; Apps and Websites</li>
        <li>GroWise dashboard Settings &gt; Social Accounts</li>
      </ul>
      <p>
        Revoking access stops future data retrieval. To request deletion of stored historical data, see Section 18.
      </p>

      <h2>18. Account / Data Deletion Requests</h2>
      <p>
        You may request complete deletion of your GroWise account and all associated YouTube, Instagram, and profile data by contacting us at{' '}
        <a href="mailto:support@growise.media" className="text-ember-400 hover:text-ember-300 underline">support@growise.media</a> or by visiting our{' '}
        <a href="/data-deletion" className="text-ember-400 hover:text-ember-300 underline">Data Deletion Instructions</a> page.
      </p>
      <p>
        We process verified deletion requests within 30 days. Some limited information may be retained where strictly required by law (e.g., accounting or compliance records).
      </p>

      <h2>19. Cookies and Similar Technologies</h2>
      <p>
        GroWise uses essential cookies for authentication and session management. For details, see our{' '}
        <a href="/cookie-policy" className="text-ember-400 hover:text-ember-300 underline">Cookie Policy</a>.
      </p>

      <h2>20. Children&apos;s Privacy</h2>
      <p>
        GroWise is not intended for children under 13. We do not knowingly collect information from
        children. If you believe a child has provided us with personal information, please contact us
        and we will delete it promptly.
      </p>

      <h2>21. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in secure cloud infrastructure located in countries other than your country of residence. By using GroWise, you consent to such transfers under appropriate data protection safeguards.
      </p>

      <h2>22. Changes to This Privacy Policy</h2>
      <p>
        We may update this policy periodically to reflect changes in our practices or platform legal requirements. We will post the updated policy on this page with a revised &quot;Last Updated&quot; date.
      </p>

      <h2>23. Contact Information</h2>
      <p>
        For questions regarding this Privacy Policy, Google API compliance, or to exercise your privacy rights, please contact our data protection team at:
      </p>
      <p>
        <a href="mailto:support@growise.media" className="text-ember-400 hover:text-ember-300 underline">support@growise.media</a>
      </p>
    </LegalLayout>
  )
}

