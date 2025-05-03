"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Play, Volume2, VolumeX, Maximize, MoreVertical } from "lucide-react"
import { PostReactions } from "@/components/post-reactions"

// Mock video data
const VIDEOS = [
  {
    id: 1,
    title: "Hướng dẫn nấu món phở Việt Nam",
    author: "Đầu Bếp Việt",
    authorImage: "/placeholder.svg?height=40&width=40&text=ĐBV",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Phở+Việt+Nam",
    views: "125K",
    posted: "2 ngày trước",
    duration: "12:45",
  },
  {
    id: 2,
    title: "Review iPhone 15 Pro Max sau 1 tháng sử dụng",
    author: "Tech Review",
    authorImage: "/placeholder.svg?height=40&width=40&text=TR",
    thumbnail: "/placeholder.svg?height=400&width=600&text=iPhone+15+Pro+Max",
    views: "89K",
    posted: "5 ngày trước",
    duration: "18:22",
  },
  {
    id: 3,
    title: "Khám phá Đà Lạt - Thành phố ngàn hoa",
    author: "Du Lịch Việt",
    authorImage: "/placeholder.svg?height=40&width=40&text=DLV",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Đà+Lạt",
    views: "56K",
    posted: "1 tuần trước",
    duration: "22:10",
  },
  {
    id: 4,
    title: "Bài tập Yoga giảm stress tại nhà",
    author: "Healthy Life",
    authorImage: "/placeholder.svg?height=40&width=40&text=HL",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Yoga",
    views: "42K",
    posted: "3 ngày trước",
    duration: "15:30",
  },
  {
    id: 5,
    title: "Hướng dẫn làm bánh trung thu nhân thập cẩm",
    author: "Bếp Nhà Mình",
    authorImage: "/placeholder.svg?height=40&width=40&text=BNM",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Bánh+Trung+Thu",
    views: "78K",
    posted: "2 tuần trước",
    duration: "25:15",
  },
  {
    id: 6,
    title: "Mẹo tiết kiệm pin cho điện thoại Android",
    author: "Tech Tips",
    authorImage: "/placeholder.svg?height=40&width=40&text=TT",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Android+Tips",
    views: "35K",
    posted: "4 ngày trước",
    duration: "08:45",
  },
]

export default function VideosPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Video</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((video) => (
            <Card
              key={video.id}
              className="overflow-hidden card-hover"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-1 py-0.5 text-xs rounded">
                  {video.duration}
                </div>

                {hoveredVideo === video.id && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/30 backdrop-blur-sm">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </Button>

                    <div className="absolute bottom-2 left-2 flex space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMuted(!muted)
                        }}
                      >
                        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={video.authorImage || "/placeholder.svg"} alt={video.author} />
                    <AvatarFallback>{video.author.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-2">{video.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span>{video.author}</span>
                      <span className="mx-1">•</span>
                      <span>{video.views} lượt xem</span>
                      <span className="mx-1">•</span>
                      <span>{video.posted}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="px-4 py-3 border-t">
                <PostReactions postId={`video-${video.id}`} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
