import { useEffect, type RefObject } from "react"
import { animate } from "animejs"

// Drops each [data-reveal] element in the first time it scrolls into view.
// Elements must start hidden (opacity 0) while `enabled` is true.
export function useRevealOnScroll(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            const el = entry.target as HTMLElement
            observer.unobserve(el)
            const tilt = Number(el.dataset.tilt ?? 0)
            animate(el, {
              opacity: [0, 1],
              translateY: [-36, 0],
              rotate: [tilt * 2.5, 0],
              duration: 900,
              delay: i * 110,
              ease: "outBack",
            })
            el.querySelectorAll("[data-sticker]").forEach((sticker) =>
              animate(sticker, {
                opacity: [0, 1],
                scale: [0.7, 1],
                duration: 600,
                delay: 350 + i * 110,
                ease: "outBack",
              }),
            )
          })
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    )

    container
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [containerRef, enabled])
}
