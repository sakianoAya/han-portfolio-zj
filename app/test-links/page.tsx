"use client"
import LinkTester from "@/components/link-tester"
import { ThemeProvider } from "@/contexts/theme-context"

export default function TestLinksPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto">
          <LinkTester />
        </div>
      </div>
    </ThemeProvider>
  )
}
