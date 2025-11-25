"use client"

import { useState, useEffect } from "react"
import { PixelBox } from "@/components/pixel-box"
import PixelText from "@/components/pixel-text"
import FallbackText from "@/components/fallback-text"
import { ChevronLeft, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import { TechTag } from "@/components/tech-tag"

// 動態導入 Lottie 組件（避免 SSR 問題）
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

interface LottieWork {
  id: string
  jsonPath: string
  thumbnail?: string
  demoUrl?: string
}

const lottieWorks: LottieWork[] = [
  {
    id: "work-1",
    jsonPath: "/lottie/animation-1.json", 
    demoUrl: "#",
  },
  {
    id: "work-2",
    jsonPath: "/lottie/data1-1.json",
    demoUrl: "#",
  },
  {
    id: "work-3",
    jsonPath: "/lottie/data1-2.json",
    demoUrl: "#",
  },
  {
    id: "work-4",
    jsonPath: "/lottie/data2-1.json",
    demoUrl: "#",
  },
  {
    id: "work-5",
    jsonPath: "/lottie/data2-2.json",
    demoUrl: "#",
  },
  {
    id: "work-6",
    jsonPath: "/lottie/data3-1.json",
    demoUrl: "#",
  },
  {
    id: "work-7",
    jsonPath: "/lottie/data3-2.json",
    demoUrl: "#",
  },
  {
    id: "work-8",
    jsonPath: "/lottie/data4-1.json",
    demoUrl: "#",
  },
  {
    id: "work-9",
    jsonPath: "/lottie/data4-2.json",
    demoUrl: "#",
  },
  {
    id: "work-10",
    jsonPath: "/lottie/data5-1.json",
    demoUrl: "#",
  },
  {
    id: "work-11",
    jsonPath: "/lottie/data5-2.json",
    demoUrl: "#",
  },
  {
    id: "work-12",
    jsonPath: "/lottie/data6-1.json",
    demoUrl: "#",
  },
  {
    id: "work-13",
    jsonPath: "/lottie/data6-2.json",
    demoUrl: "#",
  },
  {
    id: "work-14",
    jsonPath: "/lottie/data7-1.json",
    demoUrl: "#",
  },
  {
    id: "work-15",
    jsonPath: "/lottie/data7-2.json",
    demoUrl: "#",
  },
];

const DEFAULT_PROJECT_TITLE = "Lottie Animation"
const DEFAULT_PROJECT_DESCRIPTION =
  "Macgo製品ウェブサイト向け、クライアントワーク向けとして制作した、ベクターアニメーションです。Spineアニメーションの経験を応用し、Illustratorで作成した素材をAfter EffectsでLottie化。ウェブサイトでのスムーズな動作と、高いデザイン性を両立させた高品質なアニメーションを提供しました。"

export default function LottieShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [animationData, setAnimationData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 載入 Lottie JSON
  useEffect(() => {
    if (!isClient || lottieWorks.length === 0) return

    const loadAnimation = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(lottieWorks[currentIndex].jsonPath)

        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON. Please check if the file exists.")
        }

        const data = await response.json()
        setAnimationData(data)
        setError(null)
      } catch (error) {
        console.error("Failed to load Lottie animation:", error)
        setAnimationData(null)
        setError("アニメーションファイルが見つかりません")
      } finally {
        setLoading(false)
      }
    }

    loadAnimation()
  }, [currentIndex, isClient])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? lottieWorks.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === lottieWorks.length - 1 ? 0 : prev + 1))
  }

  const currentWork = lottieWorks[currentIndex]
  const displayTitle = DEFAULT_PROJECT_TITLE
  const displayDescription = DEFAULT_PROJECT_DESCRIPTION

  if (lottieWorks.length === 0) {
    return (
      <section id="lottie-works" className="mb-32">
        {isClient ? (
          <PixelText
            text="LOTTIE ANIMATION"
            size="large"
            letterSpacing="wide"
            className="mb-8 sm:mb-16 text-center w-full px-2"
            wordGroups={[
              [0, 1, 2, 3, 4, 5],
              [7, 8, 9, 10, 11, 12, 13, 14, 15],
            ]}
          />
        ) : (
          <FallbackText text="LOTTIE WORKS" className="mb-8 sm:mb-16 text-center text-3xl sm:text-4xl font-bold" />
        )}

        <div className="max-w-4xl mx-auto">
          <PixelBox className="p-6 md:p-8">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500 font-dotgothic16">
                <p className="text-lg mb-2">Lottie作品を追加してください</p>
                <p className="text-sm">public/lottie/ にJSONファイルを配置し、</p>
                <p className="text-sm">lottieWorks配列を更新してください</p>
              </div>
            </div>
          </PixelBox>
        </div>
      </section>
    )
  }

  return (
    <section id="lottie-works" className="mb-32">
      <div className="max-w-4xl mx-auto">
        <PixelBox className="p-6 md:p-8">
          {/* Lottie 動畫顯示區域 */}
          <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
            {loading && <div className="text-gray-500 font-dotgothic16">読み込み中...</div>}

            {error && !loading && (
              <div className="text-red-500 font-dotgothic16 text-center px-4">
                <p className="mb-2">{error}</p>
                <p className="text-sm text-gray-400">JSONファイルを確認してください</p>
              </div>
            )}

            {!loading && !error && isClient && animationData && (
              <Lottie animationData={animationData} loop={true} autoplay={true} className="w-full h-full" />
            )}
          </div>

          <div className="mb-6">
            {isClient ? (
              <PixelText
                text={displayTitle}
                size="medium"
                letterSpacing="normal"
                className="mb-2"
                wordGroups={[
                  [0, 1, 2, 3, 4, 5],
                  [7, 8, 9, 10, 11, 12, 13, 14],
                ]}
              />
            ) : (
              <FallbackText text={displayTitle} className="mb-2 text-xl font-bold" />
            )}

            <p className="font-dotgothic16 mb-4 text-gray-300 text-base leading-relaxed">{displayDescription}</p>

            {currentWork.demoUrl && (
              <div className="mb-4">
                <a
                  href="http://test.macgo.cn/index"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 rounded-lg font-dotgothic16 hover:bg-white hover:text-black transition-colors relative z-30 text-sm"
                >
                  <span>DEMO</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            )}

            <div className="flex gap-2 items-center mb-4 flex-wrap">
              <span className="text-sm font-dotgothic16">技術: </span>
              <TechTag tech="Illustrator" />
              <TechTag tech="After Effects" />
              <TechTag tech="Lottie" />
            </div>
          </div>

          {/* 導航控制 */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors relative z-30"
              aria-label="Previous animation"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">前へ</span>
            </button>

            {/* 進度指示器 */}
            <div className="flex gap-2">
              {lottieWorks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-white w-8" : "bg-gray-600 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to animation ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors relative z-30"
              aria-label="Next animation"
            >
              <span className="hidden sm:inline">次へ</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </PixelBox>
      </div>
    </section>
  )
}
