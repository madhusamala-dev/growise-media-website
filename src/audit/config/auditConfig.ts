export const AUDIT_CONFIG = {
  appName: 'Growise AI Instagram Growth Audit',
  version: '1.0.0',
  scoringWeights: {
    profile: 0.20,
    content: 0.20,
    reels: 0.15,
    engagement: 0.15,
    consistency: 0.10,
    branding: 0.10,
    conversion: 0.10,
  },
  scoreThresholds: {
    excellent: { min: 90, label: 'Excellent', color: 'emerald' },
    strong: { min: 80, label: 'Strong', color: 'green' },
    good: { min: 70, label: 'Good', color: 'blue' },
    needsImprovement: { min: 60, label: 'Needs Improvement', color: 'amber' },
    weak: { min: 40, label: 'Weak', color: 'orange' },
    critical: { min: 0, label: 'Critical', color: 'rose' },
  },
  cta: {
    primaryTitle: 'Want Growise to fix these problems for you?',
    primaryCopy:
      'Growise helps businesses create consistent, engaging social media content and turn followers into paying customers without managing everything themselves.',
    talkToGrowiseUrl: 'https://growise.media/talk-to-us',
    getGrowthPlanButtonText: 'Get My Growth Plan',
  },
  demoAccounts: [
    { id: 'demo_cafe', label: 'Demo Cafe (Hyderabad)', category: 'Food & Beverage' },
    { id: 'demo_salon', label: 'Demo Luxe Salon (Bengaluru)', category: 'Beauty & Wellness' },
    { id: 'demo_fitness', label: 'Demo Fitness Studio (Mumbai)', category: 'Health & Fitness' },
    { id: 'demo_realestate', label: 'Demo Real Estate (Delhi)', category: 'Real Estate' },
    { id: 'demo_clothing', label: 'Demo Apparel Store (Chennai)', category: 'E-commerce & Retail' },
  ],
  antiAbuse: {
    maxAuditsPerSessionWindow: 10,
    sessionWindowMs: 3600000, // 1 hour
    processingSimDelayMs: 600, // Staged progress timing
  },
} as const
