"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useTheme } from "@/contexts/theme-context"

type PixelBoxProps = {
  children: React.ReactNode
  className?: string
}

export const PixelBox: React.FC<PixelBoxProps> = ({ children, className = "" }) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const { currentTheme } = useTheme()

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div
      ref={boxRef}
      style={{
        // ===== 盒子背景和边框颜色 =====
        backgroundColor: currentTheme.boxBackground, // 盒子背景颜色
        borderColor: currentTheme.boxBorder, // 盒子边框颜色
      }}
      className={`border-2 rounded-lg ${className}`}
    >
      {children}
    </div>
  )
}
