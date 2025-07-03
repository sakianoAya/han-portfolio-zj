"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import FallbackText from "@/components/fallback-text"
import GameControls from "@/components/game-controls"
import { PixelBox } from "@/components/pixel-box"
import SpeedIndicator from "@/components/speed-indicator"
import { ThemeProvider } from "@/contexts/theme-context"
import { ExternalLink, Mail, Github, Linkedin } from "lucide-react"

// 動態導入需要客戶端渲染的組件
const PixelText = dynamic(() => import("@/components/pixel-text"), {
  ssr: false,
  loading: () => <div className="text-white text-2xl">Loading...</div>,
})

const GameCanvas = dynamic(() => import("@/components/game-canvas"), {
  ssr: false,
})

export default function Home() {
  const [autoMode, setAutoMode] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [speedLevel, setSpeedLevel] = useState(0)
  const [maxSpeedLevel, setMaxSpeedLevel] = useState(10)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 添加一個 useEffect 來監控狀態變化
  useEffect(() => {
    console.log("Home component - autoMode changed to:", autoMode)
  }, [autoMode])

  // 处理球速度变化
  const handleSpeedChange = (level: number, maxLevel: number) => {
    setSpeedLevel(level)
    setMaxSpeedLevel(maxLevel)
  }

  // 定义单词分组
  const nameWordGroup = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] // CHUNG CHENG HAN
  const titleWordGroup = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] // WEB ENGINEER & ANIMATOR

  // 技術標籤連結映射
  const techLinks: Record<string, string> = {
    "Next.js": "https://nextjs.org/",
    Canvas: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
    TypeScript: "https://www.typescriptlang.org/",
    Spine2D: "http://esotericsoftware.com/",
    "After Effects": "https://www.adobe.com/products/aftereffects.html",
    Photoshop: "https://www.adobe.com/products/photoshop.html",
    React: "https://reactjs.org/",
    "Three.js": "https://threejs.org/",
    GSAP: "https://greensock.com/gsap/",
    Line2D: "https://www.live2d.com/",
    "Clip Studio": "https://www.clipstudio.net/",
    Pixijs:"https://pixijs.com/",
    "Tailwind CSS": "https://tailwindcss.com/",
  }

  // 技術標籤組件
  const TechTag = ({ tech }: { tech: string }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (techLinks[tech]) {
        window.open(techLinks[tech], "_blank", "noopener,noreferrer")
      }
    }

    return (
      <button
        onClick={handleClick}
        className={`px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16 transition-all duration-200 relative z-30 ${
          techLinks[tech] ? "hover:bg-opacity-50 hover:scale-105 cursor-pointer" : "cursor-default"
        }`}
        title={techLinks[tech] ? `點擊查看 ${tech} 官方網站` : tech}
      >
        {tech}
      </button>
    )
  }

  // 確保正確傳遞給子組件
  return (
    <ThemeProvider>
      <main className="relative min-h-screen text-white" style={{ backgroundColor: "var(--theme-background)" }}>
        {/* ===== 应用背景颜色 ===== */}
        {isClient && <GameCanvas autoMode={autoMode} contentRef={contentRef} onSpeedChange={handleSpeedChange} />}

        {/* 速度指示器 */}
        <SpeedIndicator speedLevel={speedLevel} maxSpeedLevel={maxSpeedLevel} isManualMode={!autoMode} />

        <div className="fixed bottom-4 right-4 z-50">
          <GameControls
            autoMode={autoMode}
            setAutoMode={(mode) => {
              console.log("setAutoMode called with:", mode)
              setAutoMode(mode)
            }}
          />
        </div>

        {/* Scrollable content */}
        <div ref={contentRef} className="relative z-10 px-4 py-16 md:px-8 lg:px-16 max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="min-h-[80vh] flex flex-col justify-center items-center mb-32">
            {isClient ? (
              <>
                <PixelText
                  text="CHUNG CHENG HAN"
                  size="large"
                  letterSpacing="wide" // 使用宽字母间距
                  className="mb-6 text-center transform sm:scale-110 md:scale-125 w-full px-2"
                  wordGroups={[nameWordGroup]} // 将整个名字作为一个单词
                />
                <PixelText
                  text="WEB ENGINEER & ANIMATOR"
                  size="medium"
                  letterSpacing="wide" // 使用宽字母间距
                  className="mb-12 text-center transform sm:scale-105 md:scale-110 w-full px-2"
                  wordGroups={[titleWordGroup]} // 将整个标题作为一个单词
                />
              </>
            ) : (
              <>
                <FallbackText
                  text="CHUNG CHENG HAN"
                  className="mb-6 text-center text-4xl sm:text-5xl md:text-6xl font-bold"
                />
                <FallbackText
                  text="WEB ENGINEER & ANIMATOR"
                  className="mb-12 text-center text-xl sm:text-2xl md:text-3xl font-bold"
                />
              </>
            )}
            <p className="text-xl font-dotgothic16 mb-8 text-center max-w-2xl">
              インタラクティブなウェブ体験とアニメーションを創造するクリエイター
              <br />
              技術とアートの融合を追求しています。
            </p>
            <div className="flex gap-4 relative z-30">
              <a
                href="#projects"
                className="px-6 py-3 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors"
              >
                作品を見る
              </a>
              <a
                href="#contact"
                className="px-6 py-3 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors"
              >
                お問い合わせ
              </a>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="mb-32">
            {isClient ? (
              <PixelText
                text="MY PROJECTS"
                size="large"
                letterSpacing="wide"
                className="mb-8 sm:mb-16 text-center w-full px-2"
                wordGroups={[
                  [0, 1],
                  [3, 4, 5, 6, 7, 8, 9, 10],
                ]} // MY + PROJECTS 作为两个单词
              />
            ) : (
              <FallbackText text="MY PROJECTS" className="mb-8 sm:mb-16 text-center text-3xl sm:text-4xl font-bold" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* PIXEL BREAKOUT 專案 */}
              <PixelBox className="p-6 overflow-hidden group">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden rounded-lg">
                  <img
                    src="images/project/project01.png"
                    alt="PIXEL BREAKOUT Project Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {isClient ? (
                  <PixelText
                    text="PROTFOLIO"
                    size="medium"
                    letterSpacing="normal"
                    className="mb-2"
                    wordGroups={[
                      [0, 1, 2, 3, 4],
                      [6, 7, 8, 9, 10, 11, 12, 13],
                    ]} // PIXEL + BREAKOUT
                  />
                ) : (
                  <FallbackText text="PIXEL BREAKOUT" className="mb-2 text-xl font-bold" />
                )}
                <p className="font-dotgothic16 mb-4">
                  私のポートフォリオは、ブロック崩しのクラシックゲームを融合させています。
                </p>

                {/* 技術標籤 */}
                <div className="flex gap-2 items-center mb-4 flex-wrap">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <TechTag tech="Next.js" />
                  <TechTag tech="Canvas" />
                  <TechTag tech="TypeScript" />
                  <TechTag tech="Tailwind CSS" />
                </div>

                {/* GitHub 和 Live Demo 連結 */}
                <div className="flex gap-4 items-center relative z-30">
                  <a
                    href="https://github.com/sakianoAya/han-portfolio-zj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://han-portfoliogamestyle.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </PixelBox>

              {/* TOPEIC GIRL 專案 */}
              <PixelBox className="p-6 overflow-hidden group">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden rounded-lg">
                  <img
                    src="images/project/project02.png"
                    alt="TOPEIC GIRL Project Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // 如果圖片載入失敗，顯示漸層背景
                      e.currentTarget.style.display = "none"
                      e.currentTarget.parentElement!.style.background =
                        "linear-gradient(to bottom right, #10b981, #eab308)"
                    }}
                  />
                </div>
                {isClient ? (
                  <PixelText
                    text="TOPEIC GIRL"
                    size="medium"
                    letterSpacing="normal"
                    className="mb-2"
                    wordGroups={[
                      [0, 1, 2, 3, 4, 5],
                      [7, 8, 9, 10],
                    ]} // TOPEIC + GIRL
                  />
                ) : (
                  <FallbackText text="TOPEIC GIRL" className="mb-2 text-xl font-bold" />
                )}
                <p className="font-dotgothic16 mb-4">
                  単語学習ウェブサイト。ヒロインは私が描いた「そらちゃん」で、Spine2Dを使ってアニメーション化し、ウェブサイト上でユーザーとインタラクションできるようにしました。
                </p>

                {/* 技術標籤 */}
                <div className="flex gap-2 items-center mb-4 flex-wrap">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <TechTag tech="Next.js" />
                  <TechTag tech="React" />
                  <TechTag tech="TypeScript" />
                  <TechTag tech="Spine2D" />
                  <TechTag tech="pixi.js" />
                </div>

                {/* GitHub 和 Live Demo 連結 */}
                <div className="flex gap-4 items-center relative z-30">
                  <a
                    href="https://github.com/sakianoAya/toeicgirl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://toeicgirl.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </PixelBox>

              {/* KABUKICHO 專案 */}
              <PixelBox className="p-6 overflow-hidden group">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden rounded-lg">
                  <img
                    src="images/project/project03.png"
                    alt="KABUKICHO Project Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // 如果圖片載入失敗，顯示漸層背景
                      e.currentTarget.style.display = "none"
                      e.currentTarget.parentElement!.style.background =
                        "linear-gradient(to bottom right, #ef4444, #f97316)"
                    }}
                  />
                </div>
                {isClient ? (
                  <PixelText
                    text="KABUKICHO"
                    size="medium"
                    letterSpacing="normal"
                    className="mb-2"
                    wordGroups={[[0, 1, 2, 3, 4, 5, 6, 7, 8]]} // KABUKICHO
                  />
                ) : (
                  <FallbackText text="KABUKICHO" className="mb-2 text-xl font-bold" />
                )}
                <p className="font-dotgothic16 mb-4">
                  歌舞伎町を紹介するウェブサイト。歌舞伎町の華やかな夜景とネオンをインスピレーションに作成した地域紹介サイトです。
                </p>

                {/* 技術標籤 */}
                <div className="flex gap-2 items-center mb-4 flex-wrap">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <TechTag tech="React" />
                  <TechTag tech="Three.js" />
                  <TechTag tech="Tailwind CSS" />
                </div>

                {/* GitHub 和 Live Demo 連結 */}
                <div className="flex gap-4 items-center relative z-30">
                  <a
                    href="https://github.com/sakianoAya/kabukicho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://kabukicho.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </PixelBox>

              {/* LINE STICKERS 專案 */}
              <PixelBox className="p-6 overflow-hidden group">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden rounded-lg">
                  <img
                    src="/images/project/project04.jpg"
                    alt="LINE STICKERS Project Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // 如果圖片載入失敗，顯示漸層背景
                      e.currentTarget.style.display = "none"
                      e.currentTarget.parentElement!.style.background =
                        "linear-gradient(to bottom right, #06b6d4, #2563eb)"
                    }}
                  />
                </div>
                {isClient ? (
                  <PixelText
                    text="LINE STICKERS"
                    size="medium"
                    letterSpacing="normal"
                    className="mb-2"
                    wordGroups={[
                      [0, 1, 2, 3],
                      [5, 6, 7, 8, 9, 10, 11, 12],
                    ]} // LINE + STICKERS
                  />
                ) : (
                  <FallbackText text="LINE STICKERS" className="mb-2 text-xl font-bold" />
                )}
                <p className="font-dotgothic16 mb-4">
                  Loading
                </p>

                {/* 技術標籤 */}
                <div className="flex gap-2 items-center mb-4 flex-wrap">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <TechTag tech="Line2D" />
                  <TechTag tech="Clip Studio" />
                  <TechTag tech="Photoshop" />
                </div>

                {/* GitHub 和 LINE Store 連結 */}
                <div className="flex gap-4 items-center relative z-30">
                  <a
                    href="https://github.com/your-username/line-stickers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://store.line.me/stickershop/product/your-sticker-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <ExternalLink size={16} />
                    <span>LINE Store</span>
                  </a>
                </div>
              </PixelBox>
            </div>
          </section>

          {/* About Me Section */}
          <section id="about" className="mb-32">
            {isClient ? (
              <PixelText
                text="ABOUT ME"
                size="large"
                letterSpacing="wide"
                className="mb-8 sm:mb-16 text-center w-full px-2"
                wordGroups={[
                  [0, 1, 2, 3, 4],
                  [6, 7],
                ]} // ABOUT + ME
              />
            ) : (
              <FallbackText text="ABOUT ME" className="mb-8 sm:mb-16 text-center text-3xl sm:text-4xl font-bold" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <PixelBox className="p-6 h-auto md:col-span-1">
                <div className="aspect-square rounded-full overflow-hidden bg-gray-700 mb-6 mx-auto max-w-[240px]">
                  <img src="/images/pro/avatar.jpeg" alt="CHUNG CHENG HAN" className="w-full h-full object-cover" />
                </div>
                {isClient ? (
                  <PixelText
                    text="CHUNG"
                    size="large"
                    letterSpacing="wide"
                    className="mb-2 text-center w-full px-2"
                    wordGroups={[nameWordGroup]} // 将整个名字作为一个单词
                  />
                ) : (
                  <FallbackText text="CHUNG" className="mb-2 text-xl font-bold text-center" />
                )}
                {isClient ? (
                  <PixelText
                    text="CHENGHAN"
                    size="medium"
                    letterSpacing="wide"
                    className="mb-2 text-center w-full px-2"
                    wordGroups={[nameWordGroup]} // 将整个名字作为一个单词
                  />
                ) : (
                  <FallbackText text="CHENG HAN" className="mb-2 text-l font-bold text-center" />
                )}
                <p className="font-dotgothic16 text-center mb-4">ウェブエンジニア＆アニメーター</p>
              </PixelBox>

              <PixelBox className="p-6 h-auto md:col-span-2">
                <p className="font-dotgothic16 mb-4">
                  台湾出身のアニメーションエンジニアです。
                </p>
                <p className="font-dotgothic16 mb-4">
                 Spine2DやReactなどのフロントエンド技術を用い、「演出」と「動き」にこだわった表現を追求しています。金亨泰氏のスタイルに影響を受け、独特な世界観やキャラクターの魅力を引き出す演出に憧れています。
                </p>
                <p className="font-dotgothic16 mb-4">
                  Next.js、HTML、CSS、JavaScriptなどのウェブ技術と、Photoshop、Spine2D、Line2D、After Effects、Clip Studio Paintなどのアニメーションツールを駆使して、ユニークなデジタル体験を創造しています。
                </p>
                <p className="font-dotgothic16 mb-4">
                  これまでにSpine2Dを用いたアニメーション制作の案件を複数担当しており、ゲームUIやキャラクター演出の実装などを経験しました。クライアントの要望に寄り添いながら、印象的な動きを形にすることを心がけています。
                </p>
                <p className="font-dotgothic16 mb-4">
                  プライベートでは新しいツールや技術の検証が趣味で、日々表現の幅を広げる挑戦を続けています。
                </p>
                
                <div className="mt-8">
                  <h3 className="font-dotgothic16 text-lg mb-4">スキル</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-dotgothic16 mb-2">ウェブ開発</h4>
                      <ul className="list-disc list-inside font-dotgothic16 text-sm">
                        <li>Next.js / React</li>
                        <li>HTML / CSS / JavaScript</li>
                        <li>TypeScript</li>
                        <li>Responsive Design</li>
                        <li>Canvas / WebGL</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-dotgothic16 mb-2">アニメーション</h4>
                      <ul className="list-disc list-inside font-dotgothic16 text-sm">
                        
                        <li>Spine2D</li>
                        <li>Live2D</li>
                        <li>Photoshop/Lightroom</li>
                        <li>Clip Studio Paint</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </PixelBox>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-24">
            {isClient ? (
              <PixelText
                text="CONTACT ME"
                size="large"
                letterSpacing="wide"
                className="mb-8 sm:mb-16 text-center w-full px-2"
                wordGroups={[
                  [0, 1, 2, 3, 4, 5, 6],
                  [8, 9],
                ]} // CONTACT + ME
              />
            ) : (
              <FallbackText text="CONTACT ME" className="mb-8 sm:mb-16 text-center text-3xl sm:text-4xl font-bold" />
            )}

            <PixelBox className="p-8 max-w-2xl mx-auto">
              <p className="font-dotgothic16 mb-8 text-center">
                ご相談やお問い合わせは、以下の連絡先までお気軽にご連絡ください
              </p>

              <div className="flex flex-col gap-6 relative z-30">
                <a
                  href="mailto:aya871210@gmail.com"
                  className="flex items-center gap-3 font-dotgothic16 hover:opacity-80 transition-opacity"
                >
                  <Mail size={24} />
                  <span>aya871210@gmail.com</span>
                </a>
                <a
                  href="https://github.com/sakianoAya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-dotgothic16 hover:opacity-80 transition-opacity"
                >
                  <Github size={24} />
                  <span>github.com/sakianoAya</span>
                </a>
                
              </div>
            </PixelBox>
          </section>

          <footer className="py-8 text-center">
            {isClient ? (
              <PixelText
                text="CHUNG CHENG HAN - 2024"
                size="small"
                letterSpacing="normal"
                className="text-gray-500 w-full px-2"
                wordGroups={[
                  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                  [16, 17, 18, 19],
                ]} // CHUNG CHENG HAN + 2024
              />
            ) : (
              <FallbackText text="CHUNG CHENG HAN - 2024" className="text-gray-500 text-sm" />
            )}
          </footer>
        </div>
      </main>
    </ThemeProvider>
  )
}
