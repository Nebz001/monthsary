import { useEffect, useRef } from "react"
import { animate } from "animejs"

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

const IMG = `${import.meta.env.BASE_URL}images/`
const SIZE = 1254

// Share of each (square, padded) image that the artwork itself covers.
// Item sizes below describe the visible artwork, then get divided by this.
const COVERAGE = {
  "heart-small": 0.39,
  "heart-sparkle": 0.75,
  "petal-pink": 0.72,
  sparkle: 0.66,
} as const

type Kind = keyof typeof COVERAGE

type Item = {
  src: Kind
  // Centre of the item, as a percentage of the screen.
  x: number
  y: number
  // Visible artwork width, any CSS length.
  size: string
  rotate: number
  motion: "float" | "twinkle"
  // Extra classes, used to drop items that would crowd the keypad on phones.
  className?: string
}

const ITEMS: Item[] = [
  { src: "heart-small", x: 10, y: 11, size: "clamp(26px,4.6vw,42px)", rotate: -10, motion: "float" },
  { src: "sparkle", x: 21, y: 6.5, size: "clamp(14px,2.2vw,20px)", rotate: 0, motion: "twinkle" },
  { src: "sparkle", x: 90, y: 30, size: "clamp(12px,1.9vw,18px)", rotate: 0, motion: "twinkle" },
  { src: "petal-pink", x: 8, y: 38, size: "clamp(28px,4.2vw,40px)", rotate: -25, motion: "float", className: "max-sm:hidden" },
  { src: "petal-pink", x: 91, y: 37, size: "clamp(28px,4.2vw,40px)", rotate: 60, motion: "float", className: "sm:hidden" },
  { src: "petal-pink", x: 91, y: 49, size: "clamp(28px,4.2vw,40px)", rotate: 70, motion: "float", className: "max-sm:hidden" },
  { src: "sparkle", x: 9.5, y: 55, size: "clamp(10px,1.6vw,14px)", rotate: 0, motion: "twinkle", className: "max-sm:hidden" },
  { src: "heart-sparkle", x: 87, y: 77, size: "clamp(32px,5vw,48px)", rotate: 12, motion: "float", className: "max-sm:hidden" },
]

function Corner({ className }: { className: string }) {
  return (
    <img
      src={`${IMG}corner-flowers.png`}
      alt=""
      width={SIZE}
      height={SIZE}
      decoding="async"
      className={`absolute w-[clamp(7.5rem,min(34vw,38dvh),21rem)] max-w-none select-none ${className}`}
    />
  )
}

export default function FloatingDecor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !rootRef.current) return
    const root = rootRef.current
    const anims = [
      ...Array.from(root.querySelectorAll("[data-float]")).map((el, i) =>
        animate(el, {
          translateY: [0, i % 2 ? -12 : 12],
          translateX: [0, i % 2 ? 5 : -5],
          duration: 4200 + i * 700,
          delay: i * 350,
          ease: "inOutSine",
          loop: true,
          alternate: true,
        }),
      ),
      ...Array.from(root.querySelectorAll("[data-twinkle]")).map((el, i) =>
        animate(el, {
          opacity: [0.4, 1],
          scale: [0.8, 1.15],
          duration: 1800 + i * 400,
          delay: i * 300,
          ease: "inOutSine",
          loop: true,
          alternate: true,
        }),
      ),
    ]
    return () => anims.forEach((a) => a.revert())
  }, [reduced])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Corner className="top-0 right-0 -scale-x-100" />
      <Corner className="bottom-0 left-0 -scale-y-100" />

      {ITEMS.map((item, i) => (
        <img
          key={i}
          src={`${IMG}${item.src}.png`}
          alt=""
          width={SIZE}
          height={SIZE}
          decoding="async"
          data-float={item.motion === "float" ? "" : undefined}
          data-twinkle={item.motion === "twinkle" ? "" : undefined}
          className={`absolute max-w-none -translate-x-1/2 -translate-y-1/2 select-none ${item.className ?? ""}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `calc(${item.size} / ${COVERAGE[item.src]})`,
            rotate: `${item.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}
