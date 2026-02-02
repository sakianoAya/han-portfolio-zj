"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { PixelBox } from "@/components/pixel-box"
import PixelText from "@/components/pixel-text"
import FallbackText from "@/components/fallback-text"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { TechTag } from "@/components/tech-tag"

type Language = "jp" | "zh"

type ImageComparison = {
  title: string
  description: string
  beforeImage: string
  afterImage: string
  enableComparison: boolean // true = before/after slider, false = single image only
  technologies: string[]
}

const comparisonsData = {
  jp: [
    {
      title: "3Dアニメーション",
      description: "Blenderで作成した3Dアニメーション作品です。",
      beforeImage: "/assets/3d/0001-0144.mp4",
      afterImage: "/assets/3d/0001-0144.mp4",
      enableComparison: false,
      technologies: ["Blender"],
    },
    {
      title: "3Dモデル",
      description: "ネット上のチュートリアルを参考に作成した3Dモデルを、2026年3月に開催予定の未来創造展に出展します。",
      beforeImage: "/images/blender.png",
      afterImage: "/images/blender.png",
      enableComparison: false,
      technologies: ["Blender"],
    },
    {
      title: "AIレタッチ作品",
      description: "AIを活用して加筆修正した作品です。元カノをイメージのモデルとし、これをLive2Dと融合させてウェブサイトを制作しました。この作品で学内人気賞を受賞しました。",
      beforeImage: "/images/sieru.png",
      afterImage: "/images/sieru.png",
      enableComparison: false,
      technologies: ["AI", "Live2D", "Photoshop"],
    },
    {
      title: "AIレタッチ作品",
      description: "AIを活用して加筆修正した作品です",
      beforeImage: "/images//firework.png",
      afterImage: "/images//firework.png",
      enableComparison: false,
      technologies: ["AI", "Photoshop"],
    },
    {
      title: "色調補正",
      description: "最近、Lightroomでの色調補正を試しています。日本の青を際立たせるような効果（トウキョウブルー・エフェクト）がとても好きで、次の旅行でそのような写真を撮ろうかと考えています。",
      beforeImage: "/images/fix_old2.jpg",
      afterImage: "/images/fix_new2.jpg",
      enableComparison: true,
      technologies: ["Lightroom"],
    },
    {
      title: "レタッチ練習",
      description: "これはLightroomでの練習作品です。主な練習の目的は、絵画のように美しい肌の質感を表現することです。",
      beforeImage: "/images/fix_old1.jpg",
      afterImage: "/images/fix_new1.jpg",
      enableComparison: true,
      technologies: ["Lightroom"],
    },
    {
      title: "Spine2D素材",
      description: "AIを活用して加筆修正した作品です。spine2Dでアニメーション化し、ウェブサイトに組み込みました。",
      beforeImage: "/images/pinkbunny.png",
      afterImage: "/images/pinkbunny.png",
      enableComparison: false,
      technologies: ["Spine2D", "AI"],
    },
  ],
  zh: [
    {
      title: "3D 動畫",
      description: "使用 Blender 創作的 3D 動畫作品。",
      beforeImage: "/assets/3d/0001-0144.mp4",
      afterImage: "/assets/3d/0001-0144.mp4",
      enableComparison: false,
      technologies: ["Blender"],
    },
    {
      title: "3D 模型",
      description: "參考網路教學製作的 3D 模型，預計於 2026 年 3 月舉辦的未來創造展中展出。",
      beforeImage: "/images/blender.png",
      afterImage: "/images/blender.png",
      enableComparison: false,
      technologies: ["Blender"],
    },
    {
      title: "AI 修圖作品",
      description: "利用 AI 進行加筆修正的作品。以前女友為形象模特兒，並將其與 Live2D 融合製作成網站。此作品獲得了校內人氣獎。",
      beforeImage: "/images/sieru.png",
      afterImage: "/images/sieru.png",
      enableComparison: false,
      technologies: ["AI", "spine2D", "Photoshop"],
    },
    {
      title: "AI 修圖作品",
      description: "利用 AI 進行加筆修正的作品。",
      beforeImage: "/images//firework.png",
      afterImage: "/images//firework.png",
      enableComparison: false,
      technologies: ["AI", "Photoshop"],
    },
    {
      title: "色調補正",
      description: "最近正在嘗試 Lightroom 的色調補正。非常喜歡那種能突顯日本藍色的效果（Tokyo Blue Effect），考慮在下次旅行時拍攝這樣的照片。",
      beforeImage: "/images/fix_old2.jpg",
      afterImage: "/images/fix_new2.jpg",
      enableComparison: true,
      technologies: ["Lightroom"],
    },
    {
      title: "修圖練習",
      description: "這是 Lightroom 的練習作品。主要的練習目的是表現出如繪畫般美麗的肌膚質感。",
      beforeImage: "/images/fix_old1.jpg",
      afterImage: "/images/fix_new1.jpg",
      enableComparison: true,
      technologies: ["Lightroom"],
    },
    {
      title: "Spine2D 素材",
      description: "利用 AI 進行加筆修正的作品。使用 Spine2D 製作成動畫，並嵌入到網站中。",
      beforeImage: "/images/pinkbunny.png",
      afterImage: "/images/pinkbunny.png",
      enableComparison: false,
      technologies: ["Spine2D", "AI"],
    },
  ],
}

