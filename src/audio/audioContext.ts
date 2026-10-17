import { createContext, useContext } from "react"

export type AudioPlayerState = {
  playing: boolean
  buffering: boolean
  failed: boolean
  duration: number
  current: number
  toggle: () => void
  retry: () => void
  seek: (seconds: number) => void
}

export const AudioPlayerContext = createContext<AudioPlayerState | null>(null)

export function useAudioPlayer() {
  const state = useContext(AudioPlayerContext)
  if (!state) throw new Error("useAudioPlayer needs an AudioProvider")
  return state
}
