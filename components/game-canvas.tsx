"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/contexts/theme-context"

// Define types for game objects
type Ball = {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
  speed: number
  baseSpeed: number // 基础速度
  speedLevel: number // 当前速度等级
}

type Paddle = {
  x: number
  y: number
  width: number
  height: number
  position: "top" | "bottom" | "left" | "right"
  target: number
}

type GameCanvasProps = {
  autoMode: boolean
  contentRef: React.RefObject<HTMLDivElement>
  onSpeedChange?: (level: number, maxLevel: number) => void
}

const GameCanvas: React.FC<GameCanvasProps> = ({ autoMode, contentRef, onSpeedChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const [isClient, setIsClient] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { currentTheme } = useTheme()

  // 使用 ref 來跟踪當前模式，這樣在 gameLoop 中可以訪問最新值
  const autoModeRef = useRef(autoMode)
  // 使用 ref 來跟踪鼠標位置，確保在 gameLoop 中可以訪問最新值
  const mousePositionRef = useRef(mousePosition)

  // 球速度相关的自定义变量
  const speedConfig = useRef({
    initialSpeed: 5, // 初始速度
    maxSpeedLevel: 10, // 最大速度等级
    speedIncrement: 0.5, // 每级增加的速度
    maxSpeed: 10, // 最大速度限制
  })

  // 確保只在客戶端運行
  useEffect(() => {
    setIsClient(true)
    // 初始化鼠標位置
    if (typeof window !== "undefined") {
      setMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    }
  }, [])

  // 當 autoMode prop 變化時更新 ref
  useEffect(() => {
    autoModeRef.current = autoMode
    console.log("AutoMode ref updated to:", autoMode)
  }, [autoMode])

  // 當 mousePosition 變化時更新 ref
  useEffect(() => {
    mousePositionRef.current = mousePosition
  }, [mousePosition])

  // Game state
  const ballRef = useRef<Ball>({
    x: 0,
    y: 0,
    radius: 8,
    dx: 3,
    dy: 4,
    speed: speedConfig.current.initialSpeed,
    baseSpeed: speedConfig.current.initialSpeed,
    speedLevel: 0,
  })

  const paddlesRef = useRef<Paddle[]>([])

  // 通知父组件速度变化
  const notifySpeedChange = () => {
    if (onSpeedChange) {
      onSpeedChange(ballRef.current.speedLevel, speedConfig.current.maxSpeedLevel)
    }
  }

  // Initialize game
  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas to full window size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Initialize ball in the center
    const ball = ballRef.current
    ball.x = canvas.width / 2
    ball.y = canvas.height / 2

    // Initialize paddles
    const paddleThickness = 10
    const paddleLength = 100

    paddlesRef.current = [
      // Top paddle
      {
        x: canvas.width / 2 - paddleLength / 2,
        y: 0,
        width: paddleLength,
        height: paddleThickness,
        position: "top",
        target: canvas.width / 2,
      },
      // Bottom paddle
      {
        x: canvas.width / 2 - paddleLength / 2,
        y: canvas.height - paddleThickness,
        width: paddleLength,
        height: paddleThickness,
        position: "bottom",
        target: canvas.width / 2,
      },
      // Left paddle
      {
        x: 0,
        y: canvas.height / 2 - paddleLength / 2,
        width: paddleThickness,
        height: paddleLength,
        position: "left",
        target: canvas.height / 2,
      },
      // Right paddle
      {
        x: canvas.width - paddleThickness,
        y: canvas.height / 2 - paddleLength / 2,
        width: paddleThickness,
        height: paddleLength,
        position: "right",
        target: canvas.height / 2,
      },
    ]

    // 初始通知速度
    notifySpeedChange()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Update paddle positions
      paddlesRef.current.forEach((paddle) => {
        if (paddle.position === "top" || paddle.position === "bottom") {
          paddle.x = canvas.width / 2 - paddle.width / 2
          if (paddle.position === "bottom") {
            paddle.y = canvas.height - paddle.height
          }
        } else {
          paddle.y = canvas.height / 2 - paddle.height / 2
          if (paddle.position === "right") {
            paddle.x = canvas.width - paddle.width
          }
        }
      })
    }

    window.addEventListener("resize", handleResize)

    // Handle mouse movement for manual paddle control
    const handleMouseMove = (e: MouseEvent) => {
      // 更新鼠標位置狀態
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // 添加鼠標移動事件監聽器
    window.addEventListener("mousemove", handleMouseMove)

    // Start game loop
    requestRef.current = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = undefined
      }
    }
  }, [isClient])

  // Game loop
  const gameLoop = (timestamp: number) => {
    if (!isClient) {
      requestRef.current = requestAnimationFrame(gameLoop)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      requestRef.current = requestAnimationFrame(gameLoop)
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      requestRef.current = requestAnimationFrame(gameLoop)
      return
    }

    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 更新球位置
    updateBall()

    // 根據當前模式更新擋板
    if (autoModeRef.current) {
      updatePaddlesAuto()
    } else {
      updatePaddlesManual()
    }

    // 繪製遊戲對象
    drawGame(ctx)

    // 檢查碰撞
    checkCollisions()

    // 繼續遊戲循環
    requestRef.current = requestAnimationFrame(gameLoop)
  }

  // Update ball position
  const updateBall = () => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ball = ballRef.current

    // 更新位置
    ball.x += ball.dx
    ball.y += ball.dy

    // 检查与挡板的碰撞
    let paddleHit = false
    paddlesRef.current.forEach((paddle) => {
      if (checkPaddleCollision(ball, paddle)) {
        paddleHit = true
        // 根据挡板位置反转方向
        if (paddle.position === "top" || paddle.position === "bottom") {
          ball.dy = -ball.dy

          // 添加一些随机性到 x 方向
          ball.dx += (Math.random() - 0.5) * 2

          // 在手动模式下，如果是横向挡板接住了球，增加球速
          if (!autoModeRef.current && (paddle.position === "top" || paddle.position === "bottom")) {
            increaseBallSpeed()
          }
        } else {
          ball.dx = -ball.dx

          // 添加一些随机性到 y 方向
          ball.dy += (Math.random() - 0.5) * 2
        }

        // 标准化速度
        const magnitude = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)
        ball.dx = (ball.dx / magnitude) * ball.speed
        ball.dy = (ball.dy / magnitude) * ball.speed
      }
    })

    // 检查与墙壁的碰撞
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      ball.dx = -ball.dx
    }

    // 检查球是否触底或触顶（漏球）
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.dy = -ball.dy

      // 在手动模式下，如果球触底或触顶，说明漏球了，重置球速
      if (!autoModeRef.current) {
        // 检查是否真的漏球（没有被挡板接住）
        let caught = false
        paddlesRef.current.forEach((paddle) => {
          if ((paddle.position === "top" || paddle.position === "bottom") && checkBallCaught(ball, paddle)) {
            caught = true
          }
        })

        if (!caught) {
          resetBallSpeed()
        }
      }
    }
  }

  // Check for collision between ball and paddle
  const checkPaddleCollision = (ball: Ball, paddle: Paddle) => {
    // Calculate the closest point on the paddle to the ball
    const closestX = Math.max(paddle.x, Math.min(ball.x, paddle.x + paddle.width))
    const closestY = Math.max(paddle.y, Math.min(ball.y, paddle.y + paddle.height))

    // Calculate the distance between the closest point and the ball center
    const distanceX = ball.x - closestX
    const distanceY = ball.y - closestY

    // Check if the distance is less than the ball's radius
    return distanceX * distanceX + distanceY * distanceY < ball.radius * ball.radius
  }

  // 检查球是否被横向挡板接住
  const checkBallCaught = (ball: Ball, paddle: Paddle) => {
    // 只检查顶部和底部的挡板（横向挡板）
    if (paddle.position !== "top" && paddle.position !== "bottom") return false

    // 检查球是否与挡板碰撞
    const ballBottom = ball.y + ball.radius
    const ballTop = ball.y - ball.radius
    const ballLeft = ball.x - ball.radius
    const ballRight = ball.x + ball.radius

    const paddleTop = paddle.y
    const paddleBottom = paddle.y + paddle.height
    const paddleLeft = paddle.x
    const paddleRight = paddle.x + paddle.width

    // 检查球是否与挡板接触
    if (
      ((ballBottom >= paddleTop && ballBottom <= paddleBottom) || // 球底部接触挡板
        (ballTop <= paddleBottom && ballTop >= paddleTop)) && // 球顶部接触挡板
      ballRight >= paddleLeft &&
      ballLeft <= paddleRight
    ) {
      return true
    }

    return false
  }

  // 增加球速度的函数
  const increaseBallSpeed = () => {
    const ball = ballRef.current
    // 只有在手动模式下才增加速度
    if (!autoModeRef.current && ball.speedLevel < speedConfig.current.maxSpeedLevel) {
      ball.speedLevel += 1
      const newSpeed = ball.baseSpeed + ball.speedLevel * speedConfig.current.speedIncrement
      ball.speed = Math.min(newSpeed, speedConfig.current.maxSpeed)

      // 保持方向不变，只调整速度大小
      const magnitude = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)
      ball.dx = (ball.dx / magnitude) * ball.speed
      ball.dy = (ball.dy / magnitude) * ball.speed

      console.log(`Ball speed increased to level ${ball.speedLevel}, speed: ${ball.speed.toFixed(2)}`)

      // 通知速度变化
      notifySpeedChange()
    }
  }

  // 重置球速度的函数
  const resetBallSpeed = () => {
    const ball = ballRef.current
    if (!autoModeRef.current) {
      ball.speedLevel = 0
      ball.speed = ball.baseSpeed

      // 保持方向不变，只调整速度大小
      const magnitude = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)
      ball.dx = (ball.dx / magnitude) * ball.speed
      ball.dy = (ball.dy / magnitude) * ball.speed

      console.log("Ball speed reset to initial value")

      // 通知速度变化
      notifySpeedChange()
    }
  }

  // 自動模式下的擋板更新邏輯 - 完全獨立的函數
  const updatePaddlesAuto = () => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ball = ballRef.current

    paddlesRef.current.forEach((paddle) => {
      // Auto mode: predict ball position
      if (paddle.position === "top" || paddle.position === "bottom") {
        // For top and bottom paddles, track the ball's x position
        if ((paddle.position === "top" && ball.dy < 0) || (paddle.position === "bottom" && ball.dy > 0)) {
          // Calculate where the ball will intersect with the paddle's y position
          const timeToIntersect =
            paddle.position === "top"
              ? (ball.y - ball.radius - paddle.height) / -ball.dy
              : (paddle.y - ball.y - ball.radius) / ball.dy

          const intersectX = ball.x + ball.dx * timeToIntersect

          // Account for bounces off the side walls
          let targetX = intersectX
          const canvasWidth = canvas.width

          // Ensure the target is within bounds and handle wall bounces
          while (targetX < 0 || targetX > canvasWidth) {
            if (targetX < 0) targetX = -targetX
            if (targetX > canvasWidth) targetX = 2 * canvasWidth - targetX
          }

          paddle.target = targetX
        }

        // Move paddle towards target
        const paddleCenter = paddle.x + paddle.width / 2
        const moveSpeed = 5

        if (Math.abs(paddleCenter - paddle.target) > moveSpeed) {
          if (paddleCenter < paddle.target) {
            paddle.x += moveSpeed
          } else {
            paddle.x -= moveSpeed
          }
        }

        // Keep paddle within bounds
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x))
      } else {
        // For left and right paddles, track the ball's y position
        if ((paddle.position === "left" && ball.dx < 0) || (paddle.position === "right" && ball.dx > 0)) {
          // Calculate where the ball will intersect with the paddle's x position
          const timeToIntersect =
            paddle.position === "left"
              ? (ball.x - ball.radius - paddle.width) / -ball.dx
              : (paddle.x - ball.x - ball.radius) / ball.dx

          const intersectY = ball.y + ball.dy * timeToIntersect

          // Account for bounces off the top and bottom walls
          let targetY = intersectY
          const canvasHeight = canvas.height

          // Ensure the target is within bounds and handle wall bounces
          while (targetY < 0 || targetY > canvasHeight) {
            if (targetY < 0) targetY = -targetY
            if (targetY > canvasHeight) targetY = 2 * canvasHeight - targetY
          }

          paddle.target = targetY
        }

        // Move paddle towards target
        const paddleCenter = paddle.y + paddle.height / 2
        const moveSpeed = 5

        if (Math.abs(paddleCenter - paddle.target) > moveSpeed) {
          if (paddleCenter < paddle.target) {
            paddle.y += moveSpeed
          } else {
            paddle.y -= moveSpeed
          }
        }

        // Keep paddle within bounds
        paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, paddle.y))
      }
    })
  }

  // 手動模式下的擋板更新邏輯 - 完全獨立的函數
  const updatePaddlesManual = () => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    // 使用 mousePositionRef 而不是 mousePosition 狀態，確保獲取最新值
    const currentMousePosition = mousePositionRef.current

    paddlesRef.current.forEach((paddle) => {
      // 手動模式：直接設置擋板位置到鼠標位置
      if (paddle.position === "top" || paddle.position === "bottom") {
        // 水平擋板：直接設置到鼠標的 x 坐標
        const newX = currentMousePosition.x - paddle.width / 2
        paddle.x = newX

        // 確保擋板不超出邊界
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x))
      } else {
        // 垂直擋板：直接設置到鼠標的 y 坐標
        const newY = currentMousePosition.y - paddle.height / 2
        paddle.y = newY

        // 確保擋板不超出邊界
        paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, paddle.y))
      }
    })
  }

  // Draw game objects
  const drawGame = (ctx: CanvasRenderingContext2D) => {
    const ball = ballRef.current

    // ===== 绘制球体 - 使用主题中的球体颜色 =====
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = currentTheme.ballColor // 球体颜色
    ctx.fill()
    ctx.closePath()

    // ===== 绘制挡板 - 使用主题中的挡板颜色 =====
    paddlesRef.current.forEach((paddle) => {
      ctx.beginPath()
      ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height)
      ctx.fillStyle = currentTheme.paddleColor // 挡板颜色
      ctx.fill()
      ctx.closePath()
    })

    // 在手動模式下，繪製鼠標位置指示器（用於調試）
    if (!autoModeRef.current) {
      const mousePos = mousePositionRef.current
      ctx.beginPath()
      ctx.arc(mousePos.x, mousePos.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)" // 鼠标指示器颜色
      ctx.fill()
      ctx.closePath()
    }
  }

  // Check for collisions with text and boxes
  const checkCollisions = () => {
    if (!isClient) return

    const ball = ballRef.current

    // Dispatch a custom event for text collision detection
    const event = new CustomEvent("pixel-collision", {
      detail: { x: ball.x, y: ball.y },
    })

    window.dispatchEvent(event)

    // Dispatch a custom event for box collision detection
    const boxEvent = new CustomEvent("box-collision", {
      detail: { x: ball.x, y: ball.y, radius: ball.radius },
    })

    window.dispatchEvent(boxEvent)
  }

  // This effect runs when autoMode changes
  useEffect(() => {
    if (!isClient) return

    // 當模式變化時，立即更新擋板位置
    if (canvasRef.current) {
      if (!autoMode) {
        // 切換到手動模式：立即將所有擋板移動到鼠標位置
        const currentMousePosition = mousePosition

        paddlesRef.current.forEach((paddle) => {
          if (paddle.position === "top" || paddle.position === "bottom") {
            paddle.x = currentMousePosition.x - paddle.width / 2
            paddle.x = Math.max(0, Math.min(canvasRef.current!.width - paddle.width, paddle.x))
          } else {
            paddle.y = currentMousePosition.y - paddle.height / 2
            paddle.y = Math.max(0, Math.min(canvasRef.current!.height - paddle.height, paddle.y))
          }
        })
      }
    }

    // 通知速度变化
    notifySpeedChange()
  }, [autoMode, mousePosition, isClient])

  // 如果不在客戶端，不渲染canvas
  if (!isClient) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-20"
      style={{
        backgroundColor: "transparent",
        pointerEvents: "none",
      }}
    />
  )
}

export default GameCanvas
