import type {
  AIProvider,
  CaptionAiAnalysis,
  CreativeAiAnalysis,
  ProfileAiAnalysis,
} from './AIProvider'
import type {
  AuditFinding,
  AuditRecommendation,
  AuditScore,
  InstagramMedia,
  InstagramProfile,
  WeeklyGrowthPlanItem,
} from '../types'

export class MockAIProvider implements AIProvider {
  async analyzeProfile(profile: InstagramProfile): Promise<ProfileAiAnalysis> {
    const hasWebsite = Boolean(profile.website_url && profile.website_url.length > 5)
    const hasLocation = profile.bio.toLowerCase().includes('hyderabad') ||
      profile.bio.toLowerCase().includes('bengaluru') ||
      profile.bio.toLowerCase().includes('mumbai') ||
      profile.bio.toLowerCase().includes('delhi') ||
      profile.bio.toLowerCase().includes('chennai')

    return {
      clarityScore: profile.bio.length > 30 ? 78 : 52,
      customerBenefitScore: profile.bio.toLowerCase().includes('fresh') || profile.bio.toLowerCase().includes('transform') ? 80 : 55,
      ctaScore: profile.bio.includes('👇') || profile.bio.includes('Book') || profile.bio.includes('DM') ? 85 : 45,
      keywordScore: profile.category ? 75 : 60,
      strengths: [
        'Clear display name specifying main business offerings.',
        hasLocation ? 'Explicit geographic location mentioned for local search relevance.' : 'Active business profile status.',
        profile.category ? `Proper business category categorization (${profile.category}).` : 'Recognizable profile image.',
      ],
      weaknesses: [
        hasWebsite ? 'Website URL is generic without a dedicated conversion landing page.' : 'Missing a direct clickable website link in profile bio.',
        'Bio lacks a compelling value proposition that states direct customer benefit.',
        'Primary call-to-action is not incentivized with a free resource or WhatsApp direct link.',
      ],
      recommendations: [
        'Add a structured bio formula: [Who You Help] + [Core Outcome] + [Incentivized CTA with WhatsApp link].',
        'Use searchable industry keywords in the Name Field to rank higher in Instagram Search.',
        'Include a highlighted Story section dedicated to Customer Reviews and FAQ.',
      ],
    }
  }

  async analyzeCaption(caption: string): Promise<CaptionAiAnalysis> {
    const wordCount = caption.split(/\s+/).length
    const hasHook = caption.includes('?') || caption.includes('!') || caption.includes('How') || caption.includes('Stop')
    const hasCta = caption.toLowerCase().includes('dm') || caption.toLowerCase().includes('save') || caption.toLowerCase().includes('link')

    return {
      hookScore: hasHook ? 82 : 55,
      clarityScore: wordCount > 10 ? 78 : 50,
      storytellingScore: wordCount > 25 ? 80 : 45,
      ctaScore: hasCta ? 85 : 40,
      readabilityScore: 76,
      contentType: caption.toLowerCase().includes('how') ? 'EDUCATIONAL' : 'PROMOTIONAL',
      promotionalIntensity: caption.toLowerCase().includes('off') || caption.toLowerCase().includes('buy') ? 85 : 40,
      strengths: [
        hasHook ? 'Opening hook effectively creates curiosity or addresses a specific pain point.' : 'Clean formatting with emojis.',
        hasCta ? 'Clear explicit CTA instructing viewers on next steps.' : 'Relevant messaging.',
      ],
      improvements: [
        !hasHook ? 'Start captions with bold pattern-interrupt questions or strong statement hooks.' : 'Break long text blocks into 1-2 line readable chunks.',
        !hasCta ? 'Always end captions with a single targeted action (e.g., "Comment GUIDE for link").' : 'Incorporate customer storytelling elements.',
      ],
    }
  }

  async analyzeCreative(media: InstagramMedia): Promise<CreativeAiAnalysis> {
    const isReel = media.media_type === 'REEL'
    return {
      visualScore: isReel ? 84 : 72,
      brandingScore: 78,
      hookScore: isReel ? 88 : 65,
      textReadabilityScore: 80,
      ctaScore: 70,
      humanPresence: true,
      strengths: [
        isReel ? 'Dynamic video movement grabs attention in the first 3 seconds.' : 'High resolution visual presentation.',
        'Good visual contrast between background and subject matter.',
      ],
      improvements: [
        'Add bold on-screen text captions for viewers watching on mute.',
        'Include a consistent brand color frame or logo watermark on video overlays.',
      ],
    }
  }

