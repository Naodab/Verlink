"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Check, UserCircle2 } from "lucide-react"
import Link from "next/link"

const DEFAULT_AVATARS = [
  "/placeholder.svg?height=100&width=100&text=A1",
  "/placeholder.svg?height=100&width=100&text=A2",
  "/placeholder.svg?height=100&width=100&text=A3",
  "/placeholder.svg?height=100&width=100&text=A4",
  "/placeholder.svg?height=100&width=100&text=A5",
  "/placeholder.svg?height=100&width=100&text=A6",
]

export default function SetupProfilePage() {
  const { user, isLoading, updateProfileImage } = useAuth()
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [customAvatar, setCustomAvatar] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
    setCustomAvatar(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setCustomAvatar(imageUrl)
      setSelectedAvatar(null)
    }
  }

  const handleSubmit = async () => {
    setIsUploading(true)
    try {
      const imageUrl = customAvatar || selectedAvatar
      if (imageUrl) {
        await updateProfileImage(imageUrl)
      }
      router.push("/feed")
    } catch (error) {
      console.error("Failed to update profile image", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSkip = () => {
    router.push("/feed")
  }

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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,229,61,0.15),transparent_70%)]"></div>
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white star"
                style={
                  {
                    width: Math.random() * 2 + 1 + "px",
                    height: Math.random() * 2 + 1 + "px",
                    top: Math.random() * 100 + "%",
                    left: Math.random() * 100 + "%",
                    opacity: Math.random() * 0.5 + 0.2,
                    "--delay": Math.random() * 5,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <Card className="w-full max-w-md glass-effect">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-primary glow-text">Verlink</span>
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Thiết lập hồ sơ</CardTitle>
              <CardDescription className="text-center">Chọn ảnh đại diện hoặc tải lên ảnh của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Avatar className="h-32 w-32 border-4 border-background glow-effect">
                  <AvatarImage
                    src={customAvatar || selectedAvatar || user.profileImage?.url}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Chọn ảnh đại diện</h3>
                <div className="grid grid-cols-3 gap-3">
                  {DEFAULT_AVATARS.map((avatar, index) => (
                    <button
                      key={index}
                      className={`relative rounded-md overflow-hidden transition-all ${
                        selectedAvatar === avatar
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "hover:opacity-80"
                      }`}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      <img
                        src={avatar || "/placeholder.svg"}
                        alt={`Avatar ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      {selectedAvatar === avatar && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Hoặc tải lên ảnh của bạn</h3>
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="h-4 w-4 mr-2" />
                  Chọn ảnh
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                {customAvatar && (
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <img
                        src={customAvatar || "/placeholder.svg"}
                        alt="Custom avatar"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                onClick={handleSubmit}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <UserCircle2 className="h-4 w-4 mr-2" />
                    Hoàn tất thiết lập
                  </>
                )}
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleSkip}>
                Bỏ qua
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
