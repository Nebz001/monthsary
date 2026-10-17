import type { CSSProperties, MouseEventHandler, Ref } from "react"
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
  onClick?: MouseEventHandler<HTMLAnchorElement>
  // The circle element, for measuring and for the soft pulse.
  circleRef?: Ref<HTMLSpanElement>
  // Adds a very soft glow layer that the page can pulse to draw the eye here.
  pulse?: boolean
}

export default function HomeItem({
  to,
  label,
  image,
  className = "",
  sizeClass,
  style,
  onClick,
  circleRef,
  pulse = false,
}: HomeItemProps) {
  return (
    <Link
      to={to}
      aria-label={`Open ${label}`}
      data-intro
      style={style}
      onClick={onClick}
      className={`group flex touch-manipulation flex-col items-center gap-[0.5dvh] rounded-3xl p-1 outline-none focus-visible:ring-4 focus-visible:ring-ring/60 ${className}`}
    >
      <span
        ref={circleRef}
        className={`${sizeClass} relative flex size-(--c) items-center justify-center rounded-full border border-keypad-border bg-wine-soft transition-[box-shadow,translate,border-color] duration-300 group-hover:border-blush-border group-hover:shadow-[0_0_2rem_rgba(244,182,207,0.35)] group-focus-visible:border-blush-border group-focus-visible:shadow-[0_0_2rem_rgba(244,182,207,0.35)] group-active:border-blush-border group-active:shadow-[0_0_2rem_rgba(244,182,207,0.35)] motion-safe:group-hover:-translate-y-1.5 motion-safe:group-active:-translate-y-1`}
      >
        {pulse && (
          <span
            aria-hidden="true"
            data-pulse
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_1.6rem_rgba(244,182,207,0.45)]"
          />
        )}
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
