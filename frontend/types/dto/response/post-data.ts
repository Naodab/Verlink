import { Media } from "@/types/models/media"
import { Author } from "@/types/dto/response/author"
import { CommentData } from "@/types/dto/response/comment-data"
import { ReactionCounts } from "@/types/models/reaction-counts"

export interface PostData {
  id: string
  content: string
  images?: Media[]
  videos?: Media[]
  docs?: Media[]
  location?: string
  visibility: "PUBLIC" | "FRIENDS" | "PRIVATE"
  createdAt: string | Date
  author: Author
  commentsCount?: number
  sharesCount?: number
  comments?: CommentData[]
  isEdited?: boolean
  reactionCounts?: ReactionCounts
}