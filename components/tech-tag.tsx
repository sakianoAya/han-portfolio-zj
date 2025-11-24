"use client"

import type React from "react"

// 技術標籤連結映射
export const techLinks: Record<string, string> = {
  "Next.js": "https://nextjs.org/",
  Canvas: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
  TypeScript: "https://www.typescriptlang.org/",
  Spine2D: "http://esotericsoftware.com/",
  "After Effects": "https://www.adobe.com/products/aftereffects.html",
  Illustrator: "https://www.adobe.com/products/illustrator.html",
  Photoshop: "https://www.adobe.com/products/photoshop.html",
  Lightroom: "https://www.adobe.com/products/photoshop-lightroom.html",
  React: "https://reactjs.org/",
  "Three.js": "https://threejs.org/",
  "three.js": "https://threejs.org/",
  GSAP: "https://greensock.com/gsap/",
  Line2D: "https://www.live2d.com/",
  "Clip Studio": "https://www.clipstudio.net/",
  Lottie: "https://lottiefiles.com/",
  Blender: "https://www.blender.org/",
  WebGL: "https://www.khronos.org/webgl/",
}

export function TechTag({ tech }: { tech: string }) {
  const link = techLinks[tech]

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`px-2 py-1 text-xs rounded bg-opacity-30 bg-white font-dotgothic16 transition-all duration-200 relative z-30 ${
        link ? "hover:bg-opacity-50 hover:scale-105 cursor-pointer" : "cursor-default"
      }`}
      title={link ? `點擊查看 ${tech} 官方網站` : tech}
    >
      {tech}
    </button>
  )
}
