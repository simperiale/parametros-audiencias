import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import LoginPage from '../pages/LoginPage'
import useAuth from './useAuth'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Stack spacing={2} sx={{ alignItems: 'center', mt: 8 }}>
        <CircularProgress />
        <Typography>Cargando sesión…</Typography>
      </Stack>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return children
}
