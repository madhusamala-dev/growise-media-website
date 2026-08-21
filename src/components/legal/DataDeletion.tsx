import { LegalLayout } from './LegalLayout'

export function DataDeletion() {
  return (
    <LegalLayout title="Data Deletion Instructions" lastUpdated="August 22, 2026">
      <h2>Overview</h2>
      <p>
        GroWise respects your control over your data. This page explains how to request deletion
        of data associated with your GroWise account, including data obtained through social media
        platform integrations.
      </p>

      <h2>What Data Can Be Deleted</h2>
      <p>Upon request, GroWise can delete the following data associated with your account:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Your GroWise account profile (name, email, phone, business details)</li>
        <li>Onboarding and brand kit information</li>
        <li>Content, calendar, and analytics data within your portal</li>
        <li>Social media account connections and associated cached data</li>
        <li>Messages and conversation history</li>
        <li>AI-generated recommendations and reports</li>
      </ul>

      <h2>How to Request Deletion</h2>

      <h3>Option A — Through GroWise (where supported)</h3>
      <p>
        If you have an active GroWise account, you can disconnect your social media accounts and
        request data deletion through:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Go to <strong>Settings</strong> in your GroWise dashboard</li>
        <li>Under <strong>Social Accounts</strong>, disconnect any connected platforms</li>
        <li>Contact us at <a href="mailto:support@growise.media">support@growise.media</a> to
          request full account and data deletion</li>
      </ul>

      <h3>Option B — Contact GroWise Support</h3>
      <p>
        You may also request deletion by emailing us directly at{' '}
        <a href="mailto:support@growise.media">support@growise.media</a> with the subject line
        &quot;Data Deletion Request.&quot;
      </p>

      <h2>What to Include in Your Request</h2>
      <p>To help us identify and delete your data, please include:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>The email address associated with your GroWise account</li>
        <li>Your Instagram username (if you connected an Instagram account)</li>
        <li>Your business name as registered with GroWise</li>
        <li>A clear statement requesting data deletion</li>
      </ul>

      <h2>Identity Verification</h2>
      <p>
        We may need to verify your identity before processing a deletion request to protect against
        unauthorized deletion. We may contact you at the email address on file for verification.
      </p>

      <h2>Processing Timeframe</h2>
      <p>
        We aim to process deletion requests within 30 days of receiving a verified request. You will
        receive a confirmation email once your data has been deleted.
      </p>

      <h2>Revoking Meta / Instagram Access</h2>
      <p>
        Disconnecting your Instagram account through GroWise or revoking access through Instagram
        Settings &gt; Security &gt; Apps and Websites stops future data retrieval. However, this
        does not automatically delete data already stored by GroWise. To request deletion of stored
        data, please use one of the methods described above.
      </p>

      <h2>Data Retention Exceptions</h2>
      <p>
        Some information may need to be retained where legally required, including:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Financial records required for tax or accounting purposes</li>
        <li>Records necessary to comply with legal obligations</li>
        <li>Anti-fraud and security logs</li>
      </ul>
      <p>
        Any retained data will be limited to what is strictly necessary and will not be used for
        marketing or service purposes.
      </p>

      <h2>Contact Us</h2>
      <p>
        For data deletion requests or questions, email us at{' '}
        <a href="mailto:support@growise.media">support@growise.media</a>.
      </p>
    </LegalLayout>
  )
}
