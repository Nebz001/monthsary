import { LoaderCircleIcon, PauseIcon, PlayIcon } from "lucide-react"

import { useAudioPlayer } from "@/audio/audioContext"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

// Our own controls for the app-wide audio element. Nothing plays until she presses play,
// and the song keeps playing after she leaves this page.
export default function SongPlayer({ title }: { title: string }) {
  const { playing, buffering, failed, duration, current, toggle, retry, seek } =
    useAudioPlayer()

  const label = playing ? `Pause ${title}` : `Play ${title}`

  if (failed) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <p
          role="alert"
          className="font-hand text-[clamp(1.15rem,4.4vw,1.45rem)] text-blush"
        >
          The song couldn’t load, try again
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={retry}
          className="h-12 touch-manipulation rounded-2xl border-border px-8 font-hand text-xl focus-visible:ring-4 focus-visible:ring-ring/60"
        >
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full">
        <Slider
          min={0}
          max={duration > 0 ? duration : 1}
          step={3}
          largeStep={10}
          value={[Math.min(current, duration > 0 ? duration : 0)]}
          disabled={duration <= 0}
          onValueChange={(value) =>
            seek(Array.isArray(value) ? value[0] : (value as number))
          }
          thumbLabel={`${title} progress`}
          getThumbValueText={(value) =>
            `${formatTime(value)} of ${formatTime(duration)}`
          }
          className="py-2"
        />
        <div className="mt-1 flex justify-between font-hand text-sm text-blush">
          <span>{formatTime(current)}</span>
          <span>{duration > 0 ? formatTime(duration) : "-:--"}</span>
        </div>
      </div>

      <Button
        type="button"
        aria-label={label}
        aria-busy={buffering}
        onClick={toggle}
        className="size-[clamp(4.5rem,19vw,6rem)] touch-manipulation rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-transform hover:bg-primary hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-ring/60 [&_svg:not([class*='size-'])]:size-[40%]"
      >
        {buffering ? (
          <LoaderCircleIcon
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
        ) : playing ? (
          <PauseIcon className="fill-current" aria-hidden="true" />
        ) : (
          <PlayIcon className="translate-x-0.5 fill-current" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}
