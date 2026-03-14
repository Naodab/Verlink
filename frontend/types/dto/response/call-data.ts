import { Media } from "@/types/models/media"

export type CallType = "voice" | "video"

export interface CallData {
    id: string
    callerId: string
    callerUsername: string
    callerImage: Media
    timestamp: string
    roomId: string
    type: CallType
  }