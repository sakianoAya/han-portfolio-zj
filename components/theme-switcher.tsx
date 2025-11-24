"use client"

import type React from "react"
import { Palette } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, nextTheme } = useTheme()

  return (
    <button
      onClick={nextTheme}
      className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
      title={`Current theme: ${currentTheme.name}. Click to change.`}
    >
      <Palette size={20} />
    </button>
  )
}

export default ThemeSwitcher
