import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { validate } from '../data/tiposAudiencia'

export default function TipoAudienciaForm({
  titulo,
  inicial,
  onGuardar,
}: {
  titulo: string
  inicial: string
  onGuardar: (descripcion: string) => void
}) {
  const [descripcion, setDescripcion] = useState(inicial)
  const [error, setError] = useState<string | undefined>(undefined)

  function guardar(event: FormEvent) {
    event.preventDefault()
    const { issues } = validate(descripcion)
    if (issues.length > 0) {
      setError(issues[0].message)
      return
    }
    setError(undefined)
    onGuardar(descripcion.trim())
  }

  return (
    <section>
      <Typography variant="h5" component="h1" gutterBottom>
        {titulo}
      </Typography>
      <form onSubmit={guardar}>
        <Stack spacing={2} sx={{ maxWidth: 480 }}>
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained">
              Guardar
            </Button>
            <Button component={Link} to="/tipos-audiencia">
              Volver
            </Button>
          </Stack>
        </Stack>
      </form>
    </section>
  )
}
