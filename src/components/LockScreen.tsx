import { useCallback, useEffect, useRef, useState } from "react"
import { animate } from "animejs"

import type { DecorItem } from "@/components/FloatingDecor"
import Keypad from "@/components/Keypad"
import PageShell from "@/components/PageShell"
import { UNLOCK_CODE } from "@/config"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { IMG_SIZE, img } from "@/lib/assets"

const DECOR: DecorItem[] = [
  { src: "heart-small", x: 10, y: 11, size: "clamp(26px,4.6vw,42px)", rotate: -10, motion: "float" },
  { src: "sparkle", x: 21, y: 6.5, size: "clamp(14px,2.2vw,20px)", rotate: 0, motion: "twinkle" },
  { src: "sparkle", x: 90, y: 30, size: "clamp(12px,1.9vw,18px)", rotate: 0, motion: "twinkle" },
  { src: "petal-pink", x: 8, y: 38, size: "clamp(28px,4.2vw,40px)", rotate: -25, motion: "float", className: "max-sm:hidden" },
  { src: "petal-pink", x: 91, y: 37, size: "clamp(28px,4.2vw,40px)", rotate: 60, motion: "float", className: "sm:hidden" },
  { src: "petal-pink", x: 91, y: 49, size: "clamp(28px,4.2vw,40px)", rotate: 70, motion: "float", className: "max-sm:hidden" },
  { src: "sparkle", x: 9.5, y: 55, size: "clamp(10px,1.6vw,14px)", rotate: 0, motion: "twinkle", className: "max-sm:hidden" },
  { src: "heart-sparkle", x: 87, y: 77, size: "clamp(32px,5vw,48px)", rotate: 12, motion: "float", className: "max-sm:hidden" },
]
const WRONG_MESSAGE = "Not quite, try again babyy"

type Status = "idle" | "checking" | "wrong" | "unlocking"

