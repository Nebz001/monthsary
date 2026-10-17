import { useEffect, useRef, useState } from "react"
import { animate } from "animejs"

import { useAudioPlayer } from "@/audio/audioContext"
import BackLink from "@/components/BackLink"
import type { DecorItem } from "@/components/FloatingDecor"
import PageShell from "@/components/PageShell"
import SongPlayer from "@/components/song/SongPlayer"
import {
  CARD_HEADING,
  CARD_MESSAGE,
  SONG_ARTIST,
  SONG_TITLE,
} from "@/data/song"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { IMG_SIZE, img } from "@/lib/assets"

const DECOR: DecorItem[] = [
  { src: "sparkle", x: 10, y: 24, size: "clamp(14px,2.2vw,20px)", rotate: 0, motion: "twinkle" },
  { src: "sparkle", x: 18, y: 44, size: "clamp(10px,1.6vw,14px)", rotate: 0, motion: "twinkle", className: "max-sm:hidden" },
  { src: "petal-pink", x: 10, y: 57, size: "clamp(26px,3.6vw,34px)", rotate: -25, motion: "float", className: "max-sm:hidden" },
  { src: "heart-small", x: 89, y: 65, size: "clamp(22px,3.6vw,32px)", rotate: 12, motion: "float" },
  { src: "heart-small", x: 8, y: 10, size: "clamp(22px,3.6vw,32px)", rotate: -12, motion: "float", className: "max-sm:hidden" },
]

export default function SongPage() {
  const reduced = usePrefersReducedMotion()
  const { playing } = useAudioPlayer()
  const recordRef = useRef<HTMLImageElement>(null)
  const notesRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  // Hidden until the arrival animation starts, so nothing flashes first.
  const [enter] = useState(() => !reduced)

  // Arrival after the exit transition on the home page: the page eases up into place.
  useEffect(() => {
    if (!enter || !mainRef.current) return
    const arrive = animate(mainRef.current, {
      opacity: [0, 1],
      translateY: [32, 0],
      scale: [0.96, 1],
      duration: 850,
      ease: "outCubic",
    })
    return () => {
      arrive.revert()
    }
  }, [enter])

  // Notes drift calmly when idle; while the song plays they sway wider and the record bobs.
  useEffect(() => {
    if (reduced || !notesRef.current) return
    const notes = Array.from(notesRef.current.querySelectorAll("[data-note]"))
    const anims = notes.map((el, i) =>
      animate(el, {
        translateY: [0, (i % 2 ? 1 : -1) * (playing ? 16 : 7)],
        translateX: [0, (i % 2 ? -1 : 1) * (playing ? 8 : 3)],
        rotate: [0, (i % 2 ? -1 : 1) * (playing ? 8 : 2)],
        duration: (playing ? 1700 : 4200) + i * 500,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      }),
    )
    if (playing && recordRef.current) {
      anims.push(
        animate(recordRef.current, {
          translateY: [0, -5],
          rotate: [-0.6, 0.6],
          duration: 1200,
          ease: "inOutSine",
          loop: true,
          alternate: true,
        }),
      )
    }
    return () => anims.forEach((a) => a.revert())
  }, [playing, reduced])

  return (
    <PageShell decor={DECOR}>
      <main
        ref={mainRef}
        style={enter ? { opacity: 0 } : undefined}
        className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-6 pt-4 pb-[clamp(6rem,24vw,9rem)]"
      >
        <div className="self-start">
          <BackLink />
        </div>

        <h1 className="-mt-6 font-script text-[clamp(3rem,12vw,5rem)] leading-tight text-foreground sm:-mt-8">
          Our Song
        </h1>

        <div className="relative mt-2 w-full max-w-[26rem]">
          <img
            ref={recordRef}
            src={img("song.png")}
            alt="A pink vintage record player with its lid open and a record sleeve beside it"
            width={IMG_SIZE}
            height={IMG_SIZE}
            decoding="async"
            className="w-full select-none"
          />
          <div ref={notesRef} aria-hidden="true" className="pointer-events-none">
            <img
              data-note
              src={img("music-notes.png")}
              alt=""
              width={IMG_SIZE}
              height={IMG_SIZE}
              decoding="async"
              className="absolute -top-[5%] -right-[4%] w-[46%] max-w-none rotate-6 select-none"
            />
            <img
              data-note
              src={img("music-notes.png")}
              alt=""
              width={IMG_SIZE}
              height={IMG_SIZE}
              decoding="async"
              className="absolute top-[4%] -left-[6%] w-[22%] max-w-none -rotate-12 select-none"
            />
          </div>
        </div>

        <div className="mt-2 text-center">
          <h2 className="font-hand text-[clamp(1.9rem,7vw,2.6rem)] leading-tight font-bold text-foreground">
            {SONG_TITLE}
          </h2>
          <p className="font-hand text-[clamp(1.1rem,4.2vw,1.5rem)] text-blush">
            {SONG_ARTIST}
          </p>
        </div>

        <div className="mt-6 w-full">
          <SongPlayer title={SONG_TITLE} />
        </div>

        <section className="mt-6 w-full rounded-2xl border border-keypad-border bg-wine-soft px-5 py-5 text-center">
          <h2 className="font-script text-[clamp(1.9rem,7vw,2.6rem)] leading-tight text-[#e3b565]">
            {CARD_HEADING}
          </h2>
          <p className="mt-2 font-hand text-[clamp(1.15rem,4.4vw,1.45rem)] leading-[1.5] text-foreground">
            {CARD_MESSAGE}
          </p>
        </section>
      </main>
    </PageShell>
  )
}
