"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

type MonthRow = {
  month: string
  totalSpending: number
  totalIncome: number
  netAmount?: number
}

export default function ModernSpendingChart({
  trendSummary,
}: {
  trendSummary: { sortedMonths: MonthRow[]; avgSpending?: number }
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [innerHeight, setInnerHeight] = useState<number>(200)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const style = window.getComputedStyle(el)
      const paddingTop = parseFloat(style.paddingTop || "0")
      const paddingBottom = parseFloat(style.paddingBottom || "0")
      const reserved = 40
      const h = el.clientHeight - paddingTop - paddingBottom - reserved
      setInnerHeight(Math.max(h, 100))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const months = (trendSummary?.sortedMonths ?? []).slice()
  const rows = months.map((m) => ({
    month: m.month,
    spending: Math.max(0, Math.abs(Number(m.totalSpending || 0))),
    income: Math.max(0, Math.abs(Number(m.totalIncome || 0))),
    net: Number(m.netAmount || 0),
  }))

  const computedMax = Math.max(1, ...rows.map((r) => Math.max(r.spending, r.income)))
  const avgSpending = trendSummary?.avgSpending ?? 0
  const pxFor = (value: number) => Math.max((value / computedMax) * innerHeight, 6)

  const markerCount = 4
  const markers = Array.from({ length: markerCount + 1 }, (_, i) => (computedMax / markerCount) * i)

  if (!rows.length) return <div className="text-sm text-muted-foreground">No data</div>

  return (
    <div className="w-full space-y-2 mb-2">


      {/* Bars Container */}
      <div ref={containerRef} className="relative h-56 mx-3">
        {/* Y-Axis grid + markers */}
        <div className="absolute left-0 top-0 bottom-5 w-full">
          {markers.map((m, i) => {
            const y = (m / computedMax) * innerHeight
            return (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center text-[10px] text-muted-foreground/60"
                style={{ bottom: `${y}px` }}
              >
                <div className="absolute -left-4 w-5 text-right">${m.toFixed(0)}</div>
                <div className="w-full border-t border-border/30" />
              </div>
            )
          })}
        </div>

        {/* Average Line */}
        {avgSpending > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute left-0 right-0 border-t border-dashed border-foreground/30  "
            style={{
              bottom: `${pxFor(avgSpending)}px`,
            }}
          >
            <div className="absolute -right-2 text-[10px] text-rose-500/90">
              Avg ${avgSpending.toFixed(0)}
            </div>
          </motion.div>
        )}

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-between">
          {rows.map((r, i) => {
            const spendPx = pxFor(r.spending)
            const incomePx = pxFor(r.income)
            const overAvg = r.spending > avgSpending

            return (
              <div
                key={r.month}
                className="relative flex-1 flex flex-col items-center group cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Bars */}
                <div className="flex items-end justify-center gap-1" style={{ height: innerHeight }}>
                  {/* Income */}
                  <motion.div
                    layout
                    className="w-[28px] rounded-md bg-gradient-to-t from-emerald-700/70 to-emerald-400/70 hover:from-emerald-600/90 hover:to-emerald-400/80 transition-all duration-200"
                    style={{ height: incomePx }}
                    initial={{ height: 0 }}
                    animate={{ height: incomePx }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />

                  {/* Spending */}
                  <motion.div
                    layout
                    className={cn(
                      "w-[28px] rounded-md transition-all duration-200",
                      overAvg
                        ? "bg-gradient-to-t from-rose-800/90 to-red-400/80 hover:from-rose-600/90 hover:to-red-400/80"
                        : "bg-gradient-to-t from-rose-600/60 to-rose-400/60 hover:from-rose-600/90 hover:to-rose-400/80"
                    )}
                    style={{ height: spendPx }}
                    initial={{ height: 0 }}
                    animate={{ height: spendPx }}
                    transition={{ duration: 0.5, delay: i * 0.05 + 0.05 }}
                  />
                </div>

                {/* Month Label */}
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {new Date(r.month).toLocaleString("default", { month: "short" })}
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoverIndex !== null && hoverIndex === i && (
                    <motion.div
                      key={hoverIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 bg-popover/90 text-popover-foreground text-[11px] border border-border backdrop-blur-md px-3 py-2 rounded-lg shadow-xl w-40"
                    >
                      <div className="font-semibold text-foreground/90 mb-1">
                        {new Date(rows[hoverIndex].month).toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex justify-between">
                        <span>Income</span>
                        <span className="text-emerald-500 font-medium">
                          ${rows[hoverIndex].income.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spending</span>
                        <span className="text-blue-500 font-medium">
                          ${rows[hoverIndex].spending.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "flex justify-between mt-1.5 pt-1 border-t border-border/40 text-xs font-medium",
                          rows[hoverIndex].net >= 0 ? "text-emerald-500" : "text-rose-500"
                        )}
                      >
                        <span className="flex items-center gap-1">
                          {rows[hoverIndex].net >= 0 ? (
                            <ArrowUpRight size={10} />
                          ) : (
                            <ArrowDownRight size={10} />
                          )}
                          Net
                        </span>
                        <span>
                          {rows[hoverIndex].net >= 0 ? "+" : ""}
                          {rows[hoverIndex].net.toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-emerald-500/70" /> Income
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-slate-500/70" /> Spending
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-rose-500/70" /> Over Avg
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm border border-dashed border-amber-500/70" /> Avg Line
        </div>
      </div>
    </div>
  )
}
