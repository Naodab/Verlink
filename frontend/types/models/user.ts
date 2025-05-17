import { Media } from "@/types/models/media"

export type Gender = "MALE" | "FEMALE" | "OTHER"

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dob?: Date
  createdAt: Date
  profileImage?: Media
  coverImage?: Media
  gender: Gender
}
