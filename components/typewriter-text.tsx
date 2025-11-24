"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface TypewriterTextProps {
  text: string
  className?: string
  cursorColor?: string
}

export default function TypewriterText({ text, className, cursorColor = "currentColor" }: TypewriterTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  // Split text into array of characters
  const characters = Array.from(text)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, display: "none" }, // display: none prevents layout shifts/gaps
    visible: {
      opacity: 1,
      display: "inline",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <motion.span
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        aria-label={text}
      >
        {characters.map((char, index) => (
          <motion.span key={index} variants={childVariants}>
            {char}
          </motion.span>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
          style={{
            display: "inline-block",
            width: "0.5em",
            height: "1em",
            backgroundColor: cursorColor,
            verticalAlign: "text-bottom",
            marginLeft: "2px",
          }}
        />
      </motion.span>
    </div>
  )
}
