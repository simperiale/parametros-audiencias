import { initializeApp } from 'firebase/app'
import { getAuth, OAuthProvider } from 'firebase/auth'

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
})

export const auth = getAuth(app)
export const entraProvider = new OAuthProvider(import.meta.env.VITE_AUTH_PROVIDER_ID)
