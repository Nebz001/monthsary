import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import { AudioPlayerContext } from "@/audio/audioContext"
import { SONG_AUDIO, SONG_VOLUME } from "@/data/song"

const AUDIO_SRC = `${import.meta.env.BASE_URL}${SONG_AUDIO}`

// Owns the one audio element for the whole app, so the song keeps playing while she moves
// between pages. It only starts when she presses play on the song page.
export default function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [failed, setFailed] = useState(false)
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = SONG_VOLUME
  }, [])

  const value = useMemo(
    () => ({
      playing,
      buffering,
      failed,
      duration,
      current,
      toggle: () => {
        const audio = audioRef.current
        if (!audio) return
        if (audio.paused) {
          setBuffering(audio.readyState < 3)
          audio.play().catch(() => setFailed(true))
        } else {
          audio.pause()
        }
      },
      retry: () => {
        const audio = audioRef.current
        if (!audio) return
        setFailed(false)
        setBuffering(true)
        audio.load()
      },
      seek: (seconds: number) => {
        const audio = audioRef.current
        if (!audio || Number.isNaN(seconds)) return
        audio.currentTime = seconds
        setCurrent(seconds)
      },
    }),
    [playing, buffering, failed, duration, current],
  )

  return (
    <AudioPlayerContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => {
          const d = e.currentTarget.duration
          if (Number.isFinite(d)) setDuration(d)
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onPlaying={() => {
          setPlaying(true)
          setBuffering(false)
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false)
          setCurrent(0)
        }}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onError={() => {
          setFailed(true)
          setBuffering(false)
          setPlaying(false)
        }}
      />
      {children}
    </AudioPlayerContext.Provider>
  )
}
