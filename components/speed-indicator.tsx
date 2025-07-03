"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "@/contexts/theme-context"

type SpeedIndicatorProps = {
  speedLevel: number
  maxSpeedLevel: number
  isManualMode: boolean
}

const SpeedIndicator: React.FC<SpeedIndicatorProps> = ({ speedLevel, maxSpeedLevel, isManualMode }) => {
  const { currentTheme } = useTheme()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 如果不是手动模式或不在客户端，不显示速度指示器
  if (!isManualMode || !isClient) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-black bg-opacity-50 p-3 rounded-lg">
      <div className="flex flex-col items-center">
        <div className="text-sm font-dotgothic16 mb-1">スピード</div>
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold">{speedLevel}</div>
          <div className="text-xs">/ {maxSpeedLevel}</div>
        </div>

        {/* 速度等级条 */}
        <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(speedLevel / maxSpeedLevel) * 100}%`,
              backgroundColor: getSpeedColor(speedLevel, maxSpeedLevel),
            }}
          />
        </div>

        {/* 速度等级标签 */}
        <div className="w-full flex justify-between mt-1">
          <span className="text-xs">L</span>
          <span className="text-xs">H</span>
        </div>
      </div>
    </div>
  )
}

// 根据速度等级获取颜色
const getSpeedColor = (level: number, maxLevel: number): string => {
  // 从绿色渐变到红色
  if (level <= maxLevel * 0.3) {
    return "#4ade80" // 绿色
  } else if (level <= maxLevel * 0.6) {
    return "#facc15" // 黄色
  } else if (level <= maxLevel * 0.9) {
    return "#fb923c" // 橙色
  } else {
    return "#ef4444" // 红色
  }
}

export default SpeedIndicator
