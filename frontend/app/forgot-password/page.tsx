"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Vui lòng nhập địa chỉ email của bạn")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Địa chỉ email không hợp lệ")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would make an API call to request password reset
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      setIsSubmitted(true)
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(245,229,61,0.15),transparent_70%)]"></div>

          <Card className="w-full max-w-md glass-effect">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-primary glow-text">Verlink</span>
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Quên mật khẩu</CardTitle>
              <CardDescription className="text-center">
                {isSubmitted
                  ? "Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu cho bạn"
                  : "Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu"}
              </CardDescription>
            </CardHeader>

            {isSubmitted ? (
              <CardContent className="space-y-4">
                <div className="bg-green-500/10 text-green-500 p-4 rounded-md flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email đã được gửi!</p>
                    <p className="text-sm mt-1">
                      Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra
                      hộp thư đến của bạn và làm theo hướng dẫn.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setIsSubmitted(false)}>
                    thử lại
                  </Button>
                </p>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Lỗi</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="m@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50 border-border/50 focus-visible:ring-primary"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi link đặt lại mật khẩu"
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    <Link href="/login" className="flex items-center justify-center text-primary hover:underline">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
