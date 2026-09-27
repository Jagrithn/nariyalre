"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"

type SwipeToAcceptProps = {
  onComplete: () => void
  disabled?: boolean
  label?: string
}

export function SwipeToAccept({
  onComplete,
  disabled = false,
  label = "Swipe to accept",
}: SwipeToAcceptProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [done, setDone] = useState(false)
  const dragState = useRef<{ startX: number; startOffset: number } | null>(null)

  const maxOffset = () => {
    const track = trackRef.current
    if (!track) return 0
    return track.clientWidth - 48 - 4
  }

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const drag = dragState.current
      if (!drag) return
      const delta = e.clientX - drag.startX
      setOffset(Math.min(maxOffset(), Math.max(0, drag.startOffset + delta)))
    }
    const up = () => {
      if (!dragState.current) return
      dragState.current = null
      setOffset((current) => {
        if (current >= maxOffset() * 0.8) {
          setDone(true)
          setTimeout(() => onComplete(), 300)
          return maxOffset()
        }
        return 0
      })
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
  }, [onComplete])

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => {
        if (disabled || done) return
        dragState.current = { startX: e.clientX, startOffset: offset }
      }}
      className={cn(
        "relative h-[52px] touch-none overflow-hidden rounded-full border select-none",
        done
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-emerald-600/40 bg-emerald-600/10 text-emerald-700",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center gap-1.5 text-sm font-semibold">
        {done ? (
          <>
            <Check className="size-4.5" />
            Job accepted
          </>
        ) : (
          label
        )}
      </div>
      <div
        className="absolute top-1 bottom-1 left-1 z-10 flex size-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {done ? <Check className="size-5" /> : <ArrowRight className="size-5" />}
      </div>
    </div>
  )
}