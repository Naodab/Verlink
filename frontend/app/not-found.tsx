"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:p-10">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full border border-white/50 flex items-center justify-center">
            <span className="text-xl font-bold text-primary glow-text">V</span>
          </div>
        </Link>

        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
        <div className="text-center max-w-2xl mx-auto px-4">
          <motion.div
            className="relative w-64 h-64 mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/placeholder.svg?height=400&width=400&text=404"
              alt="404"
              className="w-full h-full object-contain opacity-80"
            />
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold tracking-wider mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            LOST IN SPACE
          </motion.h1>

          <motion.div
            className="w-24 h-0.5 bg-primary mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: isLoaded ? "6rem" : 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          <motion.p
            className="text-lg text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              className="border border-white/50 bg-transparent hover:bg-white/10 text-white rounded-full px-8 py-6"
            >
              <Link href="/">RETURN HOME</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border border-primary/50 bg-transparent hover:bg-primary/10 text-primary rounded-full px-8 py-6"
            >
              <Link href="/contact">CONTACT US</Link>
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center p-6 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Verlink. All rights reserved.</p>
      </footer>
    </div>
  )
}
