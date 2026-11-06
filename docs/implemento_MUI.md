# Implementar MUI en parámetros-audiencias

MUI es una capa de componentes encima de lo que ya está. Query, Zustand y las rutas no cambian. Se cambia **con qué se pinta**.

En audiencias (`audiencias_v2-front`) eso incluye tema propio, `PageContainer` y `MaterialReactTable`. Acá se hizo de a un paso: instalar, envolver la app con el tema default, y pasar cada pantalla de HTML a componentes de MUI.

---

## 1. Instalar

El `package.json` está en `/home` del contenedor (esta carpeta montada). El install corre ahí, **adentro** del contenedor, no en la máquina.

Si ya entraste con `docker exec -it -w /home parametrosAudiencias bash`:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

Desde la máquina, sin entrar al bash:

```bash
docker exec -w /home parametrosAudiencias npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

Qué es cada paquete:

- `@mui/material` — Button, Table, Alert, TextField, Select, etc.
- `@emotion/react` y `@emotion/styled` — el motor de CSS. Sin eso MUI no pinta.
- `@mui/icons-material` — íconos (Agregar, Editar, etc.). En audiencias se usan mucho; acá todavía casi no.

No se instaló `material-react-table` ni `@fullcalendar/mui`. Eso es otra librería, después.

### Warnings de npm

`EBADENGINE` / `Unsupported engine` (Node 20 pedido, contenedor en 18.12.0) ya salía con `react-router` y TanStack. El install igual termina (`added … packages`). No hay que cambiar la imagen de Node para seguir.

`npm audit` puede listar vulnerabilidades de dependencias que ya estaban (a menudo Firebase). No correr `npm audit fix --force`.

npm tomó MUI **9**. Audiencias usa **MUI 7**. Para aprender sirve. Si más adelante se copia el tema de audiencias tal cual, se puede fijar la 7.

---

## 2. Envolver la app una vez

MUI necesita un tema. En `src/App.tsx`:

```tsx
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
```

`createTheme()` se llama **afuera** de `App`, igual que el `QueryClient`: si se creara adentro, cada render armaría un tema nuevo.

Ese provider va **una sola vez**, alrededor de toda la app, junto con `QueryClientProvider` y `AuthProvider`.

Los imports van por archivo, como en audiencias, no el barrel `@mui/material`:

```tsx
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
```

---

## 3. `createTheme()`

Arma el **objeto tema**: colores, tipografía, espaciado, sombras y cómo se ven por default los componentes. `ThemeProvider` se lo pasa a todo lo que está adentro. `Table`, `Alert` y `Button` leen de ahí; no tienen los colores hardcodeados.

Con los paréntesis vacíos no se personaliza nada. MUI rellena el tema **default** (Material Design): primary azul, secondary violeta, fondo casi blanco, Roboto.

Si se le pasa un objeto, se **pisa** solo lo indicado. El resto sigue siendo el default:

```ts
const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
})
```

Las claves de ese objeto (no es un menú de temas listos):

| Clave | Qué controla | Ejemplo |
| --- | --- | --- |
| `palette` | Colores: `primary`, `secondary`, `error`, fondo, texto | El `Button` contained usa `primary.main` |
| `typography` | Fuentes y tamaños de `h1`…`body2` | El `Typography variant="h5"` de Salas |
| `spacing` | La unidad de `theme.spacing(2)` (8px por default) | Márgenes consistentes |
| `shape` | `borderRadius` de botones y papeles | Más cuadrado o más redondo |
| `components` | Override de un componente en toda la app | Todos los `Button` sin mayúsculas |
| `colorSchemes` | Claro y oscuro | Lo que hace audiencias en `AppTheme` |

Eso **no** es lo mismo que las variantes de un componente. En un `Button` se pone `variant="contained" | "outlined" | "text"` o `color="primary"`. Esas opciones son **de esa instancia**. El tema dice qué hex es “primary”. El botón dice “quiero contained, color primary”.

Un solo `createTheme()` para toda la app. No hay un tema por pantalla.

En audiencias no llaman `createTheme()`. Llaman `createTheme({ cssVariables, colorSchemes, typography, shadows, shape, components })` en `src/theme/AppTheme.tsx`. Misma función; el argumento es el look del PJM. El `CLAUDE.md` de audiencias pide no poner `cssVarPrefix`: las variables tienen que seguir llamándose `--mui-...`.

---

## 4. `CssBaseline`

Es el “reset” de MUI: un componente que no se ve. Aplica estilos globales para que la página arranque parejo.

Cada navegador trae márgenes en el `body`, una fuente distinta, tamaños de heading distintos. Sin Baseline, un `Button` de MUI se ve bien y el resto de la página queda con la cara del browser.

Adentro de `ThemeProvider` pisa, entre otras cosas:

- margen del `body` (lo deja en 0)
- fuente y color de texto, tomados del tema
- fondo de la página (`background.default`)
- box-sizing más predecible

`ThemeProvider` reparte el tema a los componentes de MUI. `CssBaseline` aplica ese tema al HTML de afuera (`body`, tipografía). En audiencias es lo mismo, con `enableColorScheme` para claro/oscuro. Acá el tema todavía es el default.

---

## 5. Pasar las pantallas (sin tocar datos ni rutas)

El hook no se toca. `useSalas()` / `useTiposAudiencia()` siguen devolviendo `data`, `isPending`, `isError`. Solo cambia el JSX.

Primero Salas, después el resto, con la misma receta.

### Salas (`SalaList`)

| Antes | Ahora |
| --- | --- |
| `<h1>` | `Typography variant="h5" component="h1"` |
| «Cargando…» | `CircularProgress` |
| error / vacío | `Alert` |
| `<table>` | `Table` / `TableRow` / `TableCell` |

El `map` y `key={sala.id}` son los mismos.

### Tipos de audiencia (`TipoAudienciaList`)

Misma tabla que Salas. Agregar / Modificar son `Button component={Link}`: se ven como botón y navegan sin recargar. Borrar es `Button color="error"`.

```tsx
<Button component={Link} to="/tipos-audiencia/new" variant="contained">
  Agregar
