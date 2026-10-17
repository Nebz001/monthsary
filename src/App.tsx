import { useCallback, useState } from "react"
import { HashRouter, Navigate, Route, Routes } from "react-router-dom"

import AudioProvider from "@/audio/AudioProvider"
import LockScreen from "@/components/LockScreen"
import { SESSION_KEY } from "@/config"
import FlowerPage from "@/pages/FlowerPage"
import HomePage from "@/pages/HomePage"
import LetterPage from "@/pages/LetterPage"
import SongPage from "@/pages/SongPage"

function readUnlocked() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1"
  } catch {
    return false
  }
}

function App() {
  const [unlocked, setUnlocked] = useState(readUnlocked)

  const handleUnlock = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      // Storage can be unavailable (private mode); unlock still works for this visit.
    }
    setUnlocked(true)
  }, [])

  // The lock sits in front of every route, so a direct link still asks for the date first.
  // The audio provider sits above the routes so the song keeps playing on every page.
  return (
    <AudioProvider>
      <HashRouter>
        {unlocked ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flower" element={<FlowerPage />} />
            <Route path="/letter" element={<LetterPage />} />
            <Route path="/song" element={<SongPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <LockScreen onUnlock={handleUnlock} />
        )}
      </HashRouter>
    </AudioProvider>
  )
}

export default App
