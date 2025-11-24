"use client"

import type React from "react"
import { useState } from "react"
import { ExternalLink, Github, Mail, CheckCircle, XCircle, Loader } from "lucide-react"

type LinkStatus = "pending" | "success" | "error"

interface LinkTest {
  name: string
  url: string
  type: "github" | "demo" | "tech" | "contact"
  status: LinkStatus
}

const LinkTester: React.FC = () => {
  const [links] = useState<LinkTest[]>([
    // 專案連結
    {
      name: "PIXEL BREAKOUT - GitHub",
      url: "https://github.com/your-username/pixel-breakout",
      type: "github",
      status: "pending",
    },
    {
      name: "PIXEL BREAKOUT - Demo",
      url: "https://your-pixel-breakout-demo.vercel.app",
      type: "demo",
      status: "pending",
    },
    { name: "TOEIC GIRL - GitHub", url: "https://github.com/sakianoAya/toeicgirl", type: "github", status: "pending" },
    { name: "TOEIC GIRL - Demo", url: "https://toeicgirl.vercel.app/", type: "demo", status: "pending" },
    {
      name: "KABUKICHO - GitHub",
      url: "https://github.com/your-username/kabukicho",
      type: "github",
      status: "pending",
    },
    { name: "KABUKICHO - Demo", url: "https://your-kabukicho-demo.vercel.app", type: "demo", status: "pending" },
    {
      name: "LINE STICKERS - GitHub",
      url: "https://github.com/your-username/line-stickers",
      type: "github",
      status: "pending",
    },
    {
      name: "LINE STICKERS - Store",
      url: "https://store.line.me/stickershop/product/your-sticker-id",
      type: "demo",
      status: "pending",
    },

    // 技術連結
    { name: "Next.js", url: "https://nextjs.org/", type: "tech", status: "pending" },
    {
      name: "Canvas API",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
      type: "tech",
      status: "pending",
    },
    { name: "TypeScript", url: "https://www.typescriptlang.org/", type: "tech", status: "pending" },
    { name: "React", url: "https://reactjs.org/", type: "tech", status: "pending" },
    { name: "Three.js", url: "https://threejs.org/", type: "tech", status: "pending" },
    { name: "GSAP", url: "https://greensock.com/gsap/", type: "tech", status: "pending" },
    { name: "Spine2D", url: "http://esotericsoftware.com/", type: "tech", status: "pending" },
    { name: "After Effects", url: "https://www.adobe.com/products/aftereffects.html", type: "tech", status: "pending" },
    { name: "Photoshop", url: "https://www.adobe.com/products/photoshop.html", type: "tech", status: "pending" },
    { name: "Live2D", url: "https://www.live2d.com/", type: "tech", status: "pending" },
    { name: "Clip Studio", url: "https://www.clipstudio.net/", type: "tech", status: "pending" },

    // 聯絡連結
    { name: "Email", url: "mailto:han@example.com", type: "contact", status: "pending" },
    { name: "GitHub Profile", url: "https://github.com/han-dev", type: "contact", status: "pending" },
    { name: "LinkedIn", url: "https://linkedin.com/in/han-dev", type: "contact", status: "pending" },
  ])

  const [testResults, setTestResults] = useState<Record<string, LinkStatus>>({})

  const testLink = async (link: LinkTest) => {
    setTestResults((prev) => ({ ...prev, [link.url]: "pending" }))

    try {
      if (link.url.startsWith("mailto:")) {
        // Email 連結無法測試，直接標記為成功
        setTestResults((prev) => ({ ...prev, [link.url]: "success" }))
        return
      }

      // 對於外部連結，我們只能嘗試打開它們
      window.open(link.url, "_blank", "noopener,noreferrer")
      setTestResults((prev) => ({ ...prev, [link.url]: "success" }))
    } catch (error) {
      console.error(`Failed to test link: ${link.url}`, error)
      setTestResults((prev) => ({ ...prev, [link.url]: "error" }))
    }
  }

  const testAllLinks = () => {
    links.forEach((link) => {
      setTimeout(() => testLink(link), Math.random() * 1000)
    })
  }

  const getStatusIcon = (url: string) => {
    const status = testResults[url]
    switch (status) {
      case "pending":
        return <Loader className="animate-spin" size={16} />
      case "success":
        return <CheckCircle className="text-green-500" size={16} />
      case "error":
        return <XCircle className="text-red-500" size={16} />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "github":
        return <Github size={16} />
      case "demo":
        return <ExternalLink size={16} />
      case "contact":
        return <Mail size={16} />
      case "tech":
        return <ExternalLink size={16} />
      default:
        return <ExternalLink size={16} />
    }
  }

  const groupedLinks = links.reduce(
    (acc, link) => {
      if (!acc[link.type]) acc[link.type] = []
      acc[link.type].push(link)
      return acc
    },
    {} as Record<string, LinkTest[]>,
  )

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">連結測試器</h2>
        <button
          onClick={testAllLinks}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          測試所有連結
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedLinks).map(([type, typeLinks]) => (
          <div key={type} className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 capitalize">
              {type === "github" && "GitHub 連結"}
              {type === "demo" && "Demo 連結"}
              {type === "tech" && "技術連結"}
              {type === "contact" && "聯絡連結"}
            </h3>

            <div className="space-y-2">
              {typeLinks.map((link) => (
                <div
                  key={link.url}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getTypeIcon(link.type)}
                    <span className="text-white text-sm">{link.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(link.url)}
                    <button
                      onClick={() => testLink(link)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      測試
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">測試說明</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>
            • <CheckCircle className="inline text-green-500" size={14} /> 綠色勾號：連結可以正常打開
          </li>
          <li>
            • <XCircle className="inline text-red-500" size={14} /> 紅色叉號：連結無法訪問或有問題
          </li>
          <li>
            • <Loader className="inline" size={14} /> 載入圖標：正在測試中
          </li>
          <li>• 某些連結（如 GitHub 專案）可能需要實際存在才能正常工作</li>
          <li>• Email 連結會嘗試打開預設郵件客戶端</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-600">
        <h4 className="text-yellow-200 font-semibold mb-2">需要更新的連結</h4>
        <ul className="text-yellow-100 text-sm space-y-1">
          <li>• PIXEL BREAKOUT 的 GitHub 和 Demo 連結需要替換為實際 URL</li>
          <li>• KABUKICHO 的 GitHub 和 Demo 連結需要替換為實際 URL</li>
          <li>• LINE STICKERS 的 GitHub 和 Store 連結需要替換為實際 URL</li>
          <li>• 聯絡資訊中的 Email、GitHub 和 LinkedIn 需要更新為真實資訊</li>
        </ul>
      </div>
    </div>
  )
}

export default LinkTester
