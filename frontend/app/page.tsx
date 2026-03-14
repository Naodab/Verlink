"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, CheckCircle, Users, Globe, Shield, Zap, MessageSquare, ImageIcon, Video } from "lucide-react"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Connect with Friends",
      description: "Build your network and stay connected with friends and family around the world.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Global Community",
      description: "Join a diverse community of users from all corners of the globe.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Privacy First",
      description: "Your data is protected with industry-leading security measures.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lightning Fast",
      description: "Experience seamless performance with our optimized platform.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Real-time Messaging",
      description: "Communicate instantly with friends through our messaging system.",
    },
    {
      icon: <ImageIcon className="h-8 w-8 text-primary" />,
      title: "Share Moments",
      description: "Share your favorite photos and memories with your network.",
    },
  ]

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 100 }).map((_, i) => (
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

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:p-10">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full border border-white/50 flex items-center justify-center">
            <span className="text-xl font-bold text-primary glow-text">V</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" className="text-white hover:text-primary hover:bg-white/10">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative h-screen flex items-center justify-center"
        style={{ opacity, scale }}
      >
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/placeholder.svg?height=1080&width=1920&text=Abstract+Digital+Network"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            className="text-6xl md:text-8xl font-bold tracking-wider mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            VERLINK
          </motion.h1>

          <motion.div
            className="w-24 h-0.5 bg-primary mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: isLoaded ? "6rem" : 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Connect, Share, and Discover in a New Digital Experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Button
              onClick={scrollToFeatures}
              className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-6"
            >
              <ArrowDown className="h-5 w-5 mr-2" />
              Discover More
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div ref={featuresRef} className="relative z-10 py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Verlink?</h2>
            <div className="w-24 h-0.5 bg-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience a social platform designed with you in mind, offering powerful features in an elegant
              interface.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(245, 229, 61, 0.1)" }}
              >
                <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative z-10 py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="text-center">
              <motion.div
                className="text-5xl md:text-6xl font-bold text-primary mb-2"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                10M+
              </motion.div>
              <p className="text-xl text-gray-300">Active Users</p>
            </div>
            <div className="text-center">
              <motion.div
                className="text-5xl md:text-6xl font-bold text-primary mb-2"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                150+
              </motion.div>
              <p className="text-xl text-gray-300">Countries</p>
            </div>
            <div className="text-center">
              <motion.div
                className="text-5xl md:text-6xl font-bold text-primary mb-2"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                5B+
              </motion.div>
              <p className="text-xl text-gray-300">Connections Made</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* App Preview Section */}
      <div className="relative z-10 py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Experience Verlink on Any Device</h2>
              <div className="w-24 h-0.5 bg-primary mb-6"></div>
              <p className="text-xl text-gray-300 mb-8">
                Stay connected with friends and family wherever you are. Our platform is optimized for all devices,
                ensuring a seamless experience whether you're on desktop, tablet, or mobile.
              </p>

              <div className="space-y-4">
                {[
                  "Real-time messaging and notifications",
                  "High-quality photo and video sharing",
                  "Secure and private communications",
                  "Customizable user experience",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <CheckCircle className="h-6 w-6 text-primary mr-3" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6"
                >
                  <Link href="/register">Get Started Now</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src="/placeholder.svg?height=600&width=400&text=App+Preview"
                  alt="App Preview"
                  className="rounded-3xl shadow-2xl border border-white/20"
                />
                <div className="absolute -top-4 -right-4 bg-primary/20 backdrop-blur-sm rounded-full p-4 border border-primary/50">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-primary/20 backdrop-blur-sm rounded-full p-4 border border-primary/50">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Connect?</h2>
            <div className="w-24 h-0.5 bg-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-10">
              Join millions of users worldwide and experience a new way to connect, share, and discover.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6">
                <Link href="/register">Create Account</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 rounded-full px-8 py-6"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 bg-black border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-10 w-10 rounded-full border border-white/50 flex items-center justify-center mr-3">
                <span className="text-xl font-bold text-primary glow-text">V</span>
              </div>
              <span className="text-xl font-bold">VERLINK</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
              <Link href="/about" className="text-gray-400 hover:text-primary">
                About
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-primary">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-primary">
                Contact
              </Link>
            </div>

            <div className="text-gray-500 text-sm">© {new Date().getFullYear()} Verlink. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
