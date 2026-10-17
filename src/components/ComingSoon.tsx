import { useNavigate } from "react-router-dom"

import type { DecorItem } from "@/components/FloatingDecor"
import PageShell from "@/components/PageShell"
import { Button } from "@/components/ui/button"

const DECOR: DecorItem[] = [
  { src: "heart-small", x: 12, y: 14, size: "clamp(26px,4.6vw,42px)", rotate: -10, motion: "float" },
  { src: "sparkle", x: 20, y: 8, size: "clamp(14px,2.2vw,20px)", rotate: 0, motion: "twinkle" },
  { src: "petal-pink", x: 90, y: 55, size: "clamp(28px,4.2vw,40px)", rotate: 60, motion: "float" },
  { src: "sparkle", x: 88, y: 38, size: "clamp(12px,1.9vw,18px)", rotate: 0, motion: "twinkle" },
]

export default function ComingSoon({ title }: { title: string }) {
  const navigate = useNavigate()

  // Step back when she came from home, so this button and the phone back button agree.
  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate("/", { replace: true })
  }

  return (
    <PageShell decor={DECOR}>
      <main className="relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-7 py-10 text-center">
        <h1 className="font-script text-[clamp(3rem,12vw,5rem)] leading-tight text-foreground">
          {title}
        </h1>
        <p className="font-hand text-[clamp(1.1rem,3.5vw,1.5rem)] text-blush">
          This part is coming soon, babyy.
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={goBack}
          className="mt-4 h-12 touch-manipulation rounded-2xl border-border px-8 font-hand text-xl focus-visible:ring-4 focus-visible:ring-ring/60"
        >
          Back
        </Button>
      </main>
    </PageShell>
  )
}
