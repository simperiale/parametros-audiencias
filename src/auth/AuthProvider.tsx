import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { auth, entraProvider } from '../firebase'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const login = useCallback(async () => {
    await signInWithPopup(auth, entraProvider)
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}
