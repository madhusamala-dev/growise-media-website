/* ------------------------------------------------------------------ */
/*  Site-wide data — brand identity, nav, CTA, contact                 */
/*                                                                    */
/*  ⚠️  Placeholder content — replace with real copy before launch.   */
/* ------------------------------------------------------------------ */

export const brand = {
  name: 'GroWise',
  positioning: 'AI-Powered Growth Platform',
  tagline: 'You run the business. We run your growth.',
  taglineAlt: 'One agency. One goal. Your growth.',
}

export const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
  { href: '#lead-form', label: 'Contact' },
]

export const cta = {
  primary: 'Get Free Audit',
  secondary: 'See How It Works',
  badge: 'No credit card required — results in 60 seconds',
  finalPrimary: 'Start My Free Audit',
  finalSecondary: 'Chat on WhatsApp',
  form: 'Send Enquiry',
}

export const contact = {
  email: 'hello@growise.com',
  location: 'India',
  whatsappNumber: '',
  whatsappDisplay: '',
}

/** Build a WhatsApp deep-link URL. Returns `#` when no number is configured. */
export function whatsappHref(message: string): string {
  if (!contact.whatsappNumber) return '#'
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${contact.whatsappNumber}?text=${encoded}`
}
