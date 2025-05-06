export type Gender = "MALE" | "FEMALE" | "OTHER"

export interface MediaFile {
  id: string
  url: string
  name?: string
  type?: string
  size?: number
}

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dob?: Date
  createdAt: Date
  profileImage?: MediaFile
  coverImage?: MediaFile
  gender: Gender
}
