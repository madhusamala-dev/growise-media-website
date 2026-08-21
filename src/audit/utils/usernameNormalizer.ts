export interface UsernameValidationResult {
  isValid: boolean
  username: string
  error?: string
}

export function normalizeInstagramUsername(input: string): UsernameValidationResult {
  if (!input) {
    return { isValid: false, username: '', error: 'Username is required' }
  }

  let cleaned = input.trim()

  // 1. Extract from Instagram URL if provided
  if (cleaned.toLowerCase().includes('instagram.com/')) {
    try {
      // Remove query parameters or trailing slashes
      const urlObj = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`)
      const pathSegments = urlObj.pathname.split('/').filter(Boolean)
      if (pathSegments.length > 0) {
        cleaned = pathSegments[0]
      }
    } catch {
      // Fallback regex if URL parsing fails
      const match = cleaned.match(/instagram\.com\/([a-zA-Z0-9_.]+)/i)
      if (match && match[1]) {
        cleaned = match[1]
      }
    }
  }

  // 2. Remove leading @ symbol
  cleaned = cleaned.replace(/^@+/, '')

  // 3. Remove trailing slashes and spaces
  cleaned = cleaned.replace(/\/+$/, '').trim()

  // 4. Validate username rules (1-30 chars, alphanumeric + underscores + periods)
  if (cleaned.length === 0) {
    return { isValid: false, username: '', error: 'Please enter a valid Instagram username' }
  }

  if (cleaned.length > 30) {
    return { isValid: false, username: cleaned, error: 'Instagram usernames cannot exceed 30 characters' }
  }

  const isValidFormat = /^[a-zA-Z0-9_.]+$/.test(cleaned)

  if (!isValidFormat) {
    return {
      isValid: false,
      username: cleaned,
      error: 'Username contains invalid characters (only letters, numbers, underscores, and dots allowed)',
    }
  }

  return {
    isValid: true,
    username: cleaned.toLowerCase(),
  }
}
