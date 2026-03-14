import { Author } from "@/types/dto/response/author"

export interface CommentData {
  id: string | number
  content: string
  createdAt: string | Date
  author: Author
  likes: number
  isLiked?: boolean
  replies?: CommentData[]
}