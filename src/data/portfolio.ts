export interface Project {
  id: string
  title: string
  description: string
  category: string
  type: string
  videoUrl?: string
  thumbnailUrl?: string
  palette?: [string, string]
  videoAspect?: 'landscape' | 'portrait'
  preload?: 'auto' | 'metadata' | 'none'
}

/** Placeholder — real portfolio projects to be added before launch. */
export const portfolioCategories: string[] = ['All']

export const projects: Project[] = []

export const portfolioNote = ''
