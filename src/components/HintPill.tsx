import type { CSSProperties, MouseEventHandler, Ref } from "react"
import { Link } from "react-router-dom"

import { IMG_SIZE, img } from "@/lib/assets"

type HintPillProps = {
  ref?: Ref<HTMLAnchorElement>
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

// Nudges her to start with the song. Also a link to the song page.
export default function HintPill({ ref, style, onClick }: HintPillProps) {
  return (
    <Link
      ref={ref}
      to="/song"
      data-intro
      style={style}
      onClick={onClick}
      className="mt-[0.6dvh] inline-flex min-h-10 w-fit max-w-full touch-manipulation items-center justify-center gap-1.5 rounded-full border border-[#e3b565] bg-wine-soft px-[clamp(0.75rem,3.5vw,1.25rem)] py-1 outline-none transition-colors hover:bg-wine focus-visible:ring-4 focus-visible:ring-ring/60 active:scale-[0.98]"
    >
      <img
        src={img("music-notes.png")}
        alt=""
        width={IMG_SIZE}
        height={IMG_SIZE}
        decoding="async"
        className="size-[clamp(1.5rem,5vw,1.9rem)] shrink-0 select-none"
      />
      <span className="font-hand text-[clamp(0.8rem,3.5vw,1.2rem)] leading-tight font-medium text-balance text-foreground">
        Play our song first, then open the others
        <span className="sr-only"> Opens the Song page.</span>
      </span>
    </Link>
  )
}
