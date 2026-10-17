import { useEffect, useRef } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CAPTIONS, PHOTOS } from "@/data/photos"
import { img } from "@/lib/assets"
import { TONE_CLASS } from "@/lib/captionTones"

type PhotoDialogProps = {
  open: boolean
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

const SWIPE_DISTANCE = 50

export default function PhotoDialog({
  open,
  index,
  onIndexChange,
  onClose,
}: PhotoDialogProps) {
  const photo = PHOTOS[index]
  const caption = CAPTIONS.find((c) => c.near === index + 1)
  const swipeStart = useRef<{ x: number; y: number } | null>(null)

  const go = (step: number) =>
    onIndexChange((index + step + PHOTOS.length) % PHOTOS.length)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
      if (!step) return
      e.preventDefault()
      onIndexChange((index + step + PHOTOS.length) % PHOTOS.length)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, index, onIndexChange])

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] gap-3 border border-border bg-card p-3 sm:max-w-3xl">
        <DialogHeader className="pr-10">
          <DialogTitle className="font-hand text-xl text-foreground">
            Photo {index + 1} of {PHOTOS.length}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {photo.alt}. Use the arrow keys or the next and previous buttons to
            move between photos.
          </DialogDescription>
        </DialogHeader>

        <div
          className="relative flex items-center justify-center touch-pan-y"
          onPointerDown={(e) => {
            swipeStart.current = { x: e.clientX, y: e.clientY }
          }}
          onPointerUp={(e) => {
            const start = swipeStart.current
            swipeStart.current = null
            if (!start) return
            const dx = e.clientX - start.x
            const dy = e.clientY - start.y
            if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
              go(dx < 0 ? 1 : -1)
            }
          }}
          onPointerCancel={() => {
            swipeStart.current = null
          }}
        >
          <img
            key={photo.file}
            src={img(`photos/${photo.file}`)}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            draggable={false}
            className="max-h-[68dvh] w-auto max-w-full rounded-sm object-contain select-none animate-in fade-in duration-200"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="absolute left-1 size-11 touch-manipulation rounded-full bg-background/70 text-foreground backdrop-blur-sm"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            aria-label="Next photo"
            onClick={() => go(1)}
            className="absolute right-1 size-11 touch-manipulation rounded-full bg-background/70 text-foreground backdrop-blur-sm"
          >
            <ChevronRightIcon />
          </Button>
        </div>

        {caption && (
          <p
            className={`mx-auto rounded-full px-5 py-1.5 font-hand text-lg font-semibold ${TONE_CLASS[caption.tone]}`}
          >
            {caption.text}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
