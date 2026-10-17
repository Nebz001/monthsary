import { useEffect, useRef, useState } from "react"
import { animate, stagger, type JSAnimation } from "animejs"

import BackLink from "@/components/BackLink"
import type { DecorItem } from "@/components/FloatingDecor"
import FitText from "@/components/FitText"
import PageShell from "@/components/PageShell"
import { LETTER_OPENED_KEY } from "@/config"
import {
  LETTER_CLOSING,
  LETTER_GREETING,
  LETTER_PARAGRAPHS,
  LETTER_SIGNATURE,
} from "@/data/letter"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { IMG_SIZE, img } from "@/lib/assets"

const DECOR: DecorItem[] = [
  { src: "sparkle", x: 90, y: 4.5, size: "clamp(12px,1.9vw,18px)", rotate: 0, motion: "twinkle" },
  { src: "sparkle", x: 9, y: 12, size: "clamp(10px,1.6vw,16px)", rotate: 0, motion: "twinkle" },
  { src: "heart-small", x: 91, y: 93, size: "clamp(22px,3.6vw,32px)", rotate: 12, motion: "float" },
  { src: "petal-pink", x: 5, y: 92, size: "clamp(26px,3.6vw,34px)", rotate: -30, motion: "float" },
  { src: "petal-pink", x: 95, y: 38, size: "clamp(26px,3.6vw,34px)", rotate: 50, motion: "float", className: "max-sm:hidden" },
  { src: "heart-small", x: 7, y: 45, size: "clamp(22px,3.6vw,32px)", rotate: -12, motion: "float", className: "max-sm:hidden" },
]

type Phase = "closed" | "opening" | "open"

function readOpened() {
  try {
    return sessionStorage.getItem(LETTER_OPENED_KEY) === "1"
  } catch {
    return false
  }
}

// The paper image is 1024 by 1536 with torn edges. Slicing it into a border image keeps the
// torn edges at their natural look while the middle stretches to fit any amount of text.
const paperStyle = {
  "--bw": "clamp(1.25rem,5vw,2.25rem)",
  borderStyle: "solid",
  borderColor: "transparent",
  borderWidth: "var(--bw)",
  borderImage: `url(${img("paper.png")}) 90 fill / var(--bw) stretch`,
} as React.CSSProperties

