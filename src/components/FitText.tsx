import { useLayoutEffect, useRef, type ReactNode } from "react"

type FitTextProps = {
  children: ReactNode
  // Largest font size in px; shrinks only when the text would not fit on one line.
  maxFontPx: number
  className?: string
}

export default function FitText({
  children,
  maxFontPx,
  className = "",
}: FitTextProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const text = textRef.current
    if (!wrap || !text) return

    const fit = () => {
      const available = wrap.clientWidth
      if (!available) return
      text.style.fontSize = `${maxFontPx}px`
      const needed = text.scrollWidth
      if (needed > available) {
        text.style.fontSize = `${(maxFontPx * available) / needed}px`
      }
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(wrap)
    // Refit once the script font has loaded, since it changes the text width.
    document.fonts?.ready.then(fit)
    return () => observer.disconnect()
  }, [children, maxFontPx])

  return (
    <div ref={wrapRef} className="w-full text-center">
      <span ref={textRef} className={`inline-block whitespace-nowrap ${className}`}>
        {children}
      </span>
    </div>
  )
}
