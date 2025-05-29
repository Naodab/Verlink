import { User } from "./user"

export type FriendshipStatus = "PENDING" | "ACCEPTED" | "REMOVED" | "REJECTED"

export interface Friendship {
    requester: User
    accepter: User
    createdAt: Date
    status: FriendshipStatus
}