</Button>
```

`component={Link}` le dice a MUI: pintate como botón, comportate como el Link del router.

### Alta y edición (`TipoAudienciaForm`, `TipoAudienciaEdit`)

`TextField` controlado (`value` + `onChange`, igual que el `<input>`). Si `validate` falla, `error` y `helperText` pintan el mensaje debajo del campo. Guardar es `type="submit"`; Volver es otro `Link` vestido de botón. Create no cambió: sigue pasando props al form.

### Login y sesión (`LoginPage`, `ProtectedRoute`)

`Button contained` y `Alert` en el ingreso. `CircularProgress` mientras Firebase decide si hay sesión.

### Fuero / organismo / rol (`ContextoUsuario`)

`Select` + `MenuItem` + `FormControl`. El borrador (`useState`) y el store (Zustand) son los mismos; cambió el JSX. Organismo sigue deshabilitado hasta que hay fuero.

### Layout y menú (`App.tsx`)

`Container maxWidth="md"` limita el ancho. El menú es una fila de `Button component={NavLink}`; la ruta activa usa la clase `.active` (negrita). Tipos de resultado: `Alert` de “todavía no está”.

`Stack` reemplaza los `<p>` sueltos: alinea en fila o en columna con `spacing`. `sx={{ mt: 8 }}` es espaciado del tema (`spacing(8)`).

---

## 6. Cómo comprobarlo

1. `npm run dev` en `/home` del contenedor (si ya corre, Vite recarga solo).
2. Login GIDP + fuero / organismo / rol.
3. Recorrer login → contexto → tipos → salas. Todas tienen que verse con estilo Material.
4. Si Vite no tomó los paquetes nuevos: `Ctrl+C` y `npm run dev` otra vez.

---

## 7. Lo que todavía no está (a propósito)

| En audiencias | Para qué | Cuándo acá |
| --- | --- | --- |
| `src/theme/AppTheme.tsx` + customizations | look & feel, claro/oscuro | cuando se quiera parecer al front real |
| `PageContainer` | título, breadcrumbs, acciones | cuando haya varias pantallas MUI más armadas |
| `material-react-table` | grilla con paginación del servidor | cuando `getAll` no alcance y entre `getPage` |
| `Dialog` / notificaciones | confirmar borrar, toasts | cuando el DELETE vaya a la API |

Copiar el `theme/` entero de una mete mucho código. El valor de este paso es: **mismo `useQuery`, otro JSX**.
