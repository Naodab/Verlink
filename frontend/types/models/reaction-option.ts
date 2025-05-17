export type ReactionType = "like" | "love" | "haha" | "wow" | "angry" | "sad"

export interface ReactionOption {
    type: ReactionType
    emoji: string
    label: string
    color: string
  }