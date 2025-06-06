"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { getCustomPixelChar } from "@/lib/my-custom-pixels"
import { useTheme } from "@/contexts/theme-context"

type CustomPixelTextProps = {
  text: string
  size?: "small" | "medium" | "large"
  className?: string
}

// 默认字符（问号形状）
const defaultChar = [
  [0, 1, 1, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0],
  [0, 0, 0, 0],
  [0, 0, 1, 0],
]

const CustomPixelText: React.FC<CustomPixelTextProps> = ({ text, size = "medium", className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isInitialized, setIsInitialized] = useState(false)
  const { currentTheme } = useTheme()

  // 根据size属性确定像素大小
  const getPixelSize = () => {
    switch (size) {
      case "small":
        return 2
      case "large":
        return 6
      default:
        return 4
    }
  }

  const pixelSize = getPixelSize()
  const pixelGap = Math.max(1, pixelSize / 4)

  // 计算画布尺寸
  useEffect(() => {
    if (!canvasRef.current) return

    let totalWidth = 0
    let maxHeight = 0

    // 计算文本所需的宽度和高度
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const pixelChar = getCustomPixelChar(char) || defaultChar

      totalWidth += (pixelChar[0]?.length || 0) * (pixelSize + pixelGap) + pixelGap
      maxHeight = Math.max(maxHeight, (pixelChar.length || 0) * (pixelSize + pixelGap) + pixelGap)
    }

    setDimensions({ width: totalWidth, height: maxHeight })

    // 设置画布尺寸
    const canvas = canvasRef.current
    canvas.width = totalWidth
    canvas.height = maxHeight

    // 初始渲染
    renderText()
    setIsInitialized(true)
  }, [text, size, pixelSize, pixelGap])

  // 确保组件挂载后渲染文本
  useEffect(() => {
    if (isInitialized) {
      renderText()
    }
  }, [isInitialized, currentTheme])

  // 渲染像素文本
  const renderText = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let xOffset = 0

    // 绘制每个字符
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const pixelChar = getCustomPixelChar(char) || defaultChar

      for (let y = 0; y < pixelChar.length; y++) {
        for (let x = 0; x < pixelChar[y].length; x++) {
          if (pixelChar[y][x] === 1) {
            const pixelX = xOffset + x * (pixelSize + pixelGap) + pixelGap
            const pixelY = y * (pixelSize + pixelGap) + pixelGap

            // 使用主题颜色
            ctx.fillStyle = currentTheme.text

            ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize)
          }
        }
      }

      // 移动到下一个字符位置
      const charWidth = (pixelChar[0]?.length || 0) * (pixelSize + pixelGap) + pixelGap
      xOffset += charWidth
    }
  }

  // 窗口大小变化时重新渲染
  useEffect(() => {
    const handleResize = () => {
      renderText()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className={className}>
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="mx-auto" />
    </div>
  )
}

export default CustomPixelText
