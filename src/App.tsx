import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { createHashRouter, NavLink, Navigate, Outlet, RouterProvider } from 'react-router'
import AuthProvider from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import useAuth from './auth/useAuth'
import ContextoUsuario from './components/ContextoUsuario'
import SalaList from './components/SalaList'
import TipoAudienciaCreate from './components/TipoAudienciaCreate'
import TipoAudienciaEdit from './components/TipoAudienciaEdit'
import TipoAudienciaList from './components/TipoAudienciaList'
import { useContextoUsuario } from './stores/contextoUsuario'

const ENTRADAS: { path: string; titulo: string }[] = [
  { path: '/salas', titulo: 'Salas' },
  { path: '/tipos-audiencia', titulo: 'Tipos de audiencia' },
  { path: '/tipos-resultado', titulo: 'Tipos de resultado' },
]

function Menu() {
  return (
    <Stack component="nav" direction="row" spacing={1} sx={{ my: 2 }}>
      {ENTRADAS.map((entrada) => (
        <Button
          key={entrada.path}
          component={NavLink}
          to={entrada.path}
          sx={{ '&.active': { fontWeight: 700 } }}
        >
          {entrada.titulo}
        </Button>
      ))}
    </Stack>
  )
}

function Layout() {
  const { user, logout } = useAuth()
  const idOrganismo = useContextoUsuario((s) => s.idOrganismo)
  const rol = useContextoUsuario((s) => s.rol)
  const limpiar = useContextoUsuario((s) => s.limpiar)
  const incompleto = !idOrganismo || !rol

  function cerrarSesion() {
    limpiar()
    void logout()
  }

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2">{user?.email}</Typography>
        <Button type="button" onClick={cerrarSesion}>
          Cerrar sesión
        </Button>
      </Stack>
      <ContextoUsuario />
      {incompleto ? null : (
        <>
          <Menu />
          <Outlet />
        </>
      )}
    </Container>
  )
}

function Proximamente({ titulo }: { titulo: string }) {
  return (
    <section>
      <Typography variant="h5" component="h1" gutterBottom>
        {titulo}
      </Typography>
      <Alert severity="info">Esta pantalla todavía no está.</Alert>
    </section>
  )
}

function TiposResultado() {
  return <Proximamente titulo="Tipos de resultado" />
}

const router = createHashRouter([
  {
    Component: Layout,
    children: [
      { path: '/salas', Component: SalaList },
      { path: '/tipos-audiencia', Component: TipoAudienciaList },
      { path: '/tipos-audiencia/new', Component: TipoAudienciaCreate },
      { path: '/tipos-audiencia/:tipoAudienciaId/edit', Component: TipoAudienciaEdit },
      { path: '/tipos-resultado', Component: TiposResultado },
      { path: '*', element: <Navigate to="/tipos-audiencia" replace /> },
    ],
  },
])

const theme = createTheme()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProtectedRoute>
          <RouterProvider router={router} />
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  )
}
