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
  const [isHit, setIsHit] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { currentTheme } = useTheme()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!boxRef.current || !isClient) return

    // Function to check if a ball collides with this box
    const checkCollision = (x: number, y: number, radius: number) => {
      const box = boxRef.current
      if (!box) return false

      const rect = box.getBoundingClientRect()

      // Calculate the closest point on the box to the ball center
      const closestX = Math.max(rect.left, Math.min(x, rect.right))
      const closestY = Math.max(rect.top, Math.min(y, rect.bottom))

      // Calculate the distance between the closest point and the ball center
      const distanceX = x - closestX
      const distanceY = y - closestY
      const distanceSquared = distanceX * distanceX + distanceY * distanceY

      // Check if the distance is less than the ball's radius
      if (distanceSquared < radius * radius) {
        // Trigger the hit animation
        setIsHit(true)

        // Reset the hit state after the animation completes
        setTimeout(() => {
          setIsHit(false)
        }, 300)

        return true
      }

      return false
    }

    // Register this component for collision detection
    const handleBoxCollision = ((e: CustomEvent) => {
      const { x, y, radius } = e.detail
      checkCollision(x, y, radius)
    }) as EventListener

    window.addEventListener("box-collision", handleBoxCollision)

    return () => {
      window.removeEventListener("box-collision", handleBoxCollision)
    }
  }, [isClient])

  // 在 PixelBox 组件中添加注释
  return (
    <div
      ref={boxRef}
      style={{
        // ===== 盒子背景和边框颜色 =====
        backgroundColor: currentTheme.boxBackground, // 盒子背景颜色
        borderColor: currentTheme.boxBorder, // 盒子边框颜色
      }}
      className={`border-2 rounded-lg transition-transform ${isHit ? "scale-105" : "scale-100"} ${className}`}
    >
      {children}
    </div>
  )
}
