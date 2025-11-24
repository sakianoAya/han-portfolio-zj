"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

export function ParallaxBackground() {
  const { scrollY } = useScroll()
  const [windowHeight, setWindowHeight] = useState(0)

  // Parallax movement for different layers
  // Adjust these values to control the speed of the parallax effect
  const y1 = useTransform(scrollY, [0, 1000], [0, 150])
  const y2 = useTransform(scrollY, [0, 1000], [0, 300])
  const y3 = useTransform(scrollY, [0, 1000], [0, 450])

  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; layer: 1 | 2 | 3 }[]>([])

  useEffect(() => {
    setWindowHeight(window.innerHeight)

    // Generate random stars
    const starCount = 50
    const newStars = []

    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: Math.random() > 0.5 ? 2 : 4, // pixel size
        layer: Math.random() < 0.33 ? 1 : Math.random() < 0.66 ? 2 : (3 as 1 | 2 | 3),
      })
    }
    setStars(newStars)
  }, [])

  if (stars.length === 0) return null

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Layer 1 - Slowest (Furthest) */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        {stars
          .filter((s) => s.layer === 1)
          .map((star) => (
            <div
              key={star.id}
              className="absolute bg-gray-800 rounded-none opacity-40"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
            />
          ))}
      </motion.div>

      {/* Layer 2 - Medium */}
      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {stars
          .filter((s) => s.layer === 2)
          .map((star) => (
            <div
              key={star.id}
              className="absolute bg-gray-700 rounded-none opacity-30"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
            />
          ))}
      </motion.div>

      {/* Layer 3 - Fastest (Closest) */}
      <motion.div style={{ y: y3 }} className="absolute inset-0">
        {stars
          .filter((s) => s.layer === 3)
          .map((star) => (
            <div
              key={star.id}
              className="absolute bg-gray-600 rounded-none opacity-20"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
            />
          ))}
      </motion.div>

      {/* Optional: Add a subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
    </div>
  )
}
