import type { CSSProperties } from "react"
import { Link } from "react-router-dom"

import { IMG_SIZE, img } from "@/lib/assets"

type HomeItemProps = {
  to: string
  label: string
  image: string
  // Layout classes for the link (grid placement).
  className?: string
  // Circle diameter, set through the --c variable.
  sizeClass: string
  style?: CSSProperties
}

export default function HomeItem({
  to,
  label,
  image,
  className = "",
  sizeClass,
  style,
}: HomeItemProps) {
  return (
    <Link
      to={to}
      aria-label={`Open ${label}`}
      data-intro
      style={style}
      className={`group flex touch-manipulation flex-col items-center gap-[0.5dvh] rounded-3xl p-1 outline-none focus-visible:ring-4 focus-visible:ring-ring/60 ${className}`}
    >
      <span
        className={`${sizeClass} flex size-(--c) items-center justify-center rounded-full border border-keypad-border bg-wine-soft transition-[box-shadow,translate,border-color] duration-300 group-hover:border-blush-border group-hover:shadow-[0_0_2rem_rgba(244,182,207,0.35)] group-focus-visible:border-blush-border group-focus-visible:shadow-[0_0_2rem_rgba(244,182,207,0.35)] group-active:border-blush-border group-active:shadow-[0_0_2rem_rgba(244,182,207,0.35)] motion-safe:group-hover:-translate-y-1.5 motion-safe:group-active:-translate-y-1`}
      >
        <img
          src={img(image)}
          alt=""
          width={IMG_SIZE}
          height={IMG_SIZE}
          decoding="async"
          className="size-[92%] select-none"
        />
      </span>
      <span className="font-script text-[clamp(1.9rem,9vw,2.6rem)] leading-none text-foreground sm:text-[clamp(1.9rem,min(6.2vw,5.5dvh),3.4rem)]">
        {label}
      </span>
    </Link>
  )
}
