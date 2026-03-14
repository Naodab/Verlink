import { Media } from "@/types/models/media"
import type { User } from "@/types/models/user"
import { ReactionCounts } from "./reaction-counts"

export type Visibility = "PUBLIC" | "FRIENDS" | "PRIVATE"

export interface Post {
  id: string
  content: string
  user: User
  images?: Media[]
  videos?: Media[]
  docs?: Media[]
  visibility: Visibility
  reactionCounts: ReactionCounts
  isEdited: boolean
  shareCount: number
  createdAt: Date
  updatedAt?: Date
}
