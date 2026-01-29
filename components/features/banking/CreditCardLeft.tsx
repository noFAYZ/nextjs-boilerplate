export interface UIAccount {
    name: string
    category: string
    type: string
    balance: number
    currency: string
    institutionName?: string
    institutionLogo?: string | null
    mask?: string | null
    icon?: string | null
    color?: string | null
  }

import { getLogoUrl } from "@/lib/services/logo-service"
  import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { HeroiconsWallet, MdiDollar } from "../icons/icons"
import { CurrencyDisplay } from "../ui/currency-display"
import { BgGradient } from "../landing/bg/bg-gradient"
import { Card } from "../ui/card"
import { useLogoGradient } from "@/lib/utils/useGradientFromImage"

 

const colorCache = new Map<string, string>()

 
import clsx from "clsx";
import { LucideDollarSign } from "lucide-react"

interface CreditCardProps {
  account: any;
  logo?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZE_MAP = {
  xs: { w: "w-28", h: "h-16", px: "px-2", py: "py-1.5", text: "text-[9px]" },
  sm: { w: "w-58", h: "h-32", px: "px-3", py: "py-2", text: "text-[10px]" },
  md: { w: "w-60", h: "h-32", px: "px-4", py: "py-3", text: "text-[11px]" },
  lg: { w: "w-72", h: "h-40", px: "px-4", py: "py-3", text: "text-[12px]" },
};

export function CreditCard({ account, logo, size = "md" }: CreditCardProps) {
  const {
    name,
    category,
    type,
    balance,
    currency,
    institutionName,
    institutionLogo,
    mask,
    icon,
    color,
  } = account;

  const { gradient } = useLogoGradient(logo ?? institutionLogo ?? "");

  const s = SIZE_MAP[size];

  return (
    <Card
    
      className={clsx(
        s.w,
        s.h,
        s.px,
        s.py,
        "rounded-lg text-white shadow-none flex flex-col justify-between      ",
        "bg-gradient-to-tr from-orange-900 via-amber-800 to-black"
      )}
      style={{ backgroundImage: gradient ?? 'linear-gradient(135deg, rgb(20,20,25) 0%, rgb(144,144,145) 100%)' }}
      key={account.id}
    >
      {/* Header */}
      <div className="flex items-center   gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {logo || institutionLogo ? (
            <Avatar className={clsx("shadow-lg ring ",
                size === "xs" ? "w-6 h-6 text-[8px]" :
                size === "sm" ? "w-6 h-6 text-[9px]" :
                size === "md" ? "w-9 h-9 text-[10px]" : "w-12 h-12 text-[12px]")}  >
              <AvatarImage
                src={logo }
                alt={institutionName ?? "Institution"}
              />
              <AvatarFallback>
             <LucideDollarSign />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div
              className={clsx(
                "rounded-full bg-white/20 flex items-center justify-center font-semibold",
                size === "xs" ? "w-6 h-6 text-[8px]" :
                size === "sm" ? "w-6 h-6 text-[9px]" :
                size === "md" ? "w-9 h-9 text-[10px]" : "w-12 h-12 text-[12px]"
              )}
            >
              {icon ?? institutionName?.[0] ?? "?"}
            </div>
          )}

          <div className="min-w-0">
            <div className={clsx("truncate font-semibold", s.text)}>{institutionName || category}</div>
           {/*<div className={clsx("truncate text-gray-300", s.text)}>
           {mask ? `•••• ${mask}` : ""}
            </div>  */} 
          </div>
        </div>

      
      </div>

  

      <div className="flex justify-between items-end gap-2 ">

       {/* 3D Chip
      <div className=" relative  w-4.5 h-3 bg-gradient-to-tr from-yellow-400 to-yellow-200 rounded-sm shadow-inner grid grid-cols-2 gap-1">
        <div className="absolute border border-gray-900 rounded-xs w-2.5 h-2 left-1 top-0.5" />
        <div className="border-b border-r border-gray-900 rounded-br" />
        <div className="border-b border-l border-gray-900 rounded-bl" />
        <div />
        <div />
        <div className="border-t border-r border-gray-900 rounded-tr" />
        <div className="border-t border-l border-gray-900 rounded-tl" />
      </div>  */}
          <div className={clsx("truncate text-gray-300", s.text)}>
           {mask ? `${mask}` : ""}
            </div> 
        
      <span
          className={clsx(
            " px-1 py-0.5 rounded-md text-[8px] bg-black/30 border border-white/10",
           
          )}
        >
          {type.replaceAll("_", " ")}
        </span>
      </div>

    </Card>
  );
}




type GradientResult = {
    gradient: string
    colors: [string, string]
  }
  
  type GradientOptions = {
    luminanceThreshold?: number
    sampleRate?: number
    angle?: number
    minContrast?: number
  }
  
  const DEFAULTS = {
    luminanceThreshold: 115,
    sampleRate: 6,
    angle: 135,
    minContrast: 40,
  }
  
  const gradientCache = new Map<string, GradientResult>()
  
  export async function extractDarkGradientFromImage(
    imageUrl: string,
    options?: GradientOptions
  ): Promise<GradientResult> {
    if (gradientCache.has(imageUrl)) {
      return gradientCache.get(imageUrl)!
    }
  
    const {
      luminanceThreshold,
      sampleRate,
      angle,
      minContrast,
    } = { ...DEFAULTS, ...options }
  
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl
  
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject()
    })
  
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) throw new Error("Canvas unavailable")
  
    const maxSize = 256
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
  
    canvas.width = Math.floor(img.width * scale)
    canvas.height = Math.floor(img.height * scale)
  
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
    const colorMap = new Map<string, number>()
  
    for (let i = 0; i < data.length; i += 4 * sampleRate) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
  
      if (a < 200) continue
  
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
      if (luminance > luminanceThreshold) continue
  
      const key = `${r},${g},${b}`
      colorMap.set(key, (colorMap.get(key) || 0) + 1)
    }
  
    const sorted = [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([rgb]) => rgb)
      .slice(0, 5)
  
    const primary = sorted[0] ?? "24,24,27"
    let secondary =
      sorted.find(c => colorDistance(primary, c) > minContrast) ??
      "9,9,11"
  
    const c1 = `rgb(${primary})`
    const c2 = `rgb(${secondary})`
  
    const result: GradientResult = {
      colors: [c1, c2],
      gradient: `linear-gradient(${angle}deg, ${c1}, ${c2})`,
    }
  
    gradientCache.set(imageUrl, result)
    return result
  }
  
  /* ──────────────────────────────────────────────────────────────
     Utilities
  ────────────────────────────────────────────────────────────── */
  
  function colorDistance(a: string, b: string) {
    const [r1, g1, b1] = a.split(",").map(Number)
    const [r2, g2, b2] = b.split(",").map(Number)
    return Math.sqrt(
      (r1 - r2) ** 2 +
      (g1 - g2) ** 2 +
      (b1 - b2) ** 2
    )
  }
  
  
  export function mapAccountToUI(account: any): UIAccount { return { name: account.name, category: account.category, type: account.type, balance: account.balance, currency: account.currency, institutionName: account.institutionName || undefined, institutionLogo: account.institutionLogo ?? null, mask: account.mask ?? null, icon: account.icon ?? null, color: account.color ?? null, } }