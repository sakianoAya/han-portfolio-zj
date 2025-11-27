"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { PixelBox } from "@/components/pixel-box"
import PixelText from "@/components/pixel-text"
import FallbackText from "@/components/fallback-text"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { TechTag } from "@/components/tech-tag"

type ImageComparison = {
  title: string
  description: string
  beforeImage: string
  afterImage: string
  enableComparison: boolean // true = before/after slider, false = single image only
}

const SECTION_TITLE = "Image"
const DEFAULT_DESCRIPTION =
  "趣味で制作した自主作品で、LightroomとPhotoshopを活用した高度な画像編集・レタッチスキルを公開しています。この作品群では、Lightroomの現像機能による色彩調整や雰囲気作り、そしてPhotoshopを用いたより詳細な合成・修正作業を組み合わせています。写真の持つ魅力を最大限に引き出し、新たな表現を追求したポートフォリオです。"

export default function ImageComparisonSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(4 / 3)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const imageComparisons: ImageComparison[] = [
    {
      title: "修圖作品 5",
      description: "網上のチュートリアルを参考に作成した3Dモデルを、2026年3月に開催予定の未来創造展に出展します。",
      beforeImage: "/images/blender.png",
      afterImage: "/images/blender.png",
      enableComparison: false, // Single image only (no comparison)
    },
    {
      title: "修圖作品 4",
      description: "AIを活用して加筆修正した作品です。元カノをイメージのモデルとし、これをLive2Dと融合させてウェブサイトを制作しました。この作品で学内人気賞を受賞しました。",
      beforeImage: "/images/sieru.png",
      afterImage: "/images/sieru.png",
      enableComparison: false, // Single image only (no comparison)
    },
    {
      title: "修圖作品 3",
      description: "AIを活用して加筆修正した作品です",
      beforeImage: "/images//firework.png",
      afterImage: "/images//firework.png",
      enableComparison: false, // Single image only (no comparison)
    },
    {
      title: "修圖作品 1",
      description: "最近、Lightroomでの色調補正を試しています。日本の青を際立たせるような効果（トウキョウブルー・エフェクト）がとても好きで、次の旅行でそのような写真を撮ろうかと考えています。",
      beforeImage: "/images/fix_old2.jpg",
      afterImage: "/images/fix_new2.jpg",
      enableComparison: true, // Enable before/after comparison
    },
    {
      title: "修圖作品 2",
      description: "これはLightroomでの練習作品です。主な練習の目的は、絵画のように美しい肌の質感を表現することです。",
      beforeImage: "/images/fix_old1.jpg",
      afterImage: "/images/fix_new1.jpg",
      enableComparison: true, // Enable before/after comparison
    },
    
    {
      title: "修圖作品 5",
      description: "AIを活用して加筆修正した作品です。spine2Dでアニメーション化し、ウェブサイトに組み込みました。",
      beforeImage: "/images/pinkbunny.png",
      afterImage: "/images/pinkbunny.png",
      enableComparison: false, // Single image only (no comparison)
    },
  ]

  const currentWork = imageComparisons[currentIndex]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageComparisons.length)
    setSliderPosition(50)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageComparisons.length) % imageComparisons.length)
    setSliderPosition(50)
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const ratio = img.naturalWidth / img.naturalHeight
    setImageAspectRatio(ratio)
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 2))
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 2))
    }
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging])

  useEffect(() => {
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener("keydown", handleKeyDown)
      return () => {
        slider.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [])

  return (
    <section className="mb-32">
      <div className="max-w-4xl mx-auto">
        <PixelBox className="p-6 md:p-8">
          {currentWork.enableComparison ? (
            <div
              ref={containerRef}
              className="relative w-full bg-gray-900 rounded-lg overflow-hidden mb-6 select-none border border-gray-700"
              style={{
                aspectRatio: imageAspectRatio,
                maxHeight: "600px",
              }}
            >
              <Image
                src={currentWork.afterImage || "/placeholder.svg"}
                alt={`${currentWork.title} - 修圖後`}
                fill
                className="object-contain"
                draggable="false"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                onLoad={handleImageLoad}
              />

              <div
                className="absolute inset-0 w-full h-full z-10"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
              >
                <Image
                  src={currentWork.beforeImage || "/placeholder.svg"}
                  alt={`${currentWork.title} - 修圖前`}
                  fill
                  className="object-contain"
                  draggable="false"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>

              <div
                ref={sliderRef}
                className="absolute top-0 bottom-0 w-1 bg-white cursor-grab active:cursor-grabbing z-20"
                style={{
                  left: `${sliderPosition}%`,
                  transform: "translateX(-50%)",
                  filter: "drop-shadow(2px 0 3px rgba(0, 0, 0, 0.4))",
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                tabIndex={0}
                role="slider"
                aria-valuenow={sliderPosition}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="圖片比較滑塊"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-900"
                  >
                    <path d="m18 8 4 4-4 4" />
                    <path d="m6 8-4 4 4 4" />
                  </svg>
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-xs font-dotgothic16 text-white pointer-events-none">
                Before
              </div>
              <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded text-xs font-dotgothic16 text-white pointer-events-none">
                After
              </div>
            </div>
          ) : (
            <div
              className="relative w-full bg-gray-900 rounded-lg overflow-hidden mb-6 border border-gray-700"
              style={{
                aspectRatio: imageAspectRatio,
                maxHeight: "600px",
              }}
            >
              <Image
                src={currentWork.afterImage || "/placeholder.svg"}
                alt={currentWork.title}
                fill
                className="object-contain"
                draggable="false"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                onLoad={handleImageLoad}
              />
            </div>
          )}

          <div className="mb-6">
            {isClient ? (
              <PixelText
                text={SECTION_TITLE}
                size="medium"
                letterSpacing="normal"
                className="mb-2"
                wordGroups={[[0, 1, 2, 3, 4]]}
              />
            ) : (
              <FallbackText text={SECTION_TITLE} className="mb-2 text-xl font-bold" />
            )}

            <p className="font-dotgothic16 mb-4 text-gray-300 text-base leading-relaxed">
              {currentWork.description || DEFAULT_DESCRIPTION}
            </p>

            <div className="flex gap-2 items-center mb-4 flex-wrap">
              <span className="text-sm font-dotgothic16">技術: </span>
              <TechTag tech="Lightroom" />
              <TechTag tech="Photoshop" />
              <TechTag tech="Clip" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={prevImage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors relative z-30"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">前へ</span>
            </button>

            <div className="flex gap-2">
              {imageComparisons.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setSliderPosition(50)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-white w-8" : "bg-gray-600 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextImage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors relative z-30"
              aria-label="Next image"
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
