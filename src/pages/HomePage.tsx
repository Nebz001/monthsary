import { useEffect, useRef, useState, type MouseEvent } from "react"
import { animate, stagger } from "animejs"
import { useNavigate } from "react-router-dom"

import type { DecorItem } from "@/components/FloatingDecor"
import HintPill from "@/components/HintPill"
import HomeItem from "@/components/HomeItem"
import PageShell from "@/components/PageShell"
import SongArrow from "@/components/SongArrow"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { IMG_SIZE, img } from "@/lib/assets"

const DECOR: DecorItem[] = [
  { src: "heart-small", x: 12, y: 11.3, size: "clamp(26px,4.6vw,42px)", rotate: -10, motion: "float", className: "max-sm:hidden" },
  { src: "heart-small", x: 9, y: 41, size: "clamp(22px,7vw,34px)", rotate: -12, motion: "float", className: "sm:hidden" },
  { src: "sparkle", x: 19.5, y: 7, size: "clamp(14px,2.2vw,20px)", rotate: 0, motion: "twinkle" },
  { src: "sparkle", x: 91.5, y: 36.5, size: "clamp(12px,1.9vw,18px)", rotate: 0, motion: "twinkle", className: "max-sm:hidden" },
  { src: "sparkle", x: 80, y: 46, size: "clamp(10px,3vw,14px)", rotate: 0, motion: "twinkle", className: "sm:hidden" },
  { src: "petal-pink", x: 8, y: 42.5, size: "clamp(28px,4.2vw,40px)", rotate: -25, motion: "float", className: "max-sm:hidden" },
  { src: "petal-pink", x: 84, y: 20, size: "clamp(24px,7vw,34px)", rotate: 40, motion: "float", className: "sm:hidden" },
  { src: "heart-small", x: 94, y: 81, size: "clamp(24px,3.8vw,34px)", rotate: 12, motion: "float", className: "max-sm:hidden" },
]

// Wait for the pill and the three items to finish fading in before the arrow and glow start.
const ATTENTION_DELAY = 2400

const CIRCLE_DESKTOP = "sm:[--c:min(26vw,26dvh,17rem)]"

export default function HomePage() {
  const reduced = usePrefersReducedMotion()
  // The entrance plays every time the page appears, after unlocking and when coming back.
  const [playIntro] = useState(() => !reduced)
  const mainRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const leaving = useRef(false)
  const pillRef = useRef<HTMLAnchorElement>(null)
  const songCircleRef = useRef<HTMLSpanElement>(null)

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

  // Very soft pulsing glow on the Song circle, gentler than the hover glow. Not under reduced motion.
  useEffect(() => {
    const glow = songCircleRef.current?.querySelector("[data-pulse]")
    if (reduced || !glow) return
    const pulse = animate(glow, {
      opacity: [0, 0.7],
      duration: 2200,
      delay: ATTENTION_DELAY,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    })
    return () => {
      pulse.revert()
    }
  }, [reduced])

  // Leaving home: the chosen circle swells and fades while everything else drifts away,
  // then the route changes. Modified clicks (new tab) and reduced motion skip it.
  const handleOpen = (e: MouseEvent<HTMLAnchorElement>, to: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    if (leaving.current) return
    if (reduced || !mainRef.current) {
      navigate(to)
      return
    }
    leaving.current = true
    const chosen = e.currentTarget
    const others = Array.from(
      mainRef.current.querySelectorAll("[data-intro], [data-arrow]"),
    ).filter((el) => el !== chosen)
    animate(others, {
      opacity: [1, 0],
      translateY: [0, -14],
      duration: 450,
      ease: "inQuad",
    })
    animate(chosen, {
      scale: [1, 1.12, 1.3],
      opacity: [1, 1, 0],
      duration: 750,
      ease: "inOutQuad",
    }).then(() => navigate(to))
  }

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

        <HintPill
          ref={pillRef}
          style={hidden}
          onClick={(e) => handleOpen(e, "/song")}
        />

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
            onClick={(e) => handleOpen(e, "/flower")}
          />
          <HomeItem
            to="/letter"
            label="Letter"
            image="letter.png"
            sizeClass={`[--c:36vw] ${CIRCLE_DESKTOP}`}
            style={hidden}
            onClick={(e) => handleOpen(e, "/letter")}
          />
          <HomeItem
            to="/song"
            label="Song"
            image="record-player.png"
            sizeClass={`[--c:36vw] ${CIRCLE_DESKTOP}`}
            style={hidden}
            onClick={(e) => handleOpen(e, "/song")}
            circleRef={songCircleRef}
            pulse
          />
        </nav>

        <SongArrow
          containerRef={mainRef}
          fromRef={pillRef}
          toRef={songCircleRef}
          playIntro={playIntro}
          introDelay={ATTENTION_DELAY}
          reduced={reduced}
        />

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
