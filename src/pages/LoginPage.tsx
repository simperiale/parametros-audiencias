import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useCallback, useState } from 'react'
import useAuth from '../auth/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const ingresar = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      await login()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }, [login])

  return (
    <Stack spacing={2} sx={{ maxWidth: 360, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" component="h1">
        Parámetros
      </Typography>
      <Typography color="text.secondary">Ingresá con tu cuenta institucional GIDP</Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Button type="button" variant="contained" onClick={ingresar} disabled={loading}>
        {loading ? 'Ingresando…' : 'Ingresar con GIDP'}
      </Button>
    </Stack>
  )
}
