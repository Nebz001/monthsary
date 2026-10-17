import type { CSSProperties } from "react"

import type { CaptionTone } from "@/data/photos"
import { TONE_CLASS } from "@/lib/captionTones"

// Which side of the polaroid the sticker hangs from, so it never runs off the screen.
export type StickerAnchor = "start" | "end"

const ANCHOR_CLASS: Record<StickerAnchor, string> = {
  start: "left-[-4%] right-auto",
  end: "right-[-4%] left-auto",
}
const ANCHOR_CLASS_SM: Record<StickerAnchor, string> = {
  start: "sm:left-[-6%] sm:right-auto",
  end: "sm:right-[-6%] sm:left-auto",
}

type CaptionStickerProps = {
  text: string
  tone: CaptionTone
  tilt: number
  mobileAnchor: StickerAnchor
  desktopAnchor: StickerAnchor
  hiddenStyle?: CSSProperties
}

// Plain text sticker; it is read in page order and shown again in the photo dialog.
export default function CaptionSticker({
  text,
  tone,
  tilt,
  mobileAnchor,
  desktopAnchor,
  hiddenStyle,
}: CaptionStickerProps) {
  return (
    <p
      data-sticker
      style={{ rotate: `${tilt}deg`, ...hiddenStyle }}
      className={`pointer-events-none absolute top-0 z-10 -translate-y-[78%] rounded-full px-4 py-1.5 font-hand text-[clamp(0.9rem,3.6vw,1.25rem)] leading-tight font-semibold whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.3)] ${TONE_CLASS[tone]} ${ANCHOR_CLASS[mobileAnchor]} ${ANCHOR_CLASS_SM[desktopAnchor]}`}
    >
      {text}
    </p>
  )
}
