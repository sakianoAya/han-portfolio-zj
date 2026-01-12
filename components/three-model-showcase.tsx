"use client"

import { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import { ChevronLeft, ChevronRight, ExternalLink, Palette } from "lucide-react"
import { PixelBox } from "@/components/pixel-box"
import PixelText from "@/components/pixel-text"
import { TechTag } from "@/components/tech-tag"
import { EffectsWrapper } from "@/components/model-viewer-with-effects"

type Language = "jp" | "zh"

const modelsData = {
  jp: [
    {
      id: 1,
      path: "/assets/3d/duck.glb",
      title: "3D Model",
      description: `将来性の高い3D分野の技術を習得するため、大学時代の経験を活かし、オンライン教材を通じてBlenderとthree.jsを習得しました。本作品では、モデリングだけでなく、シェーダー（Shader）やポストプロセス（Post Processing）も積極的に学習・活用しています。モデルの制作から、Webでの表現に欠かせない技術まで、意欲的に取り組んでいる成長性の高いポートフォリオです。`,
      scale: 1, // モデルのサイズ (scale)
      position: [0, -1, 0] as [number, number, number],
      demoUrl: null,
    },
    {
      id: 2,
      path: "/assets/3d/straeberrycreamcake.glb", // 不載入模型，改為外部連結
      title: "Watercolor Shader",
      description:
        "WebGLで実装した水彩レンダリングシェーダー。Tensorパス、Kuwaharaフィルタ、ポストプロセシングを組み合わせて、リアルタイムで水彩画のような表現を実現しました。",
      scale: 0.2, // モデルのサイズ (scale)
      position: [0, -3, 0] as [number, number, number],
      demoUrl: "#", // 之後可以替換成實際的外部連結
    },
  ],
  zh: [
    {
      id: 1,
      path: "/assets/3d/duck.glb",
      title: "3D 模型",
      description: `為了掌握具有高發展潛力的 3D 領域技術，我利用大學時期的經驗，透過線上教材學習了 Blender 和 three.js。在這個作品中，我不僅進行了建模，還積極學習並運用了著色器（Shader）和後處理（Post Processing）。從模型製作到 Web 表現不可或缺的技術，這是一個我積極投入且具備高成長性的作品集。`,
      scale: 1, // 模型大小 (scale)
      position: [0, -1, 0] as [number, number, number],
      demoUrl: null,
    },
    {
      id: 2,
      path: "/assets/3d/straeberrycreamcake.glb",
      title: "水彩著色器",
      description: "使用 WebGL 實作的水彩渲染著色器。結合了 Tensor pass、Kuwahara 濾鏡和後處理技術，實現了即時的水彩畫風格表現。",
      scale: 0.2, // 模型大小 (scale)
      position: [0, -3, 0] as [number, number, number],
      demoUrl: "#", // 之後可以替換成實際的外部連結
    },
  ],
}

const uiTranslations = {
  jp: {
    area: "3Dエリア",
    preparing: "準備中...",
    dragToRotate: "ドラッグして回転",
    versionError: "バージョンの更新により、モデルがスムーズに表示できません。恐れ入りますが、以下の画像（image）でご覧ください。大変申し訳ございません。",
    tech: "技術",
    viewDemo: "デモを見る",
    prev: "前へ",
    next: "次へ",
    watercolorMode: "水彩モード",
    normalMode: "通常モード",
  },
  zh: {
    area: "3D 區域",
    preparing: "準備中...",
    dragToRotate: "拖曳以旋轉",
    versionError: "由於版本更新，模型可能無法流暢顯示。不好意思，請參考下方的圖片。非常抱歉。",
    tech: "技術",
    viewDemo: "查看演示",
    prev: "上一頁",
    next: "下一頁",
    watercolorMode: "水彩模式",
    normalMode: "普通模式",
  },
}

// 3D 模型組件
function Model({ path, scale, position }: { path: string; scale: number; position: [number, number, number] }) {
  const { scene } = useGLTF(path)
  return <primitive object={scene} scale={scale} position={position} />
}

function PlaceholderModel() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4a5568" wireframe />
    </mesh>
  )
}

interface Props {
  language: Language
}

