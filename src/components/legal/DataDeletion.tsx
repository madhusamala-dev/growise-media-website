import { LegalLayout } from './LegalLayout'

export function DataDeletion() {
  return (
    <LegalLayout title="Data Deletion Instructions" lastUpdated="October 8, 2026">
      <h2>Overview</h2>
      <p>
        GroWise respects your control over your data. This page explains how to disconnect connected social
        platforms, revoke OAuth access, and request complete deletion of data associated with your GroWise
        account, including data obtained through YouTube / Google APIs and Meta / Instagram platform integrations.
      </p>

      <h2>What Data Can Be Deleted</h2>
      <p>Upon request, GroWise can delete the following data associated with your account:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Your GroWise account profile (name, email, phone, business details)</li>
        <li>Onboarding details and brand kit information</li>
        <li>Content library items, calendar schedules, and performance analytics stored in your portal</li>
        <li>Connected social media tokens and cached channel/account metadata (YouTube, Instagram, LinkedIn, Facebook)</li>
        <li>Messages, revisions, and conversation history</li>
        <li>AI-generated recommendations, scripts, and content drafts</li>
      </ul>

      <h2>How to Disconnect &amp; Revoke Access</h2>

      <h3>1. Disconnecting YouTube / Google in GroWise</h3>
      <p>
        You can disconnect your YouTube channel at any time:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Log in to your GroWise portal.</li>
        <li>Navigate to <strong>Settings &gt; Social Accounts</strong>.</li>
        <li>Locate <strong>YouTube</strong> and click <strong>Disconnect</strong>.</li>
        <li>Confirm the action in the prompt. This immediately invalidates and deletes your stored OAuth tokens and halts all future API calls.</li>
      </ul>

      <h3>2. Revoking GroWise Access via Google Security</h3>
      <p>
        You can also revoke GroWise&apos;s authorization directly from your Google Account at any time:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Visit Google&apos;s Third-Party Apps &amp; Services permissions page at{' '}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember-400 hover:text-ember-300 underline"
          >
            https://myaccount.google.com/permissions
          </a>.
        </li>
        <li>Find <strong>GroWise</strong> or <strong>growise-media</strong> in your authorized apps list.</li>
        <li>Click <strong>Remove Access</strong> or <strong>Delete all connections</strong>.</li>
      </ul>

      <h3>3. Revoking Meta / Instagram Access</h3>
      <p>
        You can disconnect your Instagram account through GroWise under <strong>Settings &gt; Social Accounts</strong> or revoke access through Instagram Settings &gt; Security &gt; Apps and Websites.
      </p>

      <h2>How to Request Full Account &amp; Data Deletion</h2>

      <h3>Option A — Through GroWise Portal</h3>
      <p>
        If you have an active GroWise account:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Go to <strong>Settings</strong> in your GroWise dashboard.</li>
        <li>Under <strong>Social Accounts</strong>, disconnect all connected platforms.</li>
        <li>Contact us at <a href="mailto:support@growise.media" className="text-ember-400 hover:text-ember-300 underline">support@growise.media</a> to request complete account and data deletion.</li>
      </ul>

      <h3>Option B — Contact GroWise Support</h3>
      <p>
        You may request data deletion by emailing us directly at{' '}
        <a href="mailto:support@growise.media" className="text-ember-400 hover:text-ember-300 underline">support@growise.media</a> with the subject line
        &quot;Data Deletion Request.&quot;
      </p>

      <h2>What to Include in Your Request</h2>
      <p>To help us identify and delete your data quickly, please include:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>The email address associated with your GroWise account</li>
        <li>Your connected YouTube channel name or Instagram username (if applicable)</li>
        <li>Your registered business name in GroWise</li>
        <li>A clear statement requesting deletion of your account and all stored platform data</li>
      </ul>

      <h2>Identity Verification &amp; Processing Timeframe</h2>
      <p>
        We may verify your identity before processing deletion to prevent unauthorized actions. Verified deletion requests are completed within 30 days, and you will receive a confirmation email once your data has been permanently purged from our active databases.
      </p>

      <h2>Data Retention Exceptions</h2>
      <p>
        Some limited information may be retained where strictly required by law, including:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Financial and transaction records for accounting and tax compliance</li>
        <li>Records necessary to comply with applicable statutory obligations</li>
        <li>System security and fraud-prevention logs</li>
      </ul>
      <p>
        Any retained data is strictly isolated and never used for marketing or service purposes.
      </p>

      <h2>Contact Us</h2>
      <p>
        For data deletion requests or privacy inquiries, email our team at{' '}
        <a href="mailto:support@growise.media" className="text-ember-400 hover:text-ember-300 underline">support@growise.media</a>.
      </p>
    </LegalLayout>
  )
}

