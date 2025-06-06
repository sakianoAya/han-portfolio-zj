"use client"

import type React from "react"
import { useTheme } from "@/contexts/theme-context"

const PauseOverlay: React.FC = () => {
  const { currentTheme } = useTheme()

  return (
    <div
      className="fixed inset-0 z-30 flex flex-col items-center justify-center"
      style={{ backgroundColor: `${currentTheme.background}99` }} // 半透明背景
    >
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block w-24 h-24 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-20 bg-white rounded-sm mx-2"></div>
              <div className="w-8 h-20 bg-white rounded-sm mx-2"></div>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-dotgothic16 mb-4" style={{ color: currentTheme.text }}>
          遊戲暫停
        </h2>

        <p className="text-xl font-dotgothic16 mb-8" style={{ color: currentTheme.text }}>
          按下暫停按鈕繼續遊戲
        </p>

        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: currentTheme.boxBackground,
              borderColor: currentTheme.boxBorder,
              borderWidth: "2px",
            }}
          >
            <h3 className="text-lg font-dotgothic16 mb-2" style={{ color: currentTheme.text }}>
              操作說明
            </h3>
            <ul className="list-disc list-inside text-sm font-dotgothic16" style={{ color: currentTheme.text }}>
              <li>使用滑鼠移動控制擋板位置</li>
              <li>點擊自動/手動按鈕切換控制模式</li>
              <li>點擊主題按鈕切換遊戲視覺風格</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PauseOverlay
