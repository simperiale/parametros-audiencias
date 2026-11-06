import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useSalas } from '../hooks/useSalas'
import { useContextoUsuario } from '../stores/contextoUsuario'

export default function SalaList() {
  const idFuero = useContextoUsuario((s) => s.idFuero)
  const salas = useSalas(idFuero)

  return (
    <section>
      <Typography variant="h5" component="h1" gutterBottom>
        Salas
      </Typography>
      {salas.isPending ? (
        <CircularProgress size={24} />
      ) : salas.isError ? (
        <Alert severity="error">No se pudieron cargar las salas.</Alert>
      ) : !salas.data || salas.data.length === 0 ? (
        <Alert severity="info">No hay salas.</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Capacidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salas.data.map((sala) => (
                <TableRow key={sala.id}>
                  <TableCell>{sala.nombre}</TableCell>
                  <TableCell>{sala.capacidad ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </section>
  )
}
