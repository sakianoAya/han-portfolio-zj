"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// ===== 颜色主题定义 =====
// 这里定义了所有颜色主题，包括背景色、文字色和碰撞后的颜色

// 定義不同的配色主題
export type ColorTheme = {
  name: string
  background: string // 背景颜色
  text: string // 文字颜色
  boxBackground: string
  boxBorder: string
  paddleColor: string
  ballColor: string
  hitColors: string[] // 碰撞后的颜色数组
}

// 經典8-bit配色方案
export const colorThemes: ColorTheme[] = [
  {
    name: "Classic",
    background: "#000000", // 背景颜色
    text: "#FFFFFF", // 文字颜色
    boxBackground: "#111111",
    boxBorder: "#333333",
    paddleColor: "#FFFFFF",
    ballColor: "#FFFFFF",
    hitColors: ["#FFFF00"], // 碰撞后的颜色 - 黃色
  },
  {
    name: "Gameboy",
    background: "#0F380F", // 背景颜色
    text: "#9BBC0F", // 文字颜色
    boxBackground: "#306230",
    boxBorder: "#8BAC0F",
    paddleColor: "#9BBC0F",
    ballColor: "#9BBC0F",
    hitColors: ["#8BAC0F", "#306230", "#0F380F"], // 碰撞后的颜色 - 不同深淺的綠色
  },
  {
    name: "CGA",
    background: "#000000", // 背景颜色
    text: "#55FFFF", // 文字颜色
    boxBackground: "#000000",
    boxBorder: "#55FFFF",
    paddleColor: "#FF55FF",
    ballColor: "#FFFFFF",
    hitColors: ["#FF55FF", "#55FFFF"], // 碰撞后的颜色 - 青色和洋紅色
  },
  {
    name: "NES",
    background: "#000000", // 背景颜色
    text: "#FFFFFF", // 文字颜色
    boxBackground: "#0000FF",
    boxBorder: "#FF0000",
    paddleColor: "#FF0000",
    ballColor: "#FFFFFF",
    hitColors: ["#FF0000", "#FFFF00", "#00FF00"], // 碰撞后的颜色 - 紅、黃、綠
  },
  {
    name: "Commodore 64",
    background: "#4040E0", // 背景颜色
    text: "#FFFFFF", // 文字颜色
    boxBackground: "#4040E0",
    boxBorder: "#7070FF",
    paddleColor: "#7070FF",
    ballColor: "#FFFFFF",
    hitColors: ["#7070FF", "#FFFFFF", "#A0A0FF"], // 碰撞后的颜色 - 不同深淺的藍色和白色
  },
]

type ThemeContextType = {
  currentTheme: ColorTheme
  setThemeByName: (name: string) => void
  nextTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const currentTheme = colorThemes[currentThemeIndex]

  // 根據主題名稱設置主題
  const setThemeByName = (name: string) => {
    const index = colorThemes.findIndex((theme) => theme.name === name)
    if (index !== -1) {
      setCurrentThemeIndex(index)
    }
  }

  // 切換到下一個主題
  const nextTheme = () => {
    setCurrentThemeIndex((prevIndex) => (prevIndex + 1) % colorThemes.length)
  }

  // 當主題變化時，更新CSS變量
  useEffect(() => {
    if (typeof document !== "undefined") {
      // ===== 应用主题颜色到CSS变量 =====
      document.documentElement.style.setProperty("--theme-background", currentTheme.background)
      document.documentElement.style.setProperty("--theme-text", currentTheme.text)
      document.documentElement.style.setProperty("--theme-box-bg", currentTheme.boxBackground)
      document.documentElement.style.setProperty("--theme-box-border", currentTheme.boxBorder)
      document.documentElement.style.setProperty("--theme-paddle", currentTheme.paddleColor)
      document.documentElement.style.setProperty("--theme-ball", currentTheme.ballColor)
    }
  }, [currentTheme])

  return <ThemeContext.Provider value={{ currentTheme, setThemeByName, nextTheme }}>{children}</ThemeContext.Provider>
}

// 自定義Hook，用於在組件中使用主題
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
