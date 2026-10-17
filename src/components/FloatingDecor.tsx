import { useEffect, useRef } from "react"
import { animate } from "animejs"

import { IMG_SIZE as SIZE, img } from "@/lib/assets"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

// Share of each (square, padded) image that the artwork itself covers.
// Item sizes below describe the visible artwork, then get divided by this.
const COVERAGE = {
  "heart-small": 0.39,
  "heart-sparkle": 0.75,
  "petal-pink": 0.72,
  sparkle: 0.66,
} as const

type Kind = keyof typeof COVERAGE

export type DecorItem = {
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


function Corner({ className }: { className: string }) {
  return (
    <img
      src={img("corner-flowers.png")}
      alt=""
      width={SIZE}
      height={SIZE}
      decoding="async"
      className={`absolute w-[clamp(7.5rem,min(34vw,38dvh),21rem)] max-w-none select-none ${className}`}
    />
  )
}

export type CornerName = "top-right" | "bottom-left" | "bottom-right"

// Corner art is drawn top left, so each corner flips it into place.
const CORNER_CLASS: Record<CornerName, string> = {
  "top-right": "top-0 right-0 -scale-x-100",
  "bottom-left": "bottom-0 left-0 -scale-y-100",
  "bottom-right": "right-0 bottom-0 -scale-100",
}

export default function FloatingDecor({
  items,
  corners = ["top-right", "bottom-left"],
}: {
  items: DecorItem[]
  corners?: CornerName[]
}) {
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
      {corners.map((name) => (
        <Corner key={name} className={CORNER_CLASS[name]} />
      ))}

      {items.map((item, i) => (
        <img
          key={i}
          src={img(`${item.src}.png`)}
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
