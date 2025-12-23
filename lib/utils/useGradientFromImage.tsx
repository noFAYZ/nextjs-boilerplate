"use client"

import { useEffect, useState } from "react"

/* ──────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────── */

type LogoGradientResult = {
  gradient: string
  colors: [string, string]
  accent: string
}

type UseLogoGradientResult = {
  gradient: string | null
  colors: [string, string] | null
  accent: string | null
  loading: boolean
  ready: boolean
}

/* ──────────────────────────────────────────────────────────────
   Cache
────────────────────────────────────────────────────────────── */

const gradientCache = new Map<string, LogoGradientResult>()

const FALLBACK_DARK: LogoGradientResult = {
  colors: ["rgb(24,24,27)", "rgb(39,39,42)"],
  accent: "rgb(113,113,122)",
  gradient:
    "linear-gradient(135deg, rgb(20,20,25) 0%, rgb(144,144,145) 100%)",
}

const FALLBACK_LIGHT: LogoGradientResult = {
  colors: ["rgb(250,250,250)", "rgb(244,244,245)"],
  accent: "rgb(228,228,231)",
  gradient:
    "linear-gradient(135deg, rgb(250,250,250) 0%, rgb(244,244,245) 100%)",
}

/* ──────────────────────────────────────────────────────────────
   Hook
────────────────────────────────────────────────────────────── */

export function useLogoGradient(
  imageUrl?: string | null,
  theme: "dark" | "light" = "dark"
): UseLogoGradientResult {
  const [state, setState] = useState<UseLogoGradientResult>({
    gradient: null,
    colors: null,
    accent: null,
    loading: false,
    ready: false,
  })

  useEffect(() => {
    if (!imageUrl) {
      const fallback = theme === "dark" ? FALLBACK_DARK : FALLBACK_LIGHT
      setState({
        ...fallback,
        loading: false,
        ready: true,
      })
      return
    }

    const cacheKey = `${imageUrl}-${theme}`
    if (gradientCache.has(cacheKey)) {
      const cached = gradientCache.get(cacheKey)!
      setState({
        ...cached,
        loading: false,
        ready: true,
      })
      return
    }

    let cancelled = false
    setState(s => ({ ...s, loading: true }))

    ;(async () => {
      try {
        const result = await createSubtleCardGradient(imageUrl, theme)
        gradientCache.set(cacheKey, result)

        if (!cancelled) {
          setState({
            ...result,
            loading: false,
            ready: true,
          })
        }
      } catch {
        if (!cancelled) {
          const fallback = theme === "dark" ? FALLBACK_DARK : FALLBACK_LIGHT
          setState({
            ...fallback,
            loading: false,
            ready: true,
          })
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [imageUrl, theme])

  return state
}

/* ──────────────────────────────────────────────────────────────
   Core Gradient Generator (Subtle Version)
────────────────────────────────────────────────────────────── */

async function createSubtleCardGradient(
  imageUrl: string,
  theme: "dark" | "light" = "dark",
  angle = 135
): Promise<LogoGradientResult> {
  const baseColor = await extractBrandColor(imageUrl)
  const [r, g, b] = parse(baseColor)
  
  // For dark theme: subtle dark backgrounds with accent color
  if (theme === "dark") {
    // Create a very dark base from the brand color
    const darkBase = darken(baseColor, 0.65)
    const [dr, dg, db] = parse(darkBase)
    
    // Create a slightly lighter variant (subtle contrast)
    const darkVariant = `rgb(${Math.min(dr + 95, 255)}, ${Math.min(dg + 95, 255)}, ${Math.min(db + 95, 255)})`
    
    // Very subtle accent (zinc-600 equivalent)
    const accent = "rgb(82,82,91)"
    
    return {
      colors: [darkBase, darkVariant],
      accent,
      gradient: `
        linear-gradient(
          ${angle}deg,
          ${darkVariant},
          ${darkBase}
        )
      `.trim(),
    }
  }
  
  // For light theme: subtle light backgrounds
  else {
    // Create a very light base from the brand color
    const lightBase = lighten(baseColor,0.8)
    const [lr, lg, lb] = parse(lightBase)
    
    // Create a slightly darker variant
    const lightVariant = `rgb(${Math.max(lr - 9, 0)}, ${Math.max(lg - 9, 0)}, ${Math.max(lb - 20, 0)})`
    
    // Subtle accent (zinc-300 equivalent)
    const accent = "rgb(212,212,216)"
    
    return {
      colors: [lightBase, lightVariant],
      accent,
      gradient: `
        linear-gradient(
          ${angle}deg,
          ${lightBase},
          ${lightVariant}
        )
      `.trim(),
    }
  }
}

/* ──────────────────────────────────────────────────────────────
   Brand Color Extraction
────────────────────────────────────────────────────────────── */

async function extractBrandColor(imageUrl: string): Promise<string> {
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.src = imageUrl

  await new Promise<void>((res, rej) => {
    img.onload = () => res()
    img.onerror = () => rej()
  })

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!
  canvas.width = 96
  canvas.height = 96
  ctx.drawImage(img, 0, 0, 96, 96)

  const { data } = ctx.getImageData(0, 0, 96, 96)

  let best: [number, number, number] | null = null
  let bestScore = -Infinity

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    if (a < 200) continue
    if (r > 240 && g > 240 && b > 240) continue

    const sat = saturation([r, g, b])
    const lum = luminance([r, g, b])

    const score = sat * 1.4 - Math.abs(lum - 0.8)

    if (score > bestScore) {
      bestScore = score
      best = [r, g, b]
    }
  }

  if (!best) return "rgb(24,24,27)"
  return `rgb(${best[0]}, ${best[1]}, ${best[2]})`
}

/* ──────────────────────────────────────────────────────────────
   Color Utilities
────────────────────────────────────────────────────────────── */

function luminance([r, g, b]: number[]) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

function saturation([r, g, b]: number[]) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return max === 0 ? 0 : (max - min) / max
}

function parse(rgb: string): [number, number, number] {
  return rgb.match(/\d+/g)!.map(Number) as any
}

function darken(rgb: string, amount: number) {
  const [r, g, b] = parse(rgb)
  return `rgb(${Math.round(r * (1 - amount))}, ${Math.round(
    g * (1 - amount)
  )}, ${Math.round(b * (1 - amount))})`
}

function lighten(rgb: string, amount: number) {
  const [r, g, b] = parse(rgb)
  return `rgb(${Math.round(r + (255 - r) * amount)}, ${Math.round(
    g + (255 - g) * amount
  )}, ${Math.round(b + (255 - b) * amount)})`
}

function saturate(rgb: string, amount: number) {
  const [r, g, b] = parse(rgb)
  const avg = (r + g + b) / 3
  return `rgb(${Math.round(r + (r - avg) * amount)}, ${Math.round(
    g + (g - avg) * amount
  )}, ${Math.round(b + (b - avg) * amount)})`
}

function rgba(rgb: string, a: number) {
  const [r, g, b] = parse(rgb)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}