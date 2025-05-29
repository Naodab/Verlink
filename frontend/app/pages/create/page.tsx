"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Globe, Briefcase, Music, Film, Book, Coffee, Heart, Utensils } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Danh sách các loại trang
const PAGE_CATEGORIES = [
  { id: "business", name: "Doanh nghiệp", icon: <Briefcase className="h-4 w-4" /> },
  { id: "entertainment", name: "Giải trí", icon: <Music className="h-4 w-4" /> },
  { id: "brand", name: "Thương hiệu", icon: <Globe className="h-4 w-4" /> },
  { id: "community", name: "Cộng đồng", icon: <Heart className="h-4 w-4" /> },
  { id: "education", name: "Giáo dục", icon: <Book className="h-4 w-4" /> },
  { id: "food", name: "Ẩm thực", icon: <Utensils className="h-4 w-4" /> },
  { id: "movie", name: "Phim ảnh", icon: <Film className="h-4 w-4" /> },
  { id: "cafe", name: "Quán cà phê", icon: <Coffee className="h-4 w-4" /> },
]

export default function CreatePagePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [pageName, setPageName] = useState("")
  const [pageCategory, setPageCategory] = useState("")
  const [pageDescription, setPageDescription] = useState("")
  const [pageImage, setPageImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    router.push("/login")
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setPageImage(imageUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pageName || !pageCategory) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin trang",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để tạo trang
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Giả lập API call

      toast({
        title: "Tạo trang thành công",
        description: `Trang "${pageName}" đã được tạo thành công`,
      })

      // Chuyển hướng đến trang quản lý trang
      router.push("/pages")
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo trang. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main className="container py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Tạo trang mới</h1>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin trang</CardTitle>
              <CardDescription>
                Điền thông tin để tạo trang mới. Trang sẽ giúp bạn kết nối với người hâm mộ và khách hàng.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage src={pageImage || "/placeholder.svg"} alt="Page avatar" />
                      <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                        {pageName ? pageName.charAt(0) : "P"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
                      onClick={() => document.getElementById("page-image-upload")?.click()}
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Tải lên ảnh trang</span>
                    </Button>
                    <input
                      id="page-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Tải lên logo hoặc ảnh đại diện cho trang</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-name">Tên trang</Label>
                  <Input
                    id="page-name"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="Nhập tên trang"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-category">Danh mục</Label>
                  <Select value={pageCategory} onValueChange={setPageCategory} required>
                    <SelectTrigger id="page-category">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            {category.icon}
                            <span className="ml-2">{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-description">Mô tả</Label>
                  <Textarea
                    id="page-description"
                    value={pageDescription}
                    onChange={(e) => setPageDescription(e.target.value)}
                    placeholder="Mô tả về trang của bạn"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                      Đang tạo trang...
                    </>
                  ) : (
                    "Tạo trang"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
