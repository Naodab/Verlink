export type MediaType = "image" | "video" | "document"

export interface Media {
    id: string
    url: string
    name?: string
    type?: MediaType
    size?: number
  }