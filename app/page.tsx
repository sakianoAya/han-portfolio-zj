"use client"

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
              インタラクティブなウェブ体験とアニメーションを創造するクリエイター。
              <br />
              技術とアートの融合を追求しています。
            </p>
            <div className="flex gap-4">
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
              <PixelBox className="p-6 overflow-hidden group relative">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                </div>
                {isClient ? (
                  <PixelText
                    text="PIXEL BREAKOUT"
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
                  インタラクティブなピクセルアートゲーム。Next.jsとCanvasを使用して開発しました。
                </p>
                <div className="flex gap-2 items-center mt-auto">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">Next.js</span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">Canvas</span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">TypeScript</span>
                </div>
                <a
                  href="#"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="font-dotgothic16 flex items-center">
                    詳細を見る <ExternalLink size={16} className="ml-1" />
                  </span>
                </a>
              </PixelBox>

              <PixelBox className="p-6 overflow-hidden group relative">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-yellow-400"></div>
                </div>
                {isClient ? (
                  <PixelText
                    text="ANIMATION SHOWCASE"
                    size="medium"
                    letterSpacing="normal"
                    className="mb-2"
                    wordGroups={[
                      [0, 1, 2, 3, 4, 5, 6, 7, 8],
                      [10, 11, 12, 13, 14, 15, 16, 17],
                    ]} // ANIMATION + SHOWCASE
                  />
                ) : (
                  <FallbackText text="ANIMATION SHOWCASE" className="mb-2 text-xl font-bold" />
                )}
                <p className="font-dotgothic16 mb-4">
                  Spine2DとAfter Effectsを使用したアニメーションショーケース。キャラクターデザインから動きまで。
                </p>
                <div className="flex gap-2 items-center mt-auto">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">Spine2D</span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">
                    After Effects
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">Photoshop</span>
                </div>
                <a
                  href="#"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="font-dotgothic16 flex items-center">
                    詳細を見る <ExternalLink size={16} className="ml-1" />
                  </span>
                </a>
              </PixelBox>

              <PixelBox className="p-6 overflow-hidden group relative">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-400"></div>
                </div>
                {isClient ? (
                  <PixelText
                    text="INTERACTIVE WEBSITE"
                    size="medium"
                    letterSpacing="normal"
                    className="mb-2"
                    wordGroups={[
                      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                      [12, 13, 14, 15, 16, 17, 18],
                    ]} // INTERACTIVE + WEBSITE
                  />
                ) : (
                  <FallbackText text="INTERACTIVE WEBSITE" className="mb-2 text-xl font-bold" />
                )}
                <p className="font-dotgothic16 mb-4">
                  インタラクティブな要素を多く取り入れたウェブサイト。ユーザー体験を重視したデザイン。
                </p>
                <div className="flex gap-2 items-center mt-auto">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">React</span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">Three.js</span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">GSAP</span>
                </div>
                <a
                  href="#"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="font-dotgothic16 flex items-center">
                    詳細を見る <ExternalLink size={16} className="ml-1" />
                  </span>
                </a>
              </PixelBox>

              <PixelBox className="p-6 overflow-hidden group relative">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600"></div>
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
                  LINEメッセンジャー用のオリジナルステッカーセット。キャラクターデザインとアニメーション。
                </p>
                <div className="flex gap-2 items-center mt-auto">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">Line2D</span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">Clip Studio</span>
                  <span className="px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16">Photoshop</span>
                </div>
                <a
                  href="#"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="font-dotgothic16 flex items-center">
                    詳細を見る <ExternalLink size={16} className="ml-1" />
                  </span>
                </a>
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
                <div className="aspect-square rounded-full overflow-hidden bg-gray-700 mb-6 mx-auto max-w-[240px]"></div>
                {isClient ? (
                  <PixelText
                    text="CHUNG CHENG HAN"
                    size="medium"
                    letterSpacing="wide"
                    className="mb-2 text-center w-full px-2"
                    wordGroups={[nameWordGroup]} // 将整个名字作为一个单词
                  />
                ) : (
                  <FallbackText text="CHUNG CHENG HAN" className="mb-2 text-xl font-bold text-center" />
                )}
                <p className="font-dotgothic16 text-center mb-4">ウェブエンジニア＆アニメーター</p>
              </PixelBox>

              <PixelBox className="p-6 h-auto md:col-span-2">
                <p className="font-dotgothic16 mb-4">
                  技術とクリエイティビティの融合を追求するウェブエンジニア兼アニメーターです。インタラクティブなウェブ体験とアニメーションの制作に情熱を注いでいます。
                </p>
                <p className="font-dotgothic16 mb-4">
                  Next.js、HTML、CSS、JavaScriptなどのウェブ技術と、Photoshop、Spine2D、Line2D、After Effects、Clip
                  Studio Paintなどのアニメーションツールを駆使して、ユニークなデジタル体験を創造しています。
                </p>
                <p className="font-dotgothic16">
                  常に新しい技術とクリエイティブな表現方法を探求し、ユーザーに驚きと喜びを提供することを目指しています。
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
                        <li>Photoshop</li>
                        <li>Spine2D</li>
                        <li>Line2D</li>
                        <li>After Effects</li>
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
                プロジェクトのご相談やお問い合わせは、以下の連絡先までお気軽にご連絡ください。
              </p>

              <div className="flex flex-col gap-6">
                <a
                  href="mailto:han@example.com"
                  className="flex items-center gap-3 font-dotgothic16 hover:opacity-80 transition-opacity"
                >
                  <Mail size={24} />
                  <span>han@example.com</span>
                </a>
                <a
                  href="https://github.com/han-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-dotgothic16 hover:opacity-80 transition-opacity"
                >
                  <Github size={24} />
                  <span>github.com/han-dev</span>
                </a>
                <a
                  href="https://linkedin.com/in/han-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-dotgothic16 hover:opacity-80 transition-opacity"
                >
                  <Linkedin size={24} />
                  <span>linkedin.com/in/han-dev</span>
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
