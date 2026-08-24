/**
 * Deterministic insights engine — generates "What We Learned" cards
 * from actual audit metrics. No AI, no fabrication.
 */

import type { Level2AuditReport } from '../types/level2'

export interface Insight {
  icon: string
  title: string
  text: string
}

export function generateInsights(report: Level2AuditReport): Insight[] {
  const insights: Insight[] = []
  const { metrics, contentAnalysis, bestPerformingReels, worstPerformingReels } = report
  const consistency = contentAnalysis.postingConsistency
  const captionStats = contentAnalysis.captionStats
  const contentMix = contentAnalysis.contentMix

  // 1. Top Reel performance
  if (bestPerformingReels.length > 0) {
    const top = bestPerformingReels[0]
    const views = top.views ?? 0
    if (views > 0) {
      const formatted = views >= 1_000_000
        ? `${(views / 1_000_000).toFixed(2)}M+`
        : views >= 1_000
        ? `${(views / 1_000).toFixed(1)}K+`
        : `${views}+`
      insights.push({
        icon: '🏆',
        title: 'Top Reel Performance',
        text: `Your top Reel generated ${formatted} views.`,
      })
    }
  }

  // 2. Average vs Median views — content concentration
  if (metrics.averageViews != null && metrics.medianViews != null && metrics.medianViews > 0) {
    const ratio = metrics.averageViews / metrics.medianViews
    if (ratio > 3) {
      insights.push({
        icon: '📊',
        title: 'Uneven Reach Distribution',
        text: `Your average views are ${ratio.toFixed(0)}× higher than your median, suggesting a small number of posts are driving a large share of your reach.`,
      })
    } else {
      insights.push({
        icon: '📊',
        title: 'Consistent Reach Distribution',
        text: `Your average and median views are relatively close, indicating consistent performance across your content.`,
      })
    }
  }

  // 3. CTA Usage
  if (captionStats.CTAUsagePercentage < 50) {
    insights.push({
      icon: '📢',
      title: 'Low CTA Usage',
      text: `Only ${Math.round(captionStats.CTAUsagePercentage)}% of analyzed posts contain a detectable Call-to-Action.`,
    })
  } else if (captionStats.CTAUsagePercentage >= 70) {
    insights.push({
      icon: '📢',
      title: 'Strong CTA Usage',
      text: `${Math.round(captionStats.CTAUsagePercentage)}% of your posts include a CTA — well above average.`,
    })
  }

  // 4. Posting consistency
  if (consistency.averagePostsPerWeek >= 3) {
    insights.push({
      icon: '📅',
      title: 'Consistent Publishing',
      text: `You publish approximately ${consistency.averagePostsPerWeek.toFixed(1)} posts per week. Keep up the consistent activity.`,
    })
  } else if (consistency.averagePostsPerWeek < 1.5) {
    insights.push({
      icon: '📅',
      title: 'Infrequent Publishing',
      text: `You average only ${consistency.averagePostsPerWeek.toFixed(1)} posts per week. More consistent publishing can improve algorithmic reach.`,
    })
  }

  // 5. Content mix
  if (contentMix.reelsPercentage >= 90) {
    insights.push({
      icon: '🎬',
      title: 'Reels-Dominated Content',
      text: `${Math.round(contentMix.reelsPercentage)}% of your content is Reels. Consider testing carousels or static posts to reach different audience behaviors.`,
    })
  } else if (contentMix.reelsPercentage < 30 && metrics.reelsAnalyzed > 0) {
    insights.push({
      icon: '🎬',
      title: 'Low Reels Share',
      text: `Only ${Math.round(contentMix.reelsPercentage)}% of your content is Reels. Short-form video typically drives the highest organic reach.`,
    })
  }

  // 6. Comment engagement
  if (metrics.medianCommentRate != null && metrics.medianCommentRate < 0.1 && metrics.postsAnalyzed >= 5) {
    insights.push({
      icon: '💬',
      title: 'Low Comment Activity',
      text: `Your median comment rate is ${metrics.medianCommentRate.toFixed(2)}%. Posts with questions or debates tend to drive more comments.`,
    })
  }

  // 7. Reel view rate
  if (bestPerformingReels.length > 0 && worstPerformingReels.length > 0) {
    const bestVR = bestPerformingReels[0].viewRate ?? 0
    const worstVR = worstPerformingReels[0].viewRate ?? 0
    if (bestVR > 0 && worstVR > 0 && bestVR / worstVR > 10) {
      insights.push({
        icon: '📈',
        title: 'Wide Performance Gap',
        text: `Your top Reel's view rate is ${(bestVR / worstVR).toFixed(0)}× higher than your lowest Reel, indicating significant variance in content performance.`,
      })
    }
  }

  // 8. Hashtag usage
  if (captionStats.averageHashtagsPerPost === 0 && metrics.postsAnalyzed >= 5) {
    insights.push({
      icon: '#️⃣',
      title: 'No Hashtags Detected',
      text: 'None of your analyzed posts contain hashtags. While not required, hashtags can help with discoverability.',
    })
  }

  // Limit to 5 insights
  return insights.slice(0, 5)
}

/**
 * Get category label for an opportunity rule
 */
export function getOpportunityCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    CONTENT: 'Content Strategy',
    ENGAGEMENT: 'Engagement',
    CONVERSION: 'Conversion',
    PROFILE: 'Profile Optimization',
    CONSISTENCY: 'Consistency',
    FORMATS: 'Format Strategy',
  }
  return map[category.toUpperCase()] || category
}

/**
 * Get category icon for an opportunity
 */
export function getOpportunityIcon(category: string): string {
  const map: Record<string, string> = {
    CONTENT: '📝',
    ENGAGEMENT: '💬',
    CONVERSION: '🎯',
    PROFILE: '👤',
    CONSISTENCY: '📅',
    FORMATS: '🎬',
  }
  return map[category.toUpperCase()] || '💡'
}
