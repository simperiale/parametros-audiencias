import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import type { Organismo } from '../data/organismos'
import { useFueros } from '../hooks/useFueros'
import { useOrganismos } from '../hooks/useOrganismos'
import { useUsuarioRol } from '../hooks/useUsuarioRol'
import { useContextoUsuario } from '../stores/contextoUsuario'

function organismosDelFuero(organismos: Organismo[], idFuero: string | null): Organismo[] {
  if (!idFuero) {
    return []
  }
  const conFuero = organismos.filter((organismo) => organismo.id_fuero)
  if (conFuero.length === 0) {
    return organismos.filter((organismo) => organismo.habilitado !== false)
  }
  return organismos.filter(
    (organismo) => organismo.id_fuero === idFuero && organismo.habilitado !== false,
  )
}

export default function ContextoUsuario() {
  const idFuero = useContextoUsuario((s) => s.idFuero)
  const nombreFuero = useContextoUsuario((s) => s.nombreFuero)
  const idOrganismo = useContextoUsuario((s) => s.idOrganismo)
  const nombreOrganismo = useContextoUsuario((s) => s.nombreOrganismo)
  const rol = useContextoUsuario((s) => s.rol)
  const setContexto = useContextoUsuario((s) => s.setContexto)

  const incompleto = !idOrganismo || !rol
  const [editando, setEditando] = useState(false)
  const [fueroBorrador, setFueroBorrador] = useState('')
  const [organismoBorrador, setOrganismoBorrador] = useState('')
  const [rolBorrador, setRolBorrador] = useState('')

  const fueros = useFueros()
  const organismos = useOrganismos()
  const usuarioRol = useUsuarioRol()
  const organismosFiltrados = organismosDelFuero(organismos.data ?? [], fueroBorrador || null)
  const roles = usuarioRol.data?.roles ?? []

  const mostrarFormulario = incompleto || editando
  const partes = [nombreFuero, nombreOrganismo, rol].filter(Boolean)
  const etiqueta = partes.length > 0 ? partes.join(' · ') : 'Elegí fuero, organismo y rol'

  function cambiarFuero(id: string) {
    setFueroBorrador(id)
    setOrganismoBorrador('')
  }

  function abrirFormulario() {
    setFueroBorrador(idFuero ?? '')
    setOrganismoBorrador(idOrganismo ?? '')
    setRolBorrador(rol ?? '')
    setEditando(true)
  }

  function guardar() {
    const fuero = fueros.data?.find((item) => item.id === fueroBorrador)
    const organismo = organismosFiltrados.find((item) => item.id === organismoBorrador)
    const rolElegido = roles.find((item) => item.rol === rolBorrador)
    if (!fuero || !organismo || !rolElegido) {
      return
    }
    setContexto({
      idFuero: fuero.id,
      nombreFuero: fuero.nombre,
      idOrganismo: organismo.id,
      nombreOrganismo: organismo.descripcion_corta || organismo.descripcion,
      rol: rolElegido.rol,
    })
    setEditando(false)
  }

  if (!mostrarFormulario) {
    return (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', my: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          {etiqueta}
        </Typography>
        <Button type="button" size="small" onClick={abrirFormulario}>
          Cambiar
        </Button>
      </Stack>
    )
  }

  const cargando = fueros.isPending || organismos.isPending || usuarioRol.isPending
  const error = fueros.isError || organismos.isError || usuarioRol.isError

  return (
    <Stack spacing={2} sx={{ maxWidth: 480, my: 2 }}>
      <Typography variant="h6" component="h2">
        Fuero, organismo y rol
      </Typography>
      {incompleto ? (
        <Alert severity="warning">Tenés que elegir organismo y rol para continuar.</Alert>
      ) : null}
      {cargando ? <CircularProgress size={24} /> : null}
      {error ? <Alert severity="error">No se pudieron cargar fuero, organismo o rol.</Alert> : null}
      <FormControl fullWidth>
        <InputLabel id="contexto-fuero-label">Fuero</InputLabel>
        <Select
          labelId="contexto-fuero-label"
          label="Fuero"
          value={fueroBorrador}
          onChange={(event) => cambiarFuero(String(event.target.value))}
        >
          <MenuItem value="">Elegí un fuero</MenuItem>
          {(fueros.data ?? []).map((fuero) => (
            <MenuItem key={fuero.id} value={fuero.id}>
              {fuero.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth disabled={!fueroBorrador}>
        <InputLabel id="contexto-organismo-label">Organismo</InputLabel>
        <Select
          labelId="contexto-organismo-label"
          label="Organismo"
          value={organismoBorrador}
          onChange={(event) => setOrganismoBorrador(String(event.target.value))}
        >
          <MenuItem value="">Elegí un organismo</MenuItem>
          {organismosFiltrados.map((organismo) => (
            <MenuItem key={organismo.id} value={organismo.id}>
              {organismo.descripcion}
              {organismo.descripcion_corta ? ` (${organismo.descripcion_corta})` : ''}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="contexto-rol-label">Rol</InputLabel>
        <Select
          labelId="contexto-rol-label"
          label="Rol"
          value={rolBorrador}
          onChange={(event) => setRolBorrador(String(event.target.value))}
        >
          <MenuItem value="">Elegí un rol</MenuItem>
          {roles.map((item) => (
            <MenuItem key={item.rol} value={item.rol}>
              {item.rol}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" spacing={1}>
        {incompleto ? null : (
          <Button type="button" onClick={() => setEditando(false)}>
            Cancelar
          </Button>
        )}
        <Button
          type="button"
          variant="contained"
          onClick={guardar}
          disabled={!fueroBorrador || !organismoBorrador || !rolBorrador}
        >
          Guardar
        </Button>
      </Stack>
    </Stack>
  )
}
