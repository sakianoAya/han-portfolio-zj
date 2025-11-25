"use client"

import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import FallbackText from "@/components/fallback-text"
import GameControls from "@/components/game-controls"
import { PixelBox } from "@/components/pixel-box"
import SpeedIndicator from "@/components/speed-indicator"
import { ThemeProvider } from "@/contexts/theme-context"
import { ExternalLink, Mail, Github, Linkedin } from "lucide-react"
import LottieShowcase from "@/components/lottie-showcase"
import ImageComparisonSlider from "@/components/image-comparison-slider"
import ThreeModelShowcase from "@/components/three-model-showcase"
import ScrollReveal from "@/components/scroll-reveal"
import Image from "next/image"
import { TechTag } from "@/components/tech-tag"

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
          <ScrollReveal>
            <section className="min-h-[80vh] flex flex-col justify-center items-center mb-32 pt-20 sm:pt-0">
              {isClient ? (
                <>
                  <PixelText
                    text="CHUNG CHENG HAN"
                    size="large"
                    letterSpacing="wide" // 使用宽字母间距
                    className="mb-6 text-center w-full px-2"
                    wordGroups={[nameWordGroup]} // 将整个名字作为一个单词
                  />
                  <PixelText
                    text="WEB ENGINEER & ANIMATOR"
                    size="medium"
                    letterSpacing="wide" // 使用宽字母间距
                    className="mb-12 text-center w-full px-2"
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
              <p className="text-base sm:text-lg md:text-xl font-dotgothic16 mb-8 text-center max-w-2xl leading-relaxed px-4">
                インタラクティブなウェブ体験とアニメーションを創造するクリエイター
                <br className="hidden sm:block" />
                技術とアートの融合を追求しています。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 relative z-30 w-full sm:w-auto px-8 sm:px-0">
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors text-center"
                >
                  作品を見る
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors text-center"
                >
                  お問い合わせ
                </a>
              </div>
            </section>
          </ScrollReveal>

          {/* Projects Section */}
          <ScrollReveal delay={0.2}>
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
                {/* PIXEL BREAKOUT 専案 */}
                <PixelBox className="p-6 overflow-hidden group h-full flex flex-col">
                  <div className="aspect-video bg-gray-800 mb-4 overflow-hidden rounded-lg relative">
                    <Image
                      src="images/project/project01.png"
                      alt="PIXEL BREAKOUT Project Preview"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
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
                  <p className="font-dotgothic16 mb-4 text-gray-300 text-base leading-relaxed flex-grow">
                     私のポートフォリオは、ブロック崩しのクラシックゲームを融合させています。
                  </p>

                  {/* 技術標籤 */}
                  <div className="flex gap-2 items-center mb-4 flex-wrap mt-auto">
                    <span className="text-sm font-dotgothic16">技術: </span>
                    <TechTag tech="Next.js" />
                    <TechTag tech="Canvas" />
                    <TechTag tech="TypeScript" />
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

                {/* TOPEIC GIRL 専案 */}
                <PixelBox className="p-6 overflow-hidden group h-full flex flex-col">
                  <div className="aspect-video bg-gray-800 mb-4 overflow-hidden rounded-lg relative">
                    <Image
                      src="/images/project/project02.png"
                      alt="TOPEIC GIRL Project Preview"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={(e) => {
                        // 如果圖片載入失敗，顯示漸層背景
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        if (target.parentElement) {
                          target.parentElement.style.background = "linear-gradient(to bottom right, #10b981, #eab308)"
                        }
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
                  <p className="font-dotgothic16 mb-4 text-gray-300 text-base leading-relaxed flex-grow">
                    単語学習ウェブサイト。ヒロインは私が描いた「そらちゃん」で、Spine2Dを使ってアニメーション化し、ウェブサイト上でユーザーとインタラクションできるようにしました。
                  学内で人気投票第一位を獲得しました。
                  </p>

                  {/* 技術標籤 */}
                  <div className="flex gap-2 items-center mb-4 flex-wrap mt-auto">
                    <span className="text-sm font-dotgothic16">技術: </span>
                    <TechTag tech="Next.js" />
                    <TechTag tech="React" />
                    <TechTag tech="TypeScript" />
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

                {/* spineshowcase 專案 */}
              <PixelBox className="p-6 overflow-hidden group">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden rounded-lg">
                  <img
                    src="images/project/project05.jpg"
                    alt="spineshowcase Project Preview"
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
                    text="SPINWESHOWCASE"
                    size="medium"
                    letterSpacing="normal"
                    className="mb-2"
                    wordGroups={[
                      [0, 1, 2, 3, 4, 5],
                      [7, 8, 9, 10],
                    ]} // SPINWESHOWCASE
                  />
                ) : (
                  <FallbackText text="SPINWESHOWCASE" className="mb-2 text-xl font-bold" />
                )}
                <p className="font-dotgothic16 mb-4">
                  Spine2Dのアニメーションを紹介するウェブサイト。Spine2Dのアニメーションを使って、インタラクティブな体験を提供することを目的としています。
                </p>

                {/* 技術標籤 */}
                <div className="flex gap-2 items-center mb-4 flex-wrap">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <TechTag tech="Next.js" />
                  <TechTag tech="React" />
                  <TechTag tech="TypeScript" />
                  <TechTag tech="Spine2D" />
                  <TechTag tech="Tailwind CSS" />
                </div>

                {/* GitHub 和 Live Demo 連結 */}
                <div className="flex gap-4 items-center relative z-30">
                  <a
                    href="https://github.com/sakianoAya/spinshowcase"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://spinshowcase.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </PixelBox>

                {/* KABUKICHO 専案 */}
                <PixelBox className="p-6 overflow-hidden group h-full flex flex-col">
                  <div className="aspect-video bg-gray-800 mb-4 overflow-hidden rounded-lg relative">
                    <Image
                      src="/images/project/project03.png"
                      alt="KABUKICHO Project Preview"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
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
                  <p className="font-dotgothic16 mb-4 text-gray-300 text-base leading-relaxed flex-grow">
                    歌舞伎町を紹介するウェブサイト。歌舞伎町の華やかな夜景とネオンをインスピレーションに作成した地域紹介サイトです。
                  </p>

                  {/* 技術標籤 */}
                  <div className="flex gap-2 items-center mb-4 flex-wrap mt-auto">
                    <span className="text-sm font-dotgothic16">技術: </span>
                    <TechTag tech="React" />
                    <TechTag tech="Three.js" />
                    <TechTag tech="GSAP" />
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

                {/* unity 專案 */}
              <PixelBox className="p-6 overflow-hidden group">
                <div className="aspect-video bg-gray-800 mb-4 overflow-hidden rounded-lg">
                  <img
                    src="images/project/project04.jpg"
                    alt="SILAS Project Preview"
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
                    text="SILAS"
                    size="medium"
                    letterSpacing="normal"
                    className="mb-2"
                    wordGroups={[
                      [0, 1, 2, 3],
                      [5, 6, 7, 8, 9, 10, 11, 12],
                    ]} // unity
                  />
                ) : (
                  <FallbackText text="LINE STICKERS" className="mb-2 text-xl font-bold" />
                )}
                <p className="font-dotgothic16 mb-4">
                  大学の卒業制作です、チームリーダーとしてUnityを用いたゲーム開発を統括しました。具体的には、プログラミング、アクション・戦闘システム設計、キャラクターのリギング・テクスチャリング、VFX開発、Unityシーンデザイン、そしてシェーダー開発を担当いたしました。</p>

                {/* 技術標籤 */}
                <div className="flex gap-2 items-center mb-4 flex-wrap">
                  <span className="text-sm font-dotgothic16">技術: </span>
                  <TechTag tech="unity" />
                </div>

                {/* GitHub 和 LINE Store 連結 */}
                <div className="flex gap-4 items-center relative z-30">
                
                  <a
                    href="https://youtu.be/1a5-siRwdvo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-dotgothic16 hover:opacity-80 transition-opacity bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700"
                  >
                    <ExternalLink size={16} />
                    <span>Youtude Video</span>
                  </a>
                </div>
              </PixelBox>
            </div>
          </section>

          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <section className="mb-16">
              {isClient ? (
                <PixelText
                  text="HOBBY & WORK"
                  size="large"
                  letterSpacing="wide"
                  className="mb-8 sm:mb-16 text-center w-full px-2"
                  wordGroups={[[0, 1, 2, 3, 4], [6], [8, 9, 10, 11]]} // HOBBY + & + WORK as three groups
                />
              ) : (
                <FallbackText
                  text="HOBBY & WORK"
                  className="mb-8 sm:mb-16 text-center text-3xl sm:text-4xl font-bold"
                />
              )}
            </section>

            <ThreeModelShowcase />
            <LottieShowcase />
            <ImageComparisonSlider />
          </ScrollReveal>

          {/* About Me Section */}
          <ScrollReveal delay={0.2}>
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
                    台湾出身のアニメーション・フロントエンドエンジニアです。技術と表現を繋ぎ、ユーザーに「驚き」と「感動」を与える演出を追求しています。
                  </p>

                  <p className="font-dotgothic16 mb-4">
                    Spine2Dを主軸に、React/Next.jsの技術を融合。ウェブ環境で躍動感のある2Dアニメーションを実現します。
                  </p>
                  
                  <p className="font-dotgothic16 mb-4">
                    ゲームUIやキャラクター演出など、Spine2D案件の実績多数。キム・ヒョンテ氏に影響を受け、独特な世界観の構築を目指しています。
                  </p>
                  
                  <p className="font-dotgothic16 mb-4">
                    最大の強みは高い学習意欲と適応力です。常に表現の幅を広げる挑戦を続けています。
                  </p>
                  
                  <p className="font-dotgothic16 mb-4">
                    専門分野を超え、3D、AI技術、After Effectsなど、新しいスキルを日々自発的に習得しています。
                  </p>
                  
                  <p className="font-dotgothic16 mb-4">
                    チームでは、高い柔軟性を活かし、知識やスキルの空隙を埋める「最後のピース」として成功に貢献します。
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
                          <li>Blender</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </PixelBox>
              </div>
            </section>
          </ScrollReveal>

          {/* Contact Section */}
          <ScrollReveal delay={0.2}>
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
          </ScrollReveal>

          <footer className="py-8 text-center">
            {isClient ? (
              <PixelText
                text="CHUNG CHENG HAN - 2025"
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