function formatDisplay(digits: string) {
  if (digits.length < 2) return digits
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`
}

type LockScreenProps = {
  onUnlock: () => void
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const reduced = usePrefersReducedMotion()
  const [digits, setDigits] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  const rootRef = useRef<HTMLDivElement>(null)
  const inputWrapRef = useRef<HTMLDivElement>(null)
  const lockRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const locked = status !== "idle"

  const addDigit = useCallback((digit: string) => {
    setMessage("")
    setDigits((d) => (d.length < 4 ? d + digit : d))
  }, [])
  const backspace = useCallback(() => {
    setMessage("")
    setDigits((d) => d.slice(0, -1))
  }, [])
  const clear = useCallback(() => {
    setMessage("")
    setDigits("")
  }, [])

  const submit = useCallback(
    (value: string) => {
      setStatus("checking")

      if (value === UNLOCK_CODE) {
        setStatus("unlocking")
        if (reduced) {
          onUnlock()
          return
        }
        animate(glowRef.current!, {
          opacity: [0, 1],
          scale: [0.6, 1.5],
          duration: 900,
          ease: "outQuad",
        })
        animate(lockRef.current!, {
          scale: [1, 1.18, 0.96, 1.06, 1],
          rotate: [0, -4, 4, -2, 0],
          duration: 900,
          ease: "inOutSine",
        }).then(() =>
          animate(rootRef.current!, {
            opacity: 0,
            duration: 700,
            ease: "inOutQuad",
          }).then(onUnlock),
        )
        return
      }

      setStatus("wrong")
      setMessage(WRONG_MESSAGE)
      const done = () => {
        setDigits("")
        setStatus("idle")
      }
      if (reduced) {
        window.setTimeout(done, 700)
        return
      }
      animate(inputWrapRef.current!, {
        translateX: [
          { to: -9, duration: 90 },
          { to: 9, duration: 120 },
          { to: -6, duration: 110 },
          { to: 6, duration: 110 },
          { to: 0, duration: 90 },
        ],
        ease: "inOutSine",
      }).then(() => window.setTimeout(done, 250))
    },
    [reduced, onUnlock],
  )

  // Short pause so the fourth digit is visible before it is checked.
  useEffect(() => {
    if (digits.length !== 4 || status !== "idle") return
    const t = window.setTimeout(() => submit(digits), 220)
    return () => window.clearTimeout(t)
  }, [digits, status, submit])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (locked || e.ctrlKey || e.metaKey || e.altKey) return
      if (/^[0-9]$/.test(e.key)) {
        addDigit(e.key)
      } else if (e.key === "Backspace") {
        backspace()
      } else if (e.key === "Enter") {
        if ((e.target as HTMLElement).tagName === "BUTTON") return
        if (digits.length === 4) submit(digits)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [locked, digits, addDigit, backspace, submit])

  return (
    <PageShell ref={rootRef} decor={DECOR}>
      <main
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[min(28rem,72dvh)] flex-col items-center justify-center px-7 py-[1.5dvh] text-center"
        style={{ "--key-h": "clamp(2.75rem,7.2dvh,5rem)" } as React.CSSProperties}
      >
        <div
          ref={lockRef}
          className="relative -mb-[2dvh] aspect-square h-[clamp(8rem,27dvh,21rem)] shrink-0"
        >
          <div
            ref={glowRef}
            aria-hidden="true"
            className="absolute inset-[-10%] rounded-full opacity-0"
            style={{
              background:
                "radial-gradient(circle, rgba(255,200,225,0.75) 0%, rgba(255,160,200,0.25) 45%, transparent 70%)",
            }}
          />
          <img
            src={img("lock-closed.png")}
            alt=""
            width={IMG_SIZE}
            height={IMG_SIZE}
            className={`absolute inset-0 size-full select-none transition-opacity duration-300 ${status === "unlocking" ? "opacity-0" : "opacity-100"}`}
          />
          <img
            src={img("lock-opened.png")}
            alt=""
            width={IMG_SIZE}
            height={IMG_SIZE}
            className={`absolute inset-0 size-full select-none transition-opacity duration-300 ${status === "unlocking" ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        <h1 className="font-script text-[clamp(2.4rem,7.5dvh,4rem)] leading-[1.1] text-foreground">
          This heart is locked
        </h1>
        <p className="mt-1 max-w-[22rem] font-hand text-[clamp(1rem,2.7dvh,1.25rem)] font-medium text-balance text-blush">
          Only you have the key, babyy. When did you say yes?
        </p>

        <div ref={inputWrapRef} className="mt-[1.6dvh] w-full">
          <input
            type="text"
            readOnly
            inputMode="none"
            autoComplete="off"
            aria-label="Month and day you said yes"
            aria-describedby="lock-hint"
            placeholder="MM / DD"
            value={formatDisplay(digits)}
            className="h-(--key-h) w-full rounded-2xl border border-blush-border bg-wine-soft text-center font-hand text-[clamp(1.6rem,4.6dvh,2.75rem)] tracking-[0.18em] text-foreground caret-transparent outline-none placeholder:text-placeholder focus-visible:ring-4 focus-visible:ring-ring/60"
          />
        </div>

        <div className="relative my-[0.8dvh] h-[max(1.5rem,3.2dvh)] w-full">
          <p
            id="lock-hint"
            className={`absolute inset-0 font-hand text-[clamp(0.95rem,2.4dvh,1.15rem)] text-blush transition-opacity duration-300 ${message ? "opacity-0" : "opacity-100"}`}
          >
            Type the month and day
          </p>
          <p
            aria-hidden="true"
            className={`absolute inset-0 font-hand text-[clamp(0.95rem,2.4dvh,1.15rem)] text-foreground transition-opacity duration-300 ${message ? "opacity-100" : "opacity-0"}`}
          >
            {message}
          </p>
          <p role="status" aria-live="polite" className="sr-only">
            {message}
          </p>
        </div>

        <Keypad
          disabled={locked}
          onDigit={addDigit}
          onClear={clear}
          onBackspace={backspace}
        />
      </main>
    </PageShell>
  )
}
