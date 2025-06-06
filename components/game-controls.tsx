"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MousePointer, Bot } from "lucide-react"
import ThemeSwitcher from "./theme-switcher"

type GameControlsProps = {
  autoMode: boolean
  setAutoMode: (mode: boolean) => void
}

const GameControls: React.FC<GameControlsProps> = ({ autoMode, setAutoMode }) => {
  const [localAutoMode, setLocalAutoMode] = useState(autoMode)

  // 同步本地狀態和 props
  useEffect(() => {
    setLocalAutoMode(autoMode)
  }, [autoMode])

  // 手動/自動模式切換處理函數
  const handleModeToggle = () => {
    // 更新本地狀態
    const newMode = !localAutoMode
    setLocalAutoMode(newMode)

    // 調用父組件的設置函數
    console.log("Setting autoMode to:", newMode)
    setAutoMode(newMode)
  }

  return (
    <div className="flex flex-col gap-2">
      <ThemeSwitcher />

      <button
        onClick={handleModeToggle}
        className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
        title={localAutoMode ? "切換到手動控制" : "切換到自動控制"}
        aria-label={localAutoMode ? "切換到手動控制" : "切換到自動控制"}
      >
        {localAutoMode ? <MousePointer size={20} /> : <Bot size={20} />}
      </button>
    </div>
  )
}

export default GameControls
