import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, DotGothic16 } from "next/font/google"
import "./globals.css"
import { ParallaxBackground } from "@/components/parallax-background"

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })
const dotGothic16 = DotGothic16({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-dotgothic16",
})

export const metadata: Metadata = {
  title: "Han-protofiolo",
  description: "Interactive pixel art website with breakout game",
  generator: "v0.dev",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dotGothic16.variable} font-sans`}>
        <ParallaxBackground />
        {children}
      </body>
    </html>
  )
}
