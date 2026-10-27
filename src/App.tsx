import { createHashRouter, NavLink, Navigate, Outlet, RouterProvider } from 'react-router'
import TipoAudienciaCreate from './components/TipoAudienciaCreate'
import TipoAudienciaEdit from './components/TipoAudienciaEdit'
import TipoAudienciaList from './components/TipoAudienciaList'

const ENTRADAS: { path: string; titulo: string }[] = [
  { path: '/salas', titulo: 'Salas' },
  { path: '/tipos-audiencia', titulo: 'Tipos de audiencia' },
  { path: '/tipos-resultado', titulo: 'Tipos de resultado' },
]

function Menu() {
  return (
    <nav>
      <ul>
        {ENTRADAS.map((entrada) => (
          <li key={entrada.path}>
            <NavLink to={entrada.path}>
              {({ isActive }) => (isActive ? <strong>{entrada.titulo}</strong> : entrada.titulo)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Layout() {
  return (
    <div>
      <Menu />
      <Outlet />
    </div>
  )
}

function Proximamente({ titulo }: { titulo: string }) {
  return (
    <section>
      <h1>{titulo}</h1>
      <p>Esta pantalla todavía no está.</p>
    </section>
  )
}

function Salas() {
  return <Proximamente titulo="Salas" />
}

function TiposResultado() {
  return <Proximamente titulo="Tipos de resultado" />
}

const router = createHashRouter([
  {
    Component: Layout,
    children: [
      { path: '/salas', Component: Salas },
      { path: '/tipos-audiencia', Component: TipoAudienciaList },
      { path: '/tipos-audiencia/new', Component: TipoAudienciaCreate },
      { path: '/tipos-audiencia/:tipoAudienciaId/edit', Component: TipoAudienciaEdit },
      { path: '/tipos-resultado', Component: TiposResultado },
      { path: '*', element: <Navigate to="/tipos-audiencia" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
