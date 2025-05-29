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
import { Camera, Globe, Lock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CreateGroupPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [groupPrivacy, setGroupPrivacy] = useState("public")
  const [groupCoverImage, setGroupCoverImage] = useState<string | null>(null)
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

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setGroupCoverImage(imageUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!groupName) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên nhóm",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để tạo nhóm
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Giả lập API call

      toast({
        title: "Tạo nhóm thành công",
        description: `Nhóm "${groupName}" đã được tạo thành công`,
      })

      // Chuyển hướng đến trang nhóm
      router.push("/groups")
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo nhóm. Vui lòng thử lại sau.",
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
          <h1 className="text-2xl font-bold mb-6">Tạo nhóm mới</h1>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin nhóm</CardTitle>
              <CardDescription>
                Tạo một nhóm để kết nối với những người có cùng sở thích và chia sẻ nội dung với nhau.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Tên nhóm</Label>
                  <Input
                    id="group-name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Nhập tên nhóm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group-description">Mô tả</Label>
                  <Textarea
                    id="group-description"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Mô tả về nhóm của bạn"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quyền riêng tư</Label>
                  <RadioGroup value={groupPrivacy} onValueChange={setGroupPrivacy} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="public" id="privacy-public" />
                      <Label htmlFor="privacy-public" className="flex items-center cursor-pointer">
                        <Globe className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <p className="font-medium">Công khai</p>
                          <p className="text-sm text-muted-foreground">
                            Ai cũng có thể thấy nhóm, thành viên và bài đăng
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="private" id="privacy-private" />
                      <Label htmlFor="privacy-private" className="flex items-center cursor-pointer">
                        <Lock className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <p className="font-medium">Riêng tư</p>
                          <p className="text-sm text-muted-foreground">
                            Chỉ thành viên mới có thể thấy bài đăng trong nhóm
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Ảnh bìa nhóm</Label>
                  <div
                    className="h-40 w-full bg-muted rounded-md flex items-center justify-center relative cursor-pointer group overflow-hidden"
                    style={
                      groupCoverImage
                        ? {
                            backgroundImage: `url(${groupCoverImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : {}
                    }
                    onClick={() => document.getElementById("group-cover-upload")?.click()}
                  >
                    {!groupCoverImage && (
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Tải lên ảnh bìa nhóm</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="bg-black/50 text-white hover:bg-black/70">
                        <Camera className="h-4 w-4 mr-2" />
                        Thay đổi ảnh bìa
                      </Button>
                    </div>
                    <input
                      id="group-cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverImageChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                      Đang tạo nhóm...
                    </>
                  ) : (
                    "Tạo nhóm"
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