export default function LetterPage() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>(() => (readOpened() ? "open" : "closed"))
  // The paper eases in every time the page shows an open letter, also on return visits.
  const [animateIn, setAnimateIn] = useState(() => readOpened() && !reduced)
  // Just opened by tapping the seal: the lines fade in slowly. Return visits are quicker.
  const [justOpened, setJustOpened] = useState(false)

  const envelopeRef = useRef<HTMLDivElement>(null)
  const sealRef = useRef<HTMLButtonElement>(null)
  const sealImgRef = useRef<HTMLImageElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)

  // Idle pulse on the seal so it reads as the thing to tap.
  useEffect(() => {
    if (phase !== "closed" || reduced || !sealImgRef.current) return
    const pulse = animate(sealImgRef.current, {
      scale: [1, 1.08],
      duration: 1100,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    })
    return () => {
      pulse.revert()
    }
  }, [phase, reduced])

  // The envelope eases in when arriving from home, matching the exit transition there.
  useEffect(() => {
    if (phase !== "closed" || reduced || !envelopeRef.current) return
    const enter = animate(envelopeRef.current, {
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.9, 1],
      duration: 800,
      ease: "outCubic",
    })
    return () => {
      enter.revert()
    }
    // Only on arrival, not when the phase changes while opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openLetter = () => {
    if (phase !== "closed") return
    try {
      sessionStorage.setItem(LETTER_OPENED_KEY, "1")
    } catch {
      // Storage can be unavailable; the letter still opens for this visit.
    }
    if (reduced) {
      setPhase("open")
      return
    }
    setPhase("opening")
    // The seal pops off, then the envelope fades down, then the paper takes over.
    animate(sealRef.current!, {
      translateY: [0, -28, -70],
      scale: [1, 1.3, 0.4],
      rotate: [0, 18, 40],
      opacity: [1, 1, 0],
      duration: 600,
      ease: "outQuad",
    })
    // The envelope starts sinking while the seal is still flying off, so it feels like one move.
    animate(envelopeRef.current!, {
      opacity: [1, 0],
      translateY: [0, 80],
      scale: [1, 0.94],
      duration: 650,
      delay: 300,
      ease: "inOutQuad",
    }).then(() => {
      setAnimateIn(true)
      setJustOpened(true)
      setPhase("open")
    })
  }

  // Paper rises and settles, then the lines of the letter fade in one after another.
  useEffect(() => {
    if (phase !== "open" || !animateIn || !paperRef.current) return
    const paper = paperRef.current
    let lines: JSAnimation | undefined
    const rise = animate(paper, {
      translateY: [110, 0],
      scale: [0.96, 1],
      opacity: [0, 1],
      duration: 1000,
      ease: "outCubic",
    })
    rise.then(() => {
      lines = animate(paper.querySelectorAll("[data-line]"), {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 700,
        delay: stagger(justOpened ? 380 : 140),
        ease: "outQuad",
      })
    })
    return () => {
      rise.revert()
      lines?.revert()
    }
  }, [phase, animateIn, justOpened])

  const hidden = animateIn ? { opacity: 0 } : undefined

  return (
    <PageShell decor={DECOR} corners={[]}>
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 pt-4 pb-10">
        <BackLink />

        {phase !== "open" ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <div ref={envelopeRef} className="flex flex-col items-center">
              <div className="relative aspect-square w-[min(88vw,30rem)]">
                <img
                  src={img("letter.png")}
                  alt=""
                  width={IMG_SIZE}
                  height={IMG_SIZE}
                  className="absolute inset-0 size-full select-none"
                />
                <button
                  ref={sealRef}
                  type="button"
                  aria-label="Open the letter"
                  onClick={openLetter}
                  disabled={phase === "opening"}
                  className="absolute top-[52%] left-[56.5%] aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 touch-manipulation rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring"
                >
                  <img
                    ref={sealImgRef}
                    src={img("wax-seal.png")}
                    alt=""
                    width={IMG_SIZE}
                    height={IMG_SIZE}
                    className="size-full select-none"
                  />
                </button>
              </div>
              <p className="-mt-2 font-hand text-[clamp(1.2rem,4.5vw,1.6rem)] font-medium text-blush">
                Tap the seal to open
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-start justify-center pt-8 sm:pt-10">
            <div
              ref={paperRef}
              style={hidden}
              className="relative w-full max-w-[40rem]"
            >
              <article
                style={paperStyle}
                className="min-h-[min(calc(100dvh-9rem),56rem)] px-[clamp(0.75rem,3vw,1.75rem)] pt-[clamp(4.5rem,22vw,7.5rem)] pb-[clamp(5.5rem,26vw,9rem)] text-[#4a1226]"
              >
                <h1
                  data-line
                  style={hidden}
                  className="font-script text-[clamp(2.4rem,9vw,3.4rem)] leading-tight"
                >
                  {LETTER_GREETING}
                </h1>
                <div className="mt-3 flex flex-col gap-[0.9em] font-hand text-[clamp(1.2rem,4.6vw,1.6rem)] leading-[1.55] font-medium">
                  {LETTER_PARAGRAPHS.map((text) => (
                    <p key={text} data-line style={hidden}>
                      {text}
                    </p>
                  ))}
                </div>
                <div
                  data-line
                  style={hidden}
                  className="mt-[1.4em] ml-auto flex w-[64%] flex-col items-center font-hand text-[clamp(1.1rem,4.2vw,1.45rem)]"
                >
                  <p className="font-medium">{LETTER_CLOSING}</p>
                  <FitText
                    maxFontPx={44}
                    className="font-script leading-[1.3]"
                  >
                    {LETTER_SIGNATURE}
                  </FitText>
                </div>
              </article>

              <img
                src={img("letter-flowers-top.png")}
                alt=""
                width={IMG_SIZE}
                height={IMG_SIZE}
                decoding="async"
                className="pointer-events-none absolute -top-[9%] -left-[7%] w-[40%] max-w-[15rem] select-none"
              />
              <img
                src={img("letter-flowers-bottom.png")}
                alt=""
                width={IMG_SIZE}
                height={IMG_SIZE}
                decoding="async"
                className="pointer-events-none absolute -right-[7%] -bottom-[3%] w-[40%] max-w-[15rem] -scale-x-100 select-none"
              />
              <img
                src={img("heart-sparkle.png")}
                alt=""
                width={IMG_SIZE}
                height={IMG_SIZE}
                decoding="async"
                className="pointer-events-none absolute -top-[3%] right-[1%] w-[clamp(3.5rem,17vw,6rem)] rotate-6 select-none"
              />
            </div>
          </div>
        )}
      </main>
    </PageShell>
  )
}
