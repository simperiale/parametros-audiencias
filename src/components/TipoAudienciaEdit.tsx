import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link, useNavigate, useParams } from 'react-router'
import { useActualizarTipoAudiencia, useTipoAudiencia } from '../hooks/useTiposAudiencia'
import TipoAudienciaForm from './TipoAudienciaForm'

export default function TipoAudienciaEdit() {
  const { tipoAudienciaId } = useParams()
  const navigate = useNavigate()
  const tipo = useTipoAudiencia(tipoAudienciaId)
  const actualizar = useActualizarTipoAudiencia()

  if (tipo.isLoading) {
    return (
      <section>
        <Typography variant="h5" component="h1" gutterBottom>
          Modificar tipo de audiencia
        </Typography>
        <CircularProgress size={24} />
      </section>
    )
  }

  if (tipo.isError || !tipo.data) {
    return (
      <section>
        <Typography variant="h5" component="h1" gutterBottom>
          Modificar tipo de audiencia
        </Typography>
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Alert severity="error">
            {tipo.error instanceof Error ? tipo.error.message : 'No existe ese tipo de audiencia.'}
          </Alert>
          <Button component={Link} to="/tipos-audiencia">
            Volver
          </Button>
        </Stack>
      </section>
    )
  }

  const actual = tipo.data

  return (
    <TipoAudienciaForm
      key={actual.id}
      titulo="Modificar tipo de audiencia"
      inicial={actual.descripcion}
      onGuardar={(descripcion) => {
        actualizar.mutate(
          { id: actual.id, descripcion },
          { onSuccess: () => navigate('/tipos-audiencia') },
        )
      }}
    />
  )
}
