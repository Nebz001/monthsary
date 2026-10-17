import { useEffect, useRef, useState } from "react"
import { animate, stagger } from "animejs"

import type { DecorItem } from "@/components/FloatingDecor"
import HomeItem from "@/components/HomeItem"
import PageShell from "@/components/PageShell"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { IMG_SIZE, img } from "@/lib/assets"

const DECOR: DecorItem[] = [
  { src: "heart-small", x: 12, y: 11.3, size: "clamp(26px,4.6vw,42px)", rotate: -10, motion: "float", className: "max-sm:hidden" },
  { src: "heart-small", x: 10, y: 36, size: "clamp(22px,7vw,34px)", rotate: -12, motion: "float", className: "sm:hidden" },
  { src: "sparkle", x: 19.5, y: 7, size: "clamp(14px,2.2vw,20px)", rotate: 0, motion: "twinkle" },
  { src: "sparkle", x: 91.5, y: 36.5, size: "clamp(12px,1.9vw,18px)", rotate: 0, motion: "twinkle", className: "max-sm:hidden" },
  { src: "sparkle", x: 88, y: 45.6, size: "clamp(10px,3vw,14px)", rotate: 0, motion: "twinkle", className: "sm:hidden" },
  { src: "petal-pink", x: 8, y: 42.5, size: "clamp(28px,4.2vw,40px)", rotate: -25, motion: "float", className: "max-sm:hidden" },
  { src: "petal-pink", x: 89, y: 32, size: "clamp(24px,7vw,34px)", rotate: 40, motion: "float", className: "sm:hidden" },
  { src: "heart-small", x: 86, y: 73.5, size: "clamp(24px,3.8vw,34px)", rotate: 12, motion: "float", className: "max-sm:hidden" },
]

const CIRCLE_DESKTOP = "sm:[--c:min(26vw,26dvh,17rem)]"

export default function HomePage() {
  const reduced = usePrefersReducedMotion()
  // The entrance plays every time the page appears, after unlocking and when coming back.
  const [playIntro] = useState(() => !reduced)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!playIntro || !mainRef.current) return
    const anim = animate(mainRef.current.querySelectorAll("[data-intro]"), {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 900,
      delay: stagger(220, { start: 150 }),
      ease: "outQuad",
    })
    return () => {
      anim.revert()
    }
  }, [playIntro])

  // Hidden only while the intro is about to run, so nothing flashes first.
  const hidden = playIntro ? { opacity: 0 } : undefined

  return (
    <PageShell decor={DECOR}>
      <main
        ref={mainRef}
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col items-center justify-center gap-[1.4dvh] px-6 py-[2dvh] text-center"
      >
        <img
          src={img("heart-sparkle.png")}
          alt=""
          width={IMG_SIZE}
          height={IMG_SIZE}
          data-intro
          style={hidden}
          className="-mb-[2dvh] w-[clamp(4.5rem,min(12vw,10dvh),7rem)] select-none"
        />

        <h1
          data-intro
          style={hidden}
          className="font-script text-[clamp(2.6rem,min(12vw,8.5dvh),5.75rem)] leading-[1.05] text-foreground"
        >
          <span className="block">Happy Monthsary,</span>
          <span className="block">babyy</span>
        </h1>

        <p
          data-intro
          style={hidden}
          className="max-w-[34rem] font-hand text-[clamp(1rem,min(3.4vw,2.8dvh),1.75rem)] font-medium text-balance text-blush"
        >
          I made three little things for you. Tap one to open it.
        </p>

        <nav
          aria-label="Things I made for you"
          className="mt-[1.5dvh] grid w-full grid-cols-2 justify-items-center gap-x-4 gap-y-[2dvh] sm:flex sm:justify-center sm:gap-[3vw]"
        >
          <HomeItem
            to="/flower"
            label="Flower"
            image="flower.png"
            className="col-span-2 sm:col-span-1"
            sizeClass={`[--c:46vw] ${CIRCLE_DESKTOP}`}
            style={hidden}
          />
          <HomeItem
            to="/letter"
            label="Letter"
            image="letter.png"
            sizeClass={`[--c:36vw] ${CIRCLE_DESKTOP}`}
            style={hidden}
          />
          <HomeItem
            to="/song"
            label="Song"
            image="record-player.png"
            sizeClass={`[--c:36vw] ${CIRCLE_DESKTOP}`}
            style={hidden}
          />
        </nav>

        <footer
          data-intro
          style={hidden}
          className="mt-[1.5dvh] flex items-center justify-center gap-3"
        >
          <img
            src={img("teddy.png")}
            alt=""
            width={IMG_SIZE}
            height={IMG_SIZE}
            decoding="async"
            className="w-[clamp(4.5rem,min(16vw,12dvh),9rem)] select-none"
          />
          <p className="font-hand text-[clamp(1rem,min(3.4vw,2.8dvh),1.6rem)] font-medium text-blush">
            Forever yours since August 20
          </p>
        </footer>
      </main>
    </PageShell>
  )
}