  async generateFindings(
    profile: InstagramProfile,
    media: InstagramMedia[],
    scores: AuditScore
  ): Promise<AuditFinding[]> {
    const findings: AuditFinding[] = []

    // 1. Profile Finding
    if (scores.profile_score >= 75) {
      findings.push({
        audit_id: profile.audit_id || '',
        category: 'PROFILE',
        severity: 'POSITIVE',
        title: 'Optimized Business Bio & Branding',
        description: 'Your profile bio clearly communicates your business category and display name effectively.',
        evidence: `Category: "${profile.category}" with ${profile.followers_count.toLocaleString()} followers.`,
        recommendation: 'Maintain your core branding while adding a direct WhatsApp lead routing link.',
        priority: 5,
      })
    } else {
      findings.push({
        audit_id: profile.audit_id || '',
        category: 'PROFILE',
        severity: 'HIGH',
        title: 'Unclear Profile Bio & Weak Call-To-Action',
        description: 'Your bio lacks an incentivized reason for visitors to convert or contact your business immediately.',
        evidence: 'Bio does not contain a lead magnet or direct lead capture trigger.',
        recommendation: 'Rewrite bio using the formula: [Who You Help] + [Core Outcome] + [Click Link Below].',
        priority: 1,
      })
    }

    // 2. Content & Reels Finding
    const reelCount = media.filter((m) => m.media_type === 'REEL').length
    const reelPercentage = media.length > 0 ? Math.round((reelCount / media.length) * 100) : 0

    if (reelPercentage < 30) {
      findings.push({
        audit_id: profile.audit_id || '',
        category: 'REELS',
        severity: 'CRITICAL',
        title: 'Low Reel Output Restricting Organic Reach',
        description: `Only ${reelPercentage}% of your recent content consists of Reels. Instagram algorithm heavily favors short-form video for non-follower discovery.`,
        evidence: `${reelCount} Reels out of ${media.length} recent posts analyzed.`,
        recommendation: 'Publish 3 short-form Reels per week focused on answering top customer questions.',
        priority: 1,
      })
    } else {
      findings.push({
        audit_id: profile.audit_id || '',
        category: 'REELS',
        severity: 'POSITIVE',
        title: 'Strong Short-Form Video Strategy',
        description: `Reels account for ${reelPercentage}% of your recent content, driving consistent algorithm distribution.`,
        evidence: `Average Reel views reach high engagement reach.`,
        recommendation: 'Add pinned comment CTAs to all Reels to capture inbound DM leads.',
        priority: 4,
      })
    }

    // 3. Consistency Finding
    if (scores.consistency_score < 70) {
      findings.push({
        audit_id: profile.audit_id || '',
        category: 'CONSISTENCY',
        severity: 'HIGH',
        title: 'Irregular Posting Cadence & Scheduling Gaps',
        description: 'Gaps of over 7+ days between post releases harm algorithmic reach and audience recall.',
        evidence: 'Multiple gaps detected between recent post publishing dates.',
        recommendation: 'Batch content creation monthly and schedule automated 4x/week publishing.',
        priority: 2,
      })
    } else {
      findings.push({
        audit_id: profile.audit_id || '',
        category: 'CONSISTENCY',
        severity: 'POSITIVE',
        title: 'Consistent Weekly Publishing Schedule',
        description: 'Your account maintains regular activity that signals high reliability to the Instagram algorithm.',
        evidence: 'Consistent activity detected over the past 30 days.',
        recommendation: 'Maintain frequency while optimizing posting time based on audience peak hours.',
        priority: 5,
      })
    }

    // 4. Conversion Finding
    if (scores.conversion_score < 65) {
      findings.push({
        audit_id: profile.audit_id || '',
        category: 'CONVERSION',
        severity: 'HIGH',
        title: 'Leads Slipping Away Without Automated Routing',
        description: 'Inquiries in comments and DMs lack automated instant response triggers or WhatsApp integration.',
        evidence: 'Estimated 30-40% of prospective customer inquiries go cold due to delayed manual replies.',
        recommendation: 'Set up automated keyword-triggered DM replies to send instant booking links.',
        priority: 1,
      })
    } else {
      findings.push({
        audit_id: profile.audit_id || '',
        category: 'CONVERSION',
        severity: 'MEDIUM',
        title: 'Conversion Path Can Be Further Accelerated',
        description: 'Your account has basic contact links but can improve lead capture speed.',
        evidence: 'Conversion path relies primarily on standard website URL.',
        recommendation: 'Deploy direct WhatsApp Click-to-Chat routing for 1-click lead capture.',
        priority: 3,
      })
    }

    // 5. Content Mix Finding
    const promoCount = media.filter((m) => m.content_category === 'PROMOTIONAL').length
    const promoPercentage = media.length > 0 ? Math.round((promoCount / media.length) * 100) : 0

    if (promoPercentage > 45) {
      findings.push({
        audit_id: profile.audit_id || '',
        category: 'CONTENT',
        severity: 'MEDIUM',
        title: 'Over-indexing on Purely Promotional Content',
        description: `${promoPercentage}% of your posts are direct sales pitches, which causes follower fatigue and drops engagement.`,
        evidence: `${promoCount} out of ${media.length} posts categorized as direct promotional offers.`,
        recommendation: 'Adopt the 80/20 rule: 80% educational/value content and 20% direct promotional offers.',
        priority: 3,
      })
    }

    return findings
  }

