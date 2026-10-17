import type { CSSProperties, ReactNode } from "react"

import type { Photo } from "@/data/photos"
import { img } from "@/lib/assets"

type PolaroidProps = {
  photo: Photo
  number: number
  tilt: number
  eager: boolean
  // Layout classes for the grid cell (column placement and vertical offset).
  className?: string
  // Set while the scroll reveal is going to run, so nothing flashes first.
  hiddenStyle?: CSSProperties
  onOpen: () => void
  // Caption sticker that sits on this polaroid's corner.
  children?: ReactNode
}

export default function Polaroid({
  photo,
  number,
  tilt,
  eager,
  className = "",
  hiddenStyle,
  onOpen,
  children,
}: PolaroidProps) {
  return (
    <div
      data-reveal
      data-tilt={tilt}
      style={hiddenStyle}
      className={`relative ${className}`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`View photo ${number} larger: ${photo.alt}`}
        style={{ "--tilt": `${tilt}deg` } as CSSProperties}
        className="group block w-full touch-manipulation rotate-(--tilt) rounded-[3px] bg-[#fff8ee] p-[6%] pb-[17%] shadow-[0_10px_22px_rgba(0,0,0,0.38)] outline-none transition-[rotate,translate,box-shadow] duration-300 focus-visible:ring-4 focus-visible:ring-ring/70 hover:shadow-[0_16px_28px_rgba(0,0,0,0.45)] active:shadow-[0_16px_28px_rgba(0,0,0,0.45)] motion-safe:hover:-translate-y-1.5 motion-safe:hover:rotate-[calc(var(--tilt)*0.3)] motion-safe:active:-translate-y-1 motion-safe:active:rotate-[calc(var(--tilt)*0.3)]"
      >
        <img
          src={img(`photos/${photo.file}`)}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          style={{ objectPosition: photo.focus ?? "center" }}
          className="aspect-square w-full bg-[#e8c9d4] object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
        />
        <img
          src={img("tape.png")}
          alt=""
          width={1536}
          height={1024}
          decoding="async"
          style={{ rotate: `${tilt * -1.5}deg` }}
          className="pointer-events-none absolute top-0 left-1/2 w-[62%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
        />
      </button>
      {children}
    </div>
  )
}
