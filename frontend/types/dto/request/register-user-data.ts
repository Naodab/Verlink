import { Gender } from "@/types/models/user"

export type RegisterData = {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  password: string
  gender: Gender
  dob?: Date
}