const uiTranslations = {
  jp: {
    sectionTitle: "Image",
    defaultDesc: "趣味で制作した自主作品で、LightroomとPhotoshopを活用した高度な画像編集・レタッチスキルを公開しています。この作品群では、Lightroomの現像機能による色彩調整や雰囲気作り、そしてPhotoshopを用いたより詳細な合成・修正作業を組み合わせています。写真の持つ魅力を最大限に引き出し、新たな表現を追求したポートフォリオです。",
    tech: "技術",
    prev: "前へ",
    next: "次へ",
    before: "Before",
    after: "After",
    sliderLabel: "画像比較スライダー",
  },
  zh: {
    sectionTitle: "圖像作品",
    defaultDesc: "這是出於興趣製作的自主作品，展示了運用 Lightroom 和 Photoshop 的高階圖像編輯與修圖技巧。這些作品結合了 Lightroom 顯影功能的色彩調整與氛圍營造，以及使用 Photoshop 進行更細緻的合成與修正作業。這是一個致力於最大限度引發照片魅力，並追求全新表現形式的作品集。",
    tech: "技術",
    prev: "上一頁",
    next: "下一頁",
    before: "Before",
    after: "After",
    sliderLabel: "圖片比較滑塊",
  },
}

interface Props {
  language: Language
}

export default function ImageComparisonSlider({ language }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(4 / 3)
  
  const t = uiTranslations[language]
  const imageComparisons = comparisonsData[language]

  useEffect(() => {
    setIsClient(true)
  }, [])

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
                alt={`${currentWork.title} - ${t.after}`}
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
                  alt={`${currentWork.title} - ${t.before}`}
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
                aria-label={t.sliderLabel}
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
                {t.before}
              </div>
              <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded text-xs font-dotgothic16 text-white pointer-events-none">
                {t.after}
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
              {currentWork.afterImage.toLowerCase().endsWith(".mp4") ? (
                <video
                  src={currentWork.afterImage}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget
                    setImageAspectRatio(video.videoWidth / video.videoHeight)
                  }}
                />
              ) : (
                <Image
                  src={currentWork.afterImage || "/placeholder.svg"}
                  alt={currentWork.title}
                  fill
                  className="object-contain"
                  draggable="false"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  onLoad={handleImageLoad}
                />
              )}
            </div>
          )}

          <div className="mb-6">
            {isClient ? (
              <PixelText
                text={t.sectionTitle}
                size="medium"
                letterSpacing="normal"
                className="mb-2"
                wordGroups={[[0, 1, 2, 3, 4]]}
              />
            ) : (
              <FallbackText text={t.sectionTitle} className="mb-2 text-xl font-bold" />
            )}

            <p className="font-dotgothic16 mb-4 text-gray-300 text-base leading-relaxed">
              {currentWork.description || t.defaultDesc}
            </p>

            <div className="flex gap-2 items-center mb-4 flex-wrap">
              <span className="text-sm font-dotgothic16">{t.tech}: </span>
              {currentWork.technologies.map((tech) => (
                <TechTag key={tech} tech={tech} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={prevImage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors relative z-30"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">{t.prev}</span>
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
              <span className="hidden sm:inline">{t.next}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </PixelBox>
      </div>
    </section>
  )
}
