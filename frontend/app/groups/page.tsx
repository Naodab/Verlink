"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Plus, Lock, Globe, Calendar, MessageSquare } from "lucide-react"

// Mock data for groups
const GROUPS = [
  {
    id: 1,
    name: "Cộng đồng Lập trình viên Việt Nam",
    description: "Chia sẻ kiến thức, kinh nghiệm và cơ hội việc làm trong ngành IT",
    members: 15420,
    image: "/placeholder.svg?height=100&width=100&text=CNTT",
    privacy: "public",
    posts: 45,
    isJoined: true,
  },
  {
    id: 2,
    name: "Yêu thích Du lịch & Khám phá",
    description: "Chia sẻ trải nghiệm, địa điểm du lịch và mẹo hay khi đi du lịch",
    members: 8750,
    image: "/placeholder.svg?height=100&width=100&text=DL",
    privacy: "public",
    posts: 32,
    isJoined: true,
  },
  {
    id: 3,
    name: "Hội Nhiếp ảnh Nghiệp dư",
    description: "Nơi chia sẻ kiến thức và tác phẩm nhiếp ảnh",
    members: 5230,
    image: "/placeholder.svg?height=100&width=100&text=NA",
    privacy: "public",
    posts: 28,
    isJoined: false,
  },
  {
    id: 4,
    name: "Ẩm thực Việt Nam",
    description: "Chia sẻ công thức nấu ăn và địa điểm ăn uống ngon",
    members: 12800,
    image: "/placeholder.svg?height=100&width=100&text=AT",
    privacy: "public",
    posts: 56,
    isJoined: false,
  },
  {
    id: 5,
    name: "Hội Yêu thích Sách",
    description: "Thảo luận về sách, chia sẻ review và gợi ý sách hay",
    members: 4560,
    image: "/placeholder.svg?height=100&width=100&text=YTS",
    privacy: "private",
    posts: 19,
    isJoined: true,
  },
  {
    id: 6,
    name: "Nhóm Dự án XYZ",
    description: "Nhóm làm việc cho dự án XYZ (Chỉ dành cho thành viên)",
    members: 24,
    image: "/placeholder.svg?height=100&width=100&text=XYZ",
    privacy: "private",
    posts: 87,
    isJoined: true,
  },
]

// Mock data for suggested groups
const SUGGESTED_GROUPS = [
  {
    id: 7,
    name: "Hội Yêu thích Phim Ảnh",
    description: "Thảo luận về phim ảnh, review và gợi ý phim hay",
    members: 7890,
    image: "/placeholder.svg?height=100&width=100&text=PA",
    privacy: "public",
  },
  {
    id: 8,
    name: "Cộng đồng Marketing Việt Nam",
    description: "Chia sẻ kiến thức, kinh nghiệm và cơ hội việc làm trong ngành Marketing",
    members: 6540,
    image: "/placeholder.svg?height=100&width=100&text=MKT",
    privacy: "public",
  },
  {
    id: 9,
    name: "Hội Thể thao & Fitness",
    description: "Chia sẻ kinh nghiệm tập luyện, chế độ dinh dưỡng và động lực",
    members: 9870,
    image: "/placeholder.svg?height=100&width=100&text=TT",
    privacy: "public",
  },
]

export default function GroupsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [myGroups, setMyGroups] = useState(GROUPS.filter((group) => group.isJoined))
  const [searchQuery, setSearchQuery] = useState("")

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

  const handleJoinGroup = (groupId: number) => {
    // In a real app, this would make an API call to join the group
    const updatedGroups = GROUPS.map((group) => {
      if (group.id === groupId) {
        return { ...group, isJoined: true }
      }
      return group
    })

    setMyGroups(updatedGroups.filter((group) => group.isJoined))
  }

  const filteredGroups = GROUPS.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Nhóm</h1>
            <p className="text-muted-foreground">Khám phá và tham gia các nhóm cộng đồng</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm nhóm..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo nhóm
            </Button>
          </div>
        </div>

        <Tabs defaultValue="my-groups" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="my-groups">Nhóm của tôi</TabsTrigger>
            <TabsTrigger value="discover">Khám phá</TabsTrigger>
            <TabsTrigger value="invites">Lời mời</TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups" className="space-y-6">
            {myGroups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Bạn chưa tham gia nhóm nào</h3>
                <p className="text-muted-foreground mb-4">
                  Hãy khám phá và tham gia các nhóm để kết nối với những người có cùng sở thích
                </p>
                <Button variant="outline" onClick={() => document.querySelector('[data-value="discover"]')?.click()}>
                  Khám phá nhóm
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGroups.map((group) => (
                  <Card key={group.id} className="overflow-hidden card-hover">
                    <div className="h-32 bg-muted flex items-center justify-center relative">
                      <img
                        src={group.image || "/placeholder.svg"}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant={group.privacy === "public" ? "outline" : "secondary"}
                      >
                        {group.privacy === "public" ? (
                          <Globe className="h-3 w-3 mr-1" />
                        ) : (
                          <Lock className="h-3 w-3 mr-1" />
                        )}
                        {group.privacy === "public" ? "Công khai" : "Riêng tư"}
                      </Badge>
                    </div>

                    <CardHeader className="pb-2">
                      <h3 className="font-medium text-lg line-clamp-1">{group.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{group.members.toLocaleString()} thành viên</span>
                        <span className="mx-1">•</span>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{group.posts} bài viết</span>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => router.push(`/groups/${group.id}`)}>
                        Xem nhóm
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <h2 className="text-lg font-medium mb-4">Nhóm gợi ý cho bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SUGGESTED_GROUPS.map((group) => (
                <Card key={group.id} className="overflow-hidden card-hover">
                  <div className="h-32 bg-muted flex items-center justify-center relative">
                    <img
                      src={group.image || "/placeholder.svg"}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className="absolute top-2 right-2"
                      variant={group.privacy === "public" ? "outline" : "secondary"}
                    >
                      {group.privacy === "public" ? (
                        <Globe className="h-3 w-3 mr-1" />
                      ) : (
                        <Lock className="h-3 w-3 mr-1" />
                      )}
                      {group.privacy === "public" ? "Công khai" : "Riêng tư"}
                    </Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <h3 className="font-medium text-lg line-clamp-1">{group.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{group.members.toLocaleString()} thành viên</span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full" onClick={() => handleJoinGroup(group.id)}>
                      Tham gia nhóm
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <h2 className="text-lg font-medium mt-8 mb-4">Tất cả nhóm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups
                .filter((group) => !group.isJoined)
                .map((group) => (
                  <Card key={group.id} className="overflow-hidden card-hover">
                    <div className="h-32 bg-muted flex items-center justify-center relative">
                      <img
                        src={group.image || "/placeholder.svg"}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant={group.privacy === "public" ? "outline" : "secondary"}
                      >
                        {group.privacy === "public" ? (
                          <Globe className="h-3 w-3 mr-1" />
                        ) : (
                          <Lock className="h-3 w-3 mr-1" />
                        )}
                        {group.privacy === "public" ? "Công khai" : "Riêng tư"}
                      </Badge>
                    </div>

                    <CardHeader className="pb-2">
                      <h3 className="font-medium text-lg line-clamp-1">{group.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{group.members.toLocaleString()} thành viên</span>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button className="w-full" onClick={() => handleJoinGroup(group.id)}>
                        Tham gia nhóm
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="invites" className="space-y-6">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Không có lời mời nhóm nào</h3>
              <p className="text-muted-foreground">Khi ai đó mời bạn vào nhóm, bạn sẽ thấy lời mời ở đây</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
