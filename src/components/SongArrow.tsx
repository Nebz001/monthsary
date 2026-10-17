import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react"
import { animate, svg } from "animejs"

type Geometry = {
  w: number
  h: number
  line: string
  head: string
  // Unit direction the arrow points in, used for the nudge.
  ux: number
  uy: number
}

type SongArrowProps = {
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  // True when the home page entrance runs, so the arrow waits and then draws itself.
  playIntro: boolean
  // Milliseconds to wait (the items fading in) before the arrow starts drawing.
  introDelay: number
  reduced: boolean
}

const GOLD = "#e3b565"

// Position of an element inside the container from layout offsets, which ignore the
// transforms used by the entrance animation and hover lift.
function offsetWithin(node: HTMLElement, container: HTMLElement) {
  let x = 0
  let y = 0
  let el: HTMLElement | null = node
  while (el && el !== container) {
    x += el.offsetLeft
    y += el.offsetTop
    el = el.offsetParent as HTMLElement | null
  }
  return { x, y }
}

function measure(
  container: HTMLElement,
  from: HTMLElement,
  to: HTMLElement,
): Geometry | null {
  const w = container.clientWidth
  const h = container.clientHeight
  if (!w || !h || !from.offsetWidth || !to.offsetWidth) return null

  const f = offsetWithin(from, container)
  const t = offsetWithin(to, container)

  // Start at the right end of the pill, finish at the top right of the Song circle.
  const sx = f.x + from.offsetWidth + 6
  const sy = f.y + from.offsetHeight / 2
  const r = to.offsetWidth / 2
  const cx = t.x + r
  const cy = t.y + to.offsetHeight / 2
  const angle = (-45 * Math.PI) / 180
  const ex = cx + (r + 8) * Math.cos(angle)
  const ey = cy + (r + 8) * Math.sin(angle)

  // Keep the curve inside the container so it can never cause sideways scrolling.
  const limit = w - 8
  const c1x = Math.min(sx + 70, limit)
  const c1y = sy
  const c2x = Math.min(ex + 50, limit)
  const c2y = ey - 60

  const tx = ex - c2x
  const ty = ey - c2y
  const len = Math.hypot(tx, ty) || 1
  const ux = tx / len
  const uy = ty / len

  // Open arrow head: two short strokes swept back from the tip.
  const wing = (deg: number) => {
    const a = Math.atan2(-uy, -ux) + (deg * Math.PI) / 180
    return `${ex + 13 * Math.cos(a)} ${ey + 13 * Math.sin(a)}`
  }

  return {
    w,
    h,
    line: `M ${sx} ${sy} C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`,
    head: `M ${wing(28)} L ${ex} ${ey} L ${wing(-28)}`,
    ux,
    uy,
  }
}

// Decorative dotted arrow from the hint pill to the Song circle. Measured from the real
// elements, so it follows resizes and rotation. It never takes taps.
export default function SongArrow({
  containerRef,
  fromRef,
  toRef,
  playIntro,
  introDelay,
  reduced,
}: SongArrowProps) {
  const [geo, setGeo] = useState<Geometry | null>(null)
  const maskPathRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const ready = geo !== null
  // Latest direction for the nudge without restarting the animation on resize.
  const geoRef = useRef<Pick<Geometry, "ux" | "uy">>({ ux: 0, uy: 1 })
  useEffect(() => {
    if (geo) geoRef.current = { ux: geo.ux, uy: geo.uy }
  }, [geo])

  useEffect(() => {
    const container = containerRef.current
    const from = fromRef.current
    const to = toRef.current
    if (!container || !from || !to) return

    const update = () => setGeo(measure(container, from, to))
    const observer = new ResizeObserver(update)
    observer.observe(container)
    observer.observe(from)
    observer.observe(to)
    window.addEventListener("resize", update)
    window.addEventListener("orientationchange", update)
    // Pill and label fonts change the layout once they load.
    document.fonts?.ready.then(update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
      window.removeEventListener("orientationchange", update)
    }
  }, [containerRef, fromRef, toRef])

  // The arrow draws itself after the items fade in, then the head nudges now and then.
  // Everything is hidden or reset before paint, so the finished arrow never flashes first.
  useLayoutEffect(() => {
    const maskPath = maskPathRef.current
    const head = headRef.current
    if (!ready || !maskPath || !head || reduced || !playIntro) return

    const [drawable] = svg.createDrawable(maskPath)
    drawable.draw = "0 0"
    head.style.opacity = "0"

    const anims: { revert: () => unknown }[] = []
    const draw = animate(drawable, {
      draw: ["0 0", "0 1"],
      duration: 1300,
      delay: introDelay,
      ease: "inOutSine",
    })
    anims.push(draw)
    draw.then(() => {
      const fade = animate(head, { opacity: [0, 1], duration: 250 })
      const nudge = animate(head, {
        translateX: [0, geoRef.current.ux * 7, 0],
        translateY: [0, geoRef.current.uy * 7, 0],
        duration: 800,
        ease: "inOutSine",
        loop: true,
        loopDelay: 3200,
      })
      anims.push(fade, nudge)
    })
    return () => anims.forEach((a) => a.revert())
  }, [ready, reduced, playIntro, introDelay])

  if (!geo) return null

  return (
    <svg
      aria-hidden="true"
      data-arrow
      focusable="false"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      className="pointer-events-none absolute top-0 left-0 overflow-visible"
    >
      <defs>
        <mask
          id="song-arrow-reveal"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={geo.w}
          height={geo.h}
        >
          <path
            ref={maskPathRef}
            d={geo.line}
            fill="none"
            stroke="white"
            strokeWidth={14}
            strokeLinecap="round"
          />
        </mask>
      </defs>
      <path
        d={geo.line}
        fill="none"
        stroke={GOLD}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="0.1 9"
        mask="url(#song-arrow-reveal)"
      />
      <g ref={headRef}>
        <path
          d={geo.head}
          fill="none"
          stroke={GOLD}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
