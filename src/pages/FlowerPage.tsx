import { useRef, useState } from "react"

import BackLink from "@/components/BackLink"
import type { DecorItem } from "@/components/FloatingDecor"
import PageShell from "@/components/PageShell"
import CaptionSticker, {
  type StickerAnchor,
} from "@/components/photos/CaptionSticker"
import PhotoDialog from "@/components/photos/PhotoDialog"
import Polaroid from "@/components/photos/Polaroid"
import {
  CAPTIONS,
  PAGE_FOOTER,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  PHOTOS,
} from "@/data/photos"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"

const DECOR: DecorItem[] = [
  { src: "sparkle", x: 8.5, y: 11.5, size: "clamp(12px,1.9vw,18px)", rotate: 0, motion: "twinkle" },
  { src: "sparkle", x: 96, y: 44, size: "clamp(12px,1.9vw,18px)", rotate: 0, motion: "twinkle", className: "max-sm:hidden" },
  { src: "sparkle", x: 94, y: 69.5, size: "clamp(10px,1.6vw,16px)", rotate: 0, motion: "twinkle" },
  { src: "sparkle", x: 8, y: 83, size: "clamp(10px,1.6vw,16px)", rotate: 0, motion: "twinkle" },
  { src: "heart-small", x: 6, y: 60, size: "clamp(22px,3.6vw,32px)", rotate: -12, motion: "float", className: "max-sm:hidden" },
  { src: "heart-small", x: 88, y: 86, size: "clamp(22px,3.6vw,32px)", rotate: 14, motion: "float" },
  { src: "heart-small", x: 49.5, y: 23.5, size: "24px", rotate: -8, motion: "float", className: "sm:hidden" },
  { src: "heart-small", x: 50, y: 51, size: "24px", rotate: 10, motion: "float", className: "sm:hidden" },
  { src: "heart-small", x: 49, y: 76, size: "24px", rotate: -10, motion: "float", className: "sm:hidden" },
  { src: "petal-pink", x: 3, y: 49.5, size: "clamp(26px,3.6vw,34px)", rotate: -30, motion: "float" },
  { src: "petal-pink", x: 85, y: 81, size: "clamp(26px,3.6vw,34px)", rotate: 50, motion: "float", className: "max-sm:hidden" },
]

// Small, different angles so no two neighbours lean the same way.
const TILTS = [-3, 2.5, 3, -2.5, 3.5, -4, 2, -3, 4, -2, 3, -3.5, 4, -3]
const STICKER_TILTS = [-4, 3, -3, 2, -5, 3]

// Phones show two columns; the right column (even photo numbers) hangs stickers from the right.
const mobileAnchor = (n: number): StickerAnchor => (n % 2 === 0 ? "end" : "start")

// Desktop shows three columns with the short last row centred.
function desktopAnchor(n: number): StickerAnchor {
  const fullRows = Math.floor(PHOTOS.length / 3) * 3
  if (n > fullRows) return n === PHOTOS.length ? "end" : "start"
  return (n - 1) % 3 === 2 ? "end" : "start"
}

// Centres a short last row in the six column desktop grid.
function lastRowClass(i: number) {
  const left = PHOTOS.length % 3
  const fromEnd = PHOTOS.length - i
  if (left === 2) return fromEnd === 2 ? "sm:col-start-2" : fromEnd === 1 ? "sm:col-start-4" : ""
  if (left === 1) return fromEnd === 1 ? "sm:col-start-3" : ""
  return ""
}

// Lifts the middle column a little on desktop and the right column on phones, like the reference.
const STAGGER = "max-sm:even:mt-6 sm:[&:nth-child(3n+2)]:mt-5"

export default function FlowerPage() {
  const reduced = usePrefersReducedMotion()
  const [animateIn] = useState(() => !reduced)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // Kept after closing so the dialog can fade out showing the photo it had.
  const [shownIndex, setShownIndex] = useState(0)
  const gridRef = useRef<HTMLDivElement>(null)

  useRevealOnScroll(gridRef, animateIn)

  const hiddenStyle = animateIn ? { opacity: 0 } : undefined

  const open = (index: number) => {
    setShownIndex(index)
    setOpenIndex(index)
  }

  return (
    <PageShell decor={DECOR} corners={["top-right", "bottom-left", "bottom-right"]}>
      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-4 pt-4 pb-[clamp(9rem,28vw,14rem)] sm:px-6">
        <BackLink />

        <header className="mt-1 mb-8 text-center sm:mb-10">
          <h1 className="font-script text-[clamp(2.8rem,11vw,5.25rem)] leading-[1.05] text-foreground">
            {PAGE_TITLE}
          </h1>
          <p className="mt-1 font-hand text-[clamp(1rem,3.6vw,1.6rem)] font-medium text-blush">
            {PAGE_SUBTITLE}
          </p>
        </header>

        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-x-5 gap-y-14 sm:grid-cols-6 sm:gap-x-8 sm:gap-y-16"
        >
          {PHOTOS.map((photo, i) => {
            const number = i + 1
            const captionIndex = CAPTIONS.findIndex((c) => c.near === number)
            const caption = CAPTIONS[captionIndex]
            return (
              <Polaroid
                key={photo.file}
                photo={photo}
                number={number}
                tilt={TILTS[i % TILTS.length]}
                eager={i < 3}
                className={`sm:col-span-2 ${lastRowClass(i)} ${STAGGER}`}
                hiddenStyle={hiddenStyle}
                onOpen={() => open(i)}
              >
                {caption && (
                  <CaptionSticker
                    text={caption.text}
                    tone={caption.tone}
                    tilt={STICKER_TILTS[captionIndex % STICKER_TILTS.length]}
                    mobileAnchor={mobileAnchor(number)}
                    desktopAnchor={desktopAnchor(number)}
                    hiddenStyle={hiddenStyle}
                  />
                )}
              </Polaroid>
            )
          })}
        </div>

        <p className="mt-16 text-center font-script text-[clamp(2rem,7.5vw,3.75rem)] leading-tight text-foreground">
          {PAGE_FOOTER}
        </p>
      </main>

      <PhotoDialog
        open={openIndex !== null}
        index={shownIndex}
        onIndexChange={(next) => {
          setShownIndex(next)
          setOpenIndex(next)
        }}
        onClose={() => setOpenIndex(null)}
      />
    </PageShell>
  )
}
