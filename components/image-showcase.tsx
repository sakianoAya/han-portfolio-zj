"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ImageWork = {
  title: string
  description: string
  imagePath: string
}

export default function ImageShowcase() {
  const { currentTheme } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)

  const imageWorks: ImageWork[] = []

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageWorks.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageWorks.length) % imageWorks.length)
  }

  if (imageWorks.length === 0) {
    return (
      <section className="mb-32">
        <div
          style={{
            backgroundColor: currentTheme.boxBackground,
            borderColor: currentTheme.boxBorder,
          }}
          className="border-2 rounded-lg p-8 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-dotgothic16 text-center mb-4">修圖作品</h2>
          <p className="text-center font-dotgothic16 text-gray-400">
            圖片作品即將上傳...
            <br />
            請在組件中添加圖片資料
          </p>
        </div>
      </section>
    )
  }

  const currentWork = imageWorks[currentIndex]

  return (
    <section className="mb-32">
      <div
        style={{
          backgroundColor: currentTheme.boxBackground,
          borderColor: currentTheme.boxBorder,
        }}
        className="border-2 rounded-lg p-8 max-w-4xl mx-auto relative"
      >
        {/* 標題 */}
        <h2 className="text-3xl font-dotgothic16 text-center mb-8">修圖作品</h2>

        {/* 圖片展示區域 */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
          <img
            src={currentWork.imagePath || "/placeholder.svg"}
            alt={currentWork.title}
            className="w-full h-full object-contain"
          />

          {/* 左右切換按鈕 */}
          {imageWorks.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all z-10"
                aria-label="上一張圖片"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all z-10"
                aria-label="下一張圖片"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* 作品資訊 */}
        <div className="text-center">
          <h3 className="text-xl font-dotgothic16 mb-2">{currentWork.title}</h3>
          <p className="font-dotgothic16 text-gray-300">{currentWork.description}</p>
        </div>

        {/* 進度指示器 */}
        {imageWorks.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {imageWorks.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white w-8" : "bg-gray-500"
                }`}
                aria-label={`切換到第 ${index + 1} 張圖片`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
