"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Gender } from "@/types/user"
import { fetchApi } from "@/lib/api"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [gender, setGender] = useState<Gender>("OTHER")
  const [dob, setDob] = useState<Date | undefined>(undefined)
  const [error, setError] = useState("")
  const [usernameOptions, setUsernameOptions] = useState<string[]>([])
  const [step, setStep] = useState(1)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const { register, isLoading } = useAuth()
  const router = useRouter()

  // Tạo các tùy chọn tên người dùng khi firstName hoặc lastName thay đổi
  useEffect(() => {
    if (firstName && lastName) {
      const options = [
        `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
        `${lastName.toLowerCase()}${firstName.toLowerCase()}`,
        `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
      ]
      setUsernameOptions(options)
      // Đặt tùy chọn đầu tiên làm mặc định
      setUsername(options[0])
    }
  }, [firstName, lastName])

  // Kiểm tra username có sẵn không
  useEffect(() => {
    const checkUsername = async () => {
      if (username && username.length >= 3) {
        setIsCheckingUsername(true)
        setUsernameAvailable(null)

        try {
          const response = await fetchApi<{ available: boolean }>(`/api/auth/check-username?username=${username}`)
          setUsernameAvailable(response.available)
        } catch (error) {
          console.error("Error checking username:", error)
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }

    const timer = setTimeout(checkUsername, 500)
    return () => clearTimeout(timer)
  }, [username])

  // Kiểm tra email có sẵn không
  useEffect(() => {
    const checkEmail = async () => {
      if (email && /\S+@\S+\.\S+/.test(email)) {
        setIsCheckingEmail(true)
        setEmailAvailable(null)

        try {
          const response = await fetchApi<{ available: boolean }>(`/api/auth/check-email?email=${email}`)
          setEmailAvailable(response.available)
        } catch (error) {
          console.error("Error checking email:", error)
        } finally {
          setIsCheckingEmail(false)
        }
      }
    }

    const timer = setTimeout(checkEmail, 500)
    return () => clearTimeout(timer)
  }, [email])

  const validateStep1 = () => {
    if (!firstName) {
      setError("Vui lòng nhập tên của bạn")
      return false
    }
    if (!lastName) {
      setError("Vui lòng nhập họ của bạn")
      return false
    }
    if (!username) {
      setError("Vui lòng chọn tên người dùng")
      return false
    }
    if (usernameAvailable === false) {
      setError("Tên người dùng đã tồn tại, vui lòng chọn tên khác")
      return false
    }
    if (!email) {
      setError("Vui lòng nhập email của bạn")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ")
      return false
    }
    if (emailAvailable === false) {
      setError("Email đã tồn tại, vui lòng sử dụng email khác")
      return false
    }
    if (!phone) {
      setError("Vui lòng nhập số điện thoại của bạn")
      return false
    }
    if (!dob) {
      setError("Vui lòng chọn ngày sinh của bạn")
      return false
    }

    // Kiểm tra tuổi tối thiểu (13 tuổi)
    const today = new Date()
    const age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (age < 13 || (age === 13 && monthDiff < 0)) {
      setError("Bạn phải từ 13 tuổi trở lên để đăng ký")
      return false
    }

    setError("")
    return true
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password) {
      setError("Vui lòng nhập mật khẩu")
      return
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp")
      return
    }

    const success = await register({
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      gender,
      dob,
    })

    if (success) {
      router.push("/setup-profile")
    } else {
      setError("Đăng ký không thành công. Vui lòng thử lại.")
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
              <CardTitle className="text-2xl font-bold text-center">Tạo tài khoản</CardTitle>
              <CardDescription className="text-center">
                {step === 1 ? "Nhập thông tin cá nhân của bạn" : "Tạo mật khẩu cho tài khoản của bạn"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="animate-pulse-slow">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {step === 1 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Tên</Label>
                        <Input
                          id="firstName"
                          placeholder="Tên"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="bg-background/50 border-border/50 focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Họ</Label>
                        <Input
                          id="lastName"
                          placeholder="Họ"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="bg-background/50 border-border/50 focus-visible:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="username">Tên người dùng</Label>
                        {isCheckingUsername && (
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Đang kiểm tra...
                          </span>
                        )}
                        {!isCheckingUsername && usernameAvailable !== null && (
                          <span className={`text-xs ${usernameAvailable ? "text-green-500" : "text-red-500"}`}>
                            {usernameAvailable ? "Có thể sử dụng" : "Đã tồn tại"}
                          </span>
                        )}
                      </div>
                      <Select value={username} onValueChange={setUsername}>
                        <SelectTrigger className="bg-background/50 border-border/50 focus-visible:ring-primary">
                          <SelectValue placeholder="Chọn tên người dùng" />
                        </SelectTrigger>
                        <SelectContent>
                          {usernameOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email">Email</Label>
                        {isCheckingEmail && (
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Đang kiểm tra...
                          </span>
                        )}
                        {!isCheckingEmail && emailAvailable !== null && (
                          <span className={`text-xs ${emailAvailable ? "text-green-500" : "text-red-500"}`}>
                            {emailAvailable ? "Có thể sử dụng" : "Đã tồn tại"}
                          </span>
                        )}
                      </div>
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
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        placeholder="0123456789"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="bg-background/50 border-border/50 focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Giới tính</Label>
                      <Select value={gender} onValueChange={(value) => setGender(value as Gender)}>
                        <SelectTrigger className="bg-background/50 border-border/50 focus-visible:ring-primary">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Nam</SelectItem>
                          <SelectItem value="FEMALE">Nữ</SelectItem>
                          <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Ngày sinh</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background/50 border-border/50",
                              !dob && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dob ? format(dob, "dd/MM/yyyy") : <span>Chọn ngày sinh</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dob}
                            onSelect={setDob}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50 border-border/50 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-background/50 border-border/50 focus-visible:ring-primary"
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                {step === 1 ? (
                  <Button
                    type="button"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                    onClick={handleNextStep}
                  >
                    Tiếp tục
                  </Button>
                ) : (
                  <div className="flex w-full space-x-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={handlePrevStep}>
                      Quay lại
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang tạo tài khoản...
                        </>
                      ) : (
                        "Tạo tài khoản"
                      )}
                    </Button>
                  </div>
                )}
                <div className="text-center text-sm">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                    Đăng nhập
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