export default function ThreeModelShowcase({ language }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [effectsEnabled, setEffectsEnabled] = useState(true)
  const models = modelsData[language]
  const t = uiTranslations[language]
  const currentModel = models[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? models.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === models.length - 1 ? 0 : prev + 1))
  }

  if (models.length === 0) {
    return (
      <section id="3d-models" className="mb-32">
        <PixelText
          text="3D MODELS"
          size="large"
          letterSpacing="wide"
          className="mb-8 sm:mb-16 text-center w-full px-2"
          wordGroups={[
            [0, 1],
            [3, 4, 5, 6, 7, 8],
          ]}
        />
        <div className="max-w-4xl mx-auto">
          <PixelBox className="p-8">
            <div className="text-center font-dotgothic16">
              <p className="mb-4">{t.area}</p>
              <p className="text-sm opacity-70">{t.preparing}</p>
            </div>
          </PixelBox>
        </div>
      </section>
    )
  }

  return (
    <section id="3d-models" className="mb-32">
      <div className="max-w-4xl mx-auto">
        <PixelBox className="p-6 md:p-8">
          {/* 3D Canvas 區域 */}
          <div className="aspect-video bg-gray-900 rounded-lg mb-6 relative overflow-hidden">
            <Canvas
              shadows
              camera={{
                position: [3, 4, 5], // 攝影機位置 [x, y, z] - 數值越小越近
                fov: 45,
                near: 0.1,
                far: 1000,
              }}
              onCreated={(state) => {
                state.camera.position.set(3, 4, 5)
                state.camera.lookAt(0, 0, 0)
              }}
            >
              {/* 根據模型 ID 調整光照與特效 */}
              {currentModel.id === 2 && effectsEnabled ? (
                <>
                  <color attach="background" args={["#1a1a1a"]} />
                  <ambientLight intensity={1.25} />
                  <pointLight position={[10, 10, 10]} intensity={1.5} />
                  <EffectsWrapper enabled={true} radius={4} backgroundColor="#1a1a1a" />
                </>
              ) : (
                <>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                </>
              )}

              <Suspense fallback={null}>
                {currentModel.path ? (
                  <Model path={currentModel.path} scale={currentModel.scale} position={currentModel.position} />
                ) : (
                  <PlaceholderModel />
                )}
                <Environment preset="sunset" />
              </Suspense>

              {/* 軌道控制器 */}
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={2}
                maxDistance={10}
                autoRotate={true}
                autoRotateSpeed={2}
              />
            </Canvas>
            {/* 提示文字 */}
            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white/70 font-dotgothic16 pointer-events-none">
              {t.dragToRotate}
            </div>

            {/* 水彩特效切換開關 (僅在 ID 2 顯示) */}
            {currentModel.id === 2 && (
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setEffectsEnabled(!effectsEnabled)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded border-2 font-dotgothic16 text-sm transition-colors ${
                    effectsEnabled
                      ? "bg-white text-black border-white hover:bg-gray-200"
                      : "bg-black/50 text-white border-white hover:bg-black/70"
                  }`}
                >
                  <Palette size={16} />
                  <span>{effectsEnabled ? t.watercolorMode : t.normalMode}</span>
                </button>
              </div>
            )}
          </div>

          {/* 模型資訊 */}
          <div className="mb-6">
            <PixelText
              text={currentModel.title}
              size="medium"
              letterSpacing="normal"
              className="mb-2"
              wordGroups={[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]]}
            />
            <p className="font-dotgothic16 mb-4 text-gray-300 text-base leading-relaxed">{currentModel.description}</p>
            <div className="flex gap-2 items-center mb-4 flex-wrap">
              <p className="mb-4 text-red-600">{t.versionError}</p>
              <span className="text-sm font-dotgothic16">{t.tech}: </span>
              <TechTag tech="Blender" />
              <TechTag tech="three.js" />
              <TechTag tech="WebGL" />
            </div>

            {currentModel.demoUrl && (
              <a
                href={currentModel.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors"
              >
                <span>{t.viewDemo}</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          {/* 導航控制 */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors relative z-30"
              aria-label="Previous model"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">{t.prev}</span>
            </button>

            <div className="flex gap-2">
              {models.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-white w-8" : "bg-gray-600 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to model ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-dotgothic16 hover:bg-white hover:text-black transition-colors relative z-30"
              aria-label="Next model"
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
