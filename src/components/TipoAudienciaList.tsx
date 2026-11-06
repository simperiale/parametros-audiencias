import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router'
import { useBorrarTipoAudiencia, useTiposAudiencia } from '../hooks/useTiposAudiencia'
import { useContextoUsuario } from '../stores/contextoUsuario'

export default function TipoAudienciaList() {
  const idFuero = useContextoUsuario((s) => s.idFuero)
  const tipos = useTiposAudiencia(idFuero)
  const borrar = useBorrarTipoAudiencia()

  return (
    <section>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Tipos de audiencia
        </Typography>
        <Button component={Link} to="/tipos-audiencia/new" variant="contained">
          Agregar
        </Button>
      </Stack>
      {tipos.isPending ? (
        <CircularProgress size={24} />
      ) : tipos.isError ? (
        <Alert severity="error">No se pudieron cargar los tipos.</Alert>
      ) : !tipos.data || tipos.data.length === 0 ? (
        <Alert severity="info">No hay tipos.</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descripción</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tipos.data.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell>{tipo.descripcion}</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/tipos-audiencia/${tipo.id}/edit`}
                      size="small"
                    >
                      Modificar
                    </Button>
                    <Button
                      type="button"
                      size="small"
                      color="error"
                      onClick={() => borrar.mutate(tipo.id)}
                      disabled={borrar.isPending}
                    >
                      Borrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </section>
  )
}
