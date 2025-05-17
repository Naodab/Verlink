import { Media } from "./media"

export type NotificationType = "USER_TAG" | "COMMENT_REPLY" | "COMMENT_REACTION" 
                        | "FRIEND_REQUEST" | "FRIEND_ACCEPT" | "POST_REACTION" 
                        | "POST_COMMENT" | "POST_CREATED" | "POST_DELETED"

export interface Notification {
    id: string
    content: string
    senderId: string
    type: NotificationType
    targetId: string
    createdAt: Date
    url: string
    read: boolean
    media: Media
}