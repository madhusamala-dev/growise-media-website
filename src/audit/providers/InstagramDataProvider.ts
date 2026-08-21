import type { InstagramMedia, InstagramProfile } from '../types'

export interface InstagramDataProvider {
  getProfile(username: string): Promise<InstagramProfile>
  getMedia(username: string): Promise<InstagramMedia[]>
}
