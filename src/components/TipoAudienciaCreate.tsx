import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router'
import { useCrearTipoAudiencia } from '../hooks/useTiposAudiencia'
import { useContextoUsuario } from '../stores/contextoUsuario'
import TipoAudienciaForm from './TipoAudienciaForm'

export default function TipoAudienciaCreate() {
  const navigate = useNavigate()
  const idFuero = useContextoUsuario((s) => s.idFuero)
  const crear = useCrearTipoAudiencia()

  return (
    <Stack spacing={2}>
      {crear.isError ? (
        <Alert severity="error">
          No se pudo crear el tipo de audiencia.
          {crear.error instanceof Error ? ` ${crear.error.message}` : ''}
        </Alert>
      ) : null}
      <TipoAudienciaForm
        titulo="Nuevo tipo de audiencia"
        inicial=""
        onGuardar={(descripcion) => {
          if (!idFuero) {
            return
          }
          crear.mutate(
            { descripcion, idFuero },
            { onSuccess: () => navigate('/tipos-audiencia') },
          )
        }}
      />
    </Stack>
  )
}
