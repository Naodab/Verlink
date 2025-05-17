import { Media } from "@/types/models/media"

export interface Author {
    id: string
    username: string
    profileUrl?: string
    profileImage?: Media
  }