  async generateRecommendations(
    profile: InstagramProfile,
    _scores: AuditScore,
    _findings: AuditFinding[]
  ): Promise<AuditRecommendation[]> {
    return [
      {
        audit_id: profile.audit_id || '',
        category: 'REELS',
        title: 'Publish 3 Short-Form Educational Reels Per Week',
        description:
          'Transform your top customer questions into 30-second problem-solving Reels. Use on-screen text overlays and a clear visual hook in the first 3 seconds.',
        impact: 'High',
        effort: 'Medium',
        priority: 1,
        ai_generated: true,
      },
      {
        audit_id: profile.audit_id || '',
        category: 'CONVERSION',
        title: 'Deploy Automated Instant WhatsApp & DM Lead Capture',
        description:
          'Connect keyword auto-responders (e.g. "Comment INFO to get instant pricing on WhatsApp") to prevent 30-40% lead dropoff caused by slow manual replies.',
        impact: 'High',
        effort: 'Easy',
        priority: 2,
        ai_generated: true,
      },
      {
        audit_id: profile.audit_id || '',
        category: 'PROFILE',
        title: 'Optimize Bio with Offer-Driven Value Proposition & Link',
        description:
          'Update your bio to clearly state what outcome your business delivers for clients, and swap generic URL with an incentivized free consultation link.',
        impact: 'High',
        effort: 'Easy',
        priority: 3,
        ai_generated: true,
      },
      {
        audit_id: profile.audit_id || '',
        category: 'CONTENT',
        title: 'Implement an 80/20 Educational & Social Proof Content Mix',
        description:
          'Shift away from hard-sell posts. Share behind-the-scenes processes, customer transformation stories, and actionable industry insights.',
        impact: 'Medium',
        effort: 'Medium',
        priority: 4,
        ai_generated: true,
      },
      {
        audit_id: profile.audit_id || '',
        category: 'CONSISTENCY',
        title: 'Batch Create & Schedule 30 Days of Content in Advance',
        description:
          'Eliminate guesswork and posting anxiety by planning a 30-day visual content calendar with pre-approved captions and automated scheduling.',
        impact: 'High',
        effort: 'Medium',
        priority: 5,
        ai_generated: true,
      },
    ]
  }

  async generate30DayPlan(
    _profile: InstagramProfile,
    _findings: AuditFinding[]
  ): Promise<WeeklyGrowthPlanItem[]> {
    return [
      {
        week: 1,
        theme: 'Foundation & Bio Optimization',
        actions: [
          'Rewrite bio to include target keywords, location, and clear customer benefit statement.',
          'Add a direct WhatsApp routing link and pin 3 essential Story Highlights (Pricing, Reviews, FAQ).',
          'Audit top 5 competitor profiles to identify content gaps and trending Reel formats.',
        ],
      },
      {
        week: 2,
        theme: 'Content Engine & Reels Rollout',
        actions: [
          'Script and film 3 short-form Reels answering customer FAQs with bold opening hooks.',
          'Create 2 educational Carousel posts breaking down complex industry topics.',
          'Establish a consistent visual color palette and typography template for all feed graphics.',
        ],
      },
      {
        week: 3,
        theme: 'Engagement & Lead Automation',
        actions: [
          'Implement automated DM keyword triggers to instantly reply to comments with links.',
          'Actively engage for 15 minutes daily on relevant local community and customer accounts.',
          'Publish a client testimonial transformation post with a strong call-to-action.',
        ],
      },
      {
        week: 4,
        theme: 'Optimization & Paid Scaling',
        actions: [
          'Analyze 30-day insights to identify your top 10% best-performing organic Reel.',
          'Put a modest ad budget ($5/day) behind your best Reel to amplify reach to local target leads.',
          'Review lead conversion rates and refine your instant messaging responses.',
        ],
      },
    ]
  }

  async generateSummary(
    profile: InstagramProfile,
    scores: AuditScore
  ): Promise<{ headline: string; overview: string }> {
    const score = scores.overall_score
    let headline = ''

    if (score >= 80) {
      headline = 'Strong Instagram Presence with High Scaling Potential'
    } else if (score >= 70) {
      headline = 'Solid Foundation with Key Conversion & Content Opportunities'
    } else if (score >= 60) {
      headline = 'Needs Targeted Optimization to Turn Followers into Customers'
    } else {
      headline = 'Critical Growth Barriers Stopping Your Account from Converting'
    }

    const overview = `Your Instagram profile @${profile.username} currently scores ${score}/100. While your brand has valuable assets, optimization in Reels video reach and automated lead response can significantly elevate your inbound inquiries.`

    return { headline, overview }
  }
}
