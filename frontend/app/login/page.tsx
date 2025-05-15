"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu")
      return
    }

    const success = await login(email, password)
    if (success) {
      router.push("/feed")
    } else {
      setError("Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.")
    }
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
              <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
              <CardDescription className="text-center">Nhập thông tin đăng nhập của bạn</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="animate-pulse-slow">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="email@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 border-border/50 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline underline-offset-4">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 border-border/50 focus-visible:ring-primary"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
                <div className="text-center text-sm">
                  Chưa có tài khoản?{" "}
                  <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                    Đăng ký
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
