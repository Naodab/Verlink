import type { User, MediaFile } from "./user"

export type Visibility = "PUBLIC" | "FRIENDS" | "PRIVATE"

export interface ReactionCounts {
  like: number
  love: number
  haha: number
  wow: number
  sad: number
  angry: number
}

export interface Post {
  id: string
  content: string
  user: User
  images?: MediaFile[]
  videos?: MediaFile[]
  docs?: MediaFile[]
  visibility: Visibility
  reactionCounts: ReactionCounts
  isEdited: boolean
  shareCount: number
  createdAt: Date
  updatedAt?: Date
}
