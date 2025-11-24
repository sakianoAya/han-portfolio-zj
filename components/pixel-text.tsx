"use client"

import type React from "react"

import { useRef, useEffect, useState, useMemo, useCallback } from "react"
import { getPixelChar } from "@/lib/pixel-characters"
import { useTheme } from "@/contexts/theme-context"

type PixelTextProps = {
  text: string
  size?: "small" | "medium" | "large"
  className?: string
  letterSpacing?: "normal" | "wide" | "wider" // 添加字母间距选项
  wordGroups?: number[][] // 单词分组，每个数组包含属于同一个单词的字母索引
}

// 字母碰撞状态类型，包含闪烁动画所需的信息
type CharacterHitState = {
  color: string // 碰撞颜色
  timestamp: number // 碰撞时间戳
  isBlinking: boolean // 是否正在闪烁
  blinkPhase: number // 闪烁阶段 (0-1)
  blinkSpeed: number // 闪烁速度
  wordIndex: number // 所属单词的索引
}

// Default character for unknown characters
const defaultChar = [
  [1, 1, 1, 1],
  [1, 0, 0, 1],
  [1, 0, 0, 1],
  [1, 0, 0, 1],
  [1, 1, 1, 1],
]

const PixelText: React.FC<PixelTextProps> = ({
  text,
  size = "medium",
  className = "",
  letterSpacing = "normal", // 默认为正常间距
  wordGroups, // 单词分组
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // 修改状态结构，包含闪烁动画所需的信息
  const [hitCharacters, setHitCharacters] = useState<Record<number, CharacterHitState>>({})
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isInitialized, setIsInitialized] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { currentTheme } = useTheme()

  // 跟踪已完成的单词
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set())

  // 跟踪单词中已击中的字符
  const hitCharactersInWord = useRef<Record<number, Set<number>>>({})

  // 动画帧请求引用
  const animationFrameRef = useRef<number>()

  // 如果没有提供wordGroups，自动根据空格分割文本
  const effectiveWordGroups = useRef<number[][]>([])

  // 调试信息
  const debugInfo = useRef({
    lastWordCheck: -1,
    lastWordComplete: false,
  })

  // 添加一个新的 useEffect 来监听窗口大小变化并重新计算尺寸
  const renderTimeoutRef = useRef<NodeJS.Timeout>()

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (wordGroups) {
      effectiveWordGroups.current = wordGroups
    } else {
      const groups: number[][] = []
      let currentGroup: number[] = []

      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          if (currentGroup.length > 0) {
            groups.push([...currentGroup])
            currentGroup = []
          }
        } else {
          currentGroup.push(i)
        }
      }

      if (currentGroup.length > 0) {
        groups.push(currentGroup)
      }

      effectiveWordGroups.current = groups
    }

    // 初始化单词字符跟踪
    hitCharactersInWord.current = {}
    effectiveWordGroups.current.forEach((word, index) => {
      hitCharactersInWord.current[index] = new Set()
    })

    console.log("Word groups initialized:", effectiveWordGroups.current)
  }, [text, wordGroups])

  // ===== 像素大小设置 =====
  // 根据size属性确定像素大小
  const pixelSize = useMemo(() => {
    if (!isClient) return 5

    const windowWidth = window.innerWidth

    if (windowWidth < 640) {
      switch (size) {
        case "small":
          return 1.5 // 增加小字体的像素大小
        case "large":
          return 4 // 增加大字体的像素大小
        default:
          return 2.5 // 增加中等大小
      }
    } else if (windowWidth < 768) {
      // 中小屏幕
      switch (size) {
        case "small":
          return 2
        case "large":
          return 5
        default:
          return 3.5
      }
    } else {
      // 正常或大屏幕
      switch (size) {
        case "small":
          return 2.5
        case "large":
          return 7 // 增加大字体的像素大小
        default:
          return 5 // 增加中等大小
      }
    }
  }, [isClient, size])

  const pixelGap = useMemo(
    () => Math.max(1, pixelSize / (isClient && window.innerWidth < 640 ? 6 : 4)),
    [pixelSize, isClient],
  )

  // 根据letterSpacing属性确定字符间距
  const letterSpacingFactor = useMemo(() => {
    const windowWidth = isClient ? window.innerWidth : 1024

    let baseSpacing = 1

    // 根据letterSpacing属性调整间距
    switch (letterSpacing) {
      case "wide":
        baseSpacing = 1.3 // 宽间距
        break
      case "wider":
        baseSpacing = 1.6 // 更宽间距
        break
      default:
        baseSpacing = 1.1 // 正常间距，稍微增加
    }

    // 在小屏幕上适当减小间距
    if (windowWidth < 640) {
      return baseSpacing * 0.9
    }

    return baseSpacing
  }, [isClient, letterSpacing])

  // ===== 计算画布尺寸 =====
  // 根据文本内容计算所需的画布尺寸
  const calculateDimensions = useCallback(() => {
    let totalWidth = 0
    let maxHeight = 0

    // Calculate the width and height needed for the text
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const pixelChar = getPixelChar(char) || defaultChar

      totalWidth += (pixelChar[0]?.length || 0) * (pixelSize + pixelGap) + pixelGap
      maxHeight = Math.max(maxHeight, (pixelChar.length || 0) * (pixelSize + pixelGap) + pixelGap)
    }

    // 应用字母间距因子
    totalWidth = totalWidth * letterSpacingFactor

    return { width: totalWidth, height: maxHeight }
  }, [text, pixelSize, pixelGap, letterSpacingFactor])

  // ===== 像素文本渲染核心函数 =====
  // 在画布上渲染像素文本
  const renderText = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !isClient) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let xOffset = 0

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const pixelChar = getPixelChar(char) || defaultChar

      // 检查这个字符是否被击中
      const charState = hitCharacters[i]
      let charColor = currentTheme.text

      if (charState) {
        if (charState.isBlinking) {
          // 闪烁效果 - 在原始颜色和碰撞颜色之间交替
          const blinkValue = Math.sin(charState.blinkPhase * Math.PI * 2) * 0.5 + 0.5

          // 使用HSL颜色插值来创建更平滑的闪烁效果
          const originalColor = currentTheme.text
          const hitColor = charState.color

          // 简单的颜色混合，在实际应用中可能需要更复杂的颜色插值
          if (blinkValue > 0.5) {
            charColor = hitColor
          } else {
            charColor = originalColor
          }
        } else {
          charColor = charState.color
        }
      }

      for (let y = 0; y < pixelChar.length; y++) {
        for (let x = 0; x < pixelChar[y].length; x++) {
          if (pixelChar[y][x] === 1) {
            const pixelX = xOffset + x * (pixelSize + pixelGap) + pixelGap
            const pixelY = y * (pixelSize + pixelGap) + pixelGap

            // 使用字符的颜色（被击中或默认）
            ctx.fillStyle = charColor

            ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize)
          }
        }
      }

      // Move to the next character position with adjusted spacing
      const charWidth = (pixelChar[0]?.length || 0) * (pixelSize + pixelGap) + pixelGap
      xOffset += charWidth * letterSpacingFactor // 应用字符间距调整
    }
  }, [text, pixelSize, pixelGap, letterSpacingFactor, hitCharacters, currentTheme, isClient])

  // 组合所有尺寸和渲染逻辑到一个effect中
  useEffect(() => {
    if (!canvasRef.current || !isClient) return

    const dims = calculateDimensions()
    setDimensions(dims)

    const canvas = canvasRef.current
    canvas.width = dims.width
    canvas.height = dims.height

    renderText()
    setIsInitialized(true)
  }, [text, size, pixelSize, pixelGap, letterSpacing, isClient, calculateDimensions, renderText])

  useEffect(() => {
    if (isInitialized && isClient) {
      renderText()
    }
  }, [isInitialized, currentTheme, isClient, renderText])

  useEffect(() => {
    if (isClient) {
      renderText()
    }
  }, [hitCharacters, currentTheme, isClient, renderText])

  // 优化的resize处理程序，防止过度计算
  useEffect(() => {
    if (!isClient) return

    const handleResize = () => {
      // 清除任何待处理的渲染
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }

      // 防抖渲染，避免过度调用
      renderTimeoutRef.current = setTimeout(() => {
        const dims = calculateDimensions()

        if (canvasRef.current) {
          const canvas = canvasRef.current
          canvas.width = dims.width
          canvas.height = dims.height
          renderText()
        }
      }, 150) // 150ms防抖
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }
    }
  }, [isClient, calculateDimensions, renderText])

  // ===== 碰撞检测和颜色变化 =====
  // 注册组件进行碰撞检测
  useEffect(() => {
    if (!canvasRef.current || !isClient) return

    // Add this component to the global registry for collision detection
    const canvas = canvasRef.current

    // Function to check if a point is inside a pixel
    const checkCollision = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect()
      const canvasX = x - rect.left
      const canvasY = y - rect.top

      // Check if the point is inside the canvas
      if (canvasX < 0 || canvasX >= canvas.width || canvasY < 0 || canvasY >= canvas.height) {
        return false
      }

      // Find which character and pixel was hit
      let xOffset = 0

      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const pixelChar = getPixelChar(char) || defaultChar
        let charHit = false

        for (let y = 0; y < pixelChar.length; y++) {
          for (let x = 0; x < pixelChar[y].length; x++) {
            if (pixelChar[y][x] === 1) {
              const pixelX = xOffset + x * (pixelSize + pixelGap) + pixelGap
              const pixelY = y * (pixelSize + pixelGap) + pixelGap

              // Check if the point is inside this pixel
              if (
                canvasX >= pixelX &&
                canvasX < pixelX + pixelSize &&
                canvasY >= pixelY &&
                canvasY < pixelY + pixelSize
              ) {
                charHit = true
                break
              }
            }
          }
          if (charHit) break
        }

        // 如果这个字符被击中且之前没有被标记为击中
        if (charHit && !hitCharacters[i]) {
          // 从主题的碰撞颜色数组中选择一个颜色
          const colorIndex = i % currentTheme.hitColors.length
          const color = currentTheme.hitColors[colorIndex]

          // 查找字符所属的单词
          const wordIndex = findWordIndex(i)

          console.log(`Character ${i} (${text[i]}) hit, belongs to word ${wordIndex}`)

          // 标记字符为被击中，但不立即闪烁
          setHitCharacters((prev) => ({
            ...prev,
            [i]: {
              color: color,
              timestamp: Date.now(),
              isBlinking: false, // 初始不闪烁
              blinkPhase: 0,
              blinkSpeed: 0.05 + Math.random() * 0.05,
              wordIndex: wordIndex,
            },
          }))

          // 检查单词是否完成
          if (wordIndex >= 0) {
            checkWordCompletion(i, wordIndex)
          }

          return true
        }

        // Move to the next character position with adjusted spacing
        const charWidth = (pixelChar[0]?.length || 0) * (pixelSize + pixelGap) + pixelGap
        xOffset += charWidth * letterSpacingFactor
      }

      return false
    }

    const handlePixelCollision = ((e: CustomEvent) => {
      const { x, y } = e.detail
      checkCollision(x, y)
    }) as EventListener

    window.addEventListener("pixel-collision", handlePixelCollision)

    return () => {
      window.removeEventListener("pixel-collision", handlePixelCollision)
    }
  }, [text, hitCharacters, currentTheme, pixelSize, pixelGap, letterSpacingFactor, isClient])

  // 在组件卸载时清理动画
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      // 清理渲染超时
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }
    }
  }, [])

  // 添加一个效果，在5秒后停止闪烁
  useEffect(() => {
    if (!isClient) return

    // 设置一个定时器，在闪烁5秒后停止
    const blinkTimeout = setTimeout(() => {
      setHitCharacters((prev) => {
        const now = Date.now()
        const updated = { ...prev }
        let changed = false

        Object.keys(updated).forEach((key) => {
          const index = Number.parseInt(key)
          const charState = updated[index]

          // 如果闪烁已经持续了5秒，停止闪烁
          if (charState.isBlinking && now - charState.timestamp > 5000) {
            charState.isBlinking = false
            changed = true
          }
        })

        return changed ? updated : prev
      })
    }, 500) // 每500ms检查一次

    return () => {
      clearTimeout(blinkTimeout)
    }
  }, [hitCharacters, isClient])

  // 查找字符所属的单词索引
  const findWordIndex = (charIndex: number): number => {
    for (let i = 0; i < effectiveWordGroups.current.length; i++) {
      if (effectiveWordGroups.current[i].includes(charIndex)) {
        return i
      }
    }
    return -1 // 不属于任何单词
  }

  // 检查单词是否完成
  const checkWordCompletion = (charIndex: number, wordIndex: number) => {
    // 如果单词已经完成，不需要再检查
    if (completedWords.has(wordIndex)) {
      return false
    }

    // 添加字符到已击中集合
    if (!hitCharactersInWord.current[wordIndex]) {
      hitCharactersInWord.current[wordIndex] = new Set()
    }
    hitCharactersInWord.current[wordIndex].add(charIndex)

    const wordChars = effectiveWordGroups.current[wordIndex]

    // 检查单词中的所有字符是否都被击中
    const allHit = wordChars.every((index) => hitCharactersInWord.current[wordIndex].has(index))

    debugInfo.current.lastWordCheck = wordIndex
    debugInfo.current.lastWordComplete = allHit

    console.log(
      `Word ${wordIndex} check: ${allHit ? "COMPLETE" : "incomplete"} (${hitCharactersInWord.current[wordIndex].size}/${wordChars.length} chars hit)`,
    )

    if (allHit) {
      console.log(`Word ${wordIndex} is complete! Starting blink animation.`)

      // 标记单词为完成
      setCompletedWords((prev) => {
        const updated = new Set(prev)
        updated.add(wordIndex)
        return updated
      })

      // 为单词中的所有字符添加闪烁效果
      setHitCharacters((prev) => {
        const updated = { ...prev }
        const now = Date.now()

        wordChars.forEach((index) => {
          // 确保字符已经被标记为击中
          if (updated[index]) {
            updated[index] = {
              ...updated[index],
              isBlinking: true,
              blinkPhase: 0,
              blinkSpeed: 0.05 + Math.random() * 0.05,
              timestamp: now,
            }
          }
        })

        return updated
      })

      // 启动闪烁动画
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateBlinkAnimation)
      }

      return true
    }

    return false
  }

  // 闪烁动画更新函数
  const updateBlinkAnimation = () => {
    let needsUpdate = false

    // 更新每个字符的闪烁状态
    setHitCharacters((prev) => {
      const updated = { ...prev }

      Object.keys(updated).forEach((key) => {
        const index = Number.parseInt(key)
        const charState = updated[index]

        if (charState.isBlinking) {
          // 更新闪烁阶段
          charState.blinkPhase = (charState.blinkPhase + charState.blinkSpeed) % 1
          needsUpdate = true
        }
      })

      return needsUpdate ? updated : prev
    })

    // 如果有字符在闪烁，继续动画循环
    if (needsUpdate) {
      renderText()
      animationFrameRef.current = requestAnimationFrame(updateBlinkAnimation)
    } else {
      animationFrameRef.current = undefined
    }
  }

  useEffect(() => {
    if (!isClient) return

    if (Object.keys(hitCharacters).length > 0 && !animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateBlinkAnimation)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
      }
    }
  }, [hitCharacters, isClient])

  // Fallback text display in case canvas doesn't render properly
  const fallbackText = (
    <div className="text-white" style={{ fontSize: `${pixelSize * 2}px` }}>
      {text}
    </div>
  )

  if (!isClient) {
    return (
      <div className={className}>
        <div className="text-white text-2xl">{text}</div>
      </div>
    )
  }

  return (
    <div className={className}>
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="mx-auto" />
      {/* Render fallback text that will be hidden if canvas works */}
      <div className="sr-only">{fallbackText}</div>
    </div>
  )
}

export default PixelText
