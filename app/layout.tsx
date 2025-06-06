import type React from "react"
import type { Metadata } from "next"
import { Inter, DotGothic16 } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })
const dotGothic16 = DotGothic16({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-dotgothic16",
})

export const metadata: Metadata = {
  title: "Pixel Breakout",
  description: "Interactive pixel art website with breakout game",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dotGothic16.variable} font-sans`}>{children}</body>
    </html>
  )
}
