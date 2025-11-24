import type React from "react"

type FallbackTextProps = {
  text: string
  className?: string
}

const FallbackText: React.FC<FallbackTextProps> = ({ text, className = "" }) => {
  return <div className={`text-white ${className}`}>{text}</div>
}

export default FallbackText
