"use client"

import { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, useGLTF } from "@react-three/drei"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { PixelBox } from "@/components/pixel-box"
import PixelText from "@/components/pixel-text"
import { TechTag } from "@/components/tech-tag"

const models = [
  {
    id: 1,
    path: "/assets/3d/duck.glb",
    title: "3D Model",
    description: `将来性の高い3D分野の技術を習得するため、大学時代の経験を活かし、オンライン教材を通じてBlenderとthree.jsを習得しました。本作品では、モデリングだけでなく、シェーダー（Shader）やポストプロセス（Post Processing）も積極的に学習・活用しています。モデルの制作から、Webでの表現に欠かせない技術まで、意欲的に取り組んでいる成長性の高いポートフォリオです。`,
    scale: 2,
    position: [0, -1, 0] as [number, number, number],
    demoUrl: null,
  },
  {
    id: 2,
    path: null, // 不載入模型，改為外部連結
    title: "Watercolor Shader",
    description:
      "WebGLで実装した水彩レンダリングシェーダー。Tensorパス、Kuwaharaフィルタ、ポストプロセシングを組み合わせて、リアルタイムで水彩画のような表現を実現しました。",
    scale: 1,
    position: [0, 0, 0] as [number, number, number],
    demoUrl: "#", // 之後可以替換成實際的外部連結
  },
]

const SECTION_TITLE = "3D MODEL"
const DEFAULT_DESCRIPTION =
  "将来性の高い3D分野の技術を習得するため、大学時代の経験を活かし、オンライン教材を通じてBlenderとthree.jsを習得しました。本作品では、モデリングだけでなく、シェーダー（Shader）やポストプロセス（Post Processing）も積極的に学習・活用しています。モデルの制作から、Webでの表現に欠かせない技術まで、意欲的に取り組んでいる成長性の高いポートフォリオです。"

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

export default function ThreeModelShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
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
              <p className="mb-4">3Dエリア</p>
              <p className="text-sm opacity-70">準備中...</p>
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
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />

              {/* 環境光照 */}
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />

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
              ドラッグして回転
            </div>
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
              <p className="mb-4 text-red-600">バージョンの更新により、モデルがスムーズに表示できません。恐れ入りますが、以下の画像（image）でご覧ください。大変申し訳ございません。</p>
              <span className="text-sm font-dotgothic16">技術: </span>
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
                <span>デモを見る</span>
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
              <span className="hidden sm:inline">前へ</span>
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
              <span className="hidden sm:inline">次へ</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </PixelBox>
      </div>
    </section>
  )
}
