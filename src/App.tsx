import { useCallback, useState } from "react"

import LockScreen from "@/components/LockScreen"
import NextPage from "@/components/NextPage"
import { SESSION_KEY } from "@/config"

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

  return unlocked ? <NextPage /> : <LockScreen onUnlock={handleUnlock} />
}

export default App
