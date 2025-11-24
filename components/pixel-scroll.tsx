"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export function PixelScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    let lastTime = 0
    const fps = 12
    const frameInterval = 1000 / fps

    function raf(time: number) {
      const deltaTime = time - lastTime

      if (deltaTime >= frameInterval) {
        lenis.raf(time)
        lastTime = time
      }

      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return null
}
