# Presentación React

Guión para recorrer el temario con el código de **parámetros-audiencias**. La app se abre en `http://localhost:3001`. El menú tiene Salas, Tipos de audiencia y Tipos de resultado. La única pantalla con datos es tipos de audiencia.

El temario corto está en `docs/Presentación React.txt`. Este archivo es la explicación, punto por punto, sobre este proyecto.

El punto 8 (Zustand) se completa cuando agreguemos el store.

---

## 1. Modelo mental

La pantalla es el resultado de ejecutar una función con el estado de ese momento. Para cambiar lo que se ve, se cambia el estado. React vuelve a ejecutar la función y pinta el resultado. El componente no busca el input en el DOM para leerle el valor ni para escribirle otro.

`TipoAudienciaForm` es esa función. Recibe datos de entrada (props) y devuelve la pantalla:

```tsx
export default function TipoAudienciaForm({
  titulo,
  inicial,
  onGuardar,
}: {
  titulo: string
  inicial: string
  onGuardar: (descripcion: string) => void
})
```

- `titulo` e `inicial` entran desde afuera. Alta le pasa `inicial=""`. Edición le pasa la descripción que ya está guardada.
- `onGuardar` también entra desde afuera. El formulario no sabe si está creando o modificando: cuando la validación pasa, llama a esa función.

Adentro hay estado propio. `descripcion` es lo que la persona está escribiendo. `error` es el mensaje de validación.

```tsx
const [descripcion, setDescripcion] = useState(inicial)
const [error, setError] = useState<string | undefined>(undefined)
```

El input está atado a ese estado. `value={descripcion}` dice qué se muestra. `onChange` avisa que el texto cambió y `setDescripcion` guarda el texto nuevo. En el próximo render, `value` ya es el texto nuevo.

```tsx
<input value={descripcion} onChange={(event) => setDescripcion(event.target.value)} />
```

Cada tecla dispara un render. El `<h1>{titulo}</h1>` y el párrafo de error salen del mismo render. Si `error` tiene texto, el párrafo está. Si no, en su lugar va `null` y no se pinta nada.

El estado se reemplaza, no se modifica por dentro. En `updateOne`, el tipo guardado no recibe `actual.descripcion = descripcion`. Se arma un objeto nuevo y una lista nueva:

```ts
const actualizado: TipoAudiencia = { ...actual, descripcion }
tipos = tipos.map((tipo) => (tipo.id === id ? actualizado : tipo))
```

`getAll` devuelve una copia (`[...tipos]`). Quien lee la lista no puede pisar el array interno.

En la charla: escribir en Descripción y señalar que el título no se toca con JavaScript del DOM. Cambia el estado `descripcion` y el input se vuelve a pintar.

---

## 2. JS moderno

### Destructuring

Sacar campos de un objeto en la misma línea.

En el formulario, los parámetros ya llegan desarmados: `titulo`, `inicial`, `onGuardar`.

En edición, el id sale de la ruta:

```tsx
const { tipoAudienciaId } = useParams()
```

En el guardar del formulario, de `validate` solo importa `issues`:

```tsx
const { issues } = validate(descripcion)
```

En la mutación de actualizar, el argumento llega desarmado en `id` y `descripcion`:

```ts
mutationFn: ({ id, descripcion }: { id: string; descripcion: string }) =>
  updateOne(id, descripcion),
```

### Spread

Copiar y, si hace falta, pisar un campo.

`[...tipos]` es una lista nueva con los mismos elementos. `{ ...actual, descripcion }` es un tipo nuevo: el resto de los campos igual, `descripcion` con el valor que acaba de llegar.

### Arrow functions

Funciones cortas, casi siempre como callback. El `map` del menú, el `onChange` del input, el `onGuardar` de alta y de edición.

### map y filter

`map` recorre y arma otra lista. El menú recorre `ENTRADAS`. El listado recorre `tipos.data`. `updateOne` recorre `tipos` y deja el mismo elemento en todas las posiciones salvo en el id editado.

`filter` se queda con los que pasan la condición. `deleteOne` arma la lista sin el id borrado:

```ts
tipos = tipos.filter((tipo) => tipo.id !== id)
```

### Módulos

Cada archivo exporta lo suyo y el otro lo importa. `src/data/tiposAudiencia.ts` exporta tipos y funciones, sin React. El hook importa esas funciones. El listado importa el hook, no el archivo de datos.

### `?.` y `??`

`?.` lee una propiedad solo si el objeto existe. `??` elige el valor de la derecha cuando el de la izquierda es `null` o `undefined`.

En el hook de una ficha, si no hay id, la clave usa un string vacío:

```ts
queryKey: queryKeys.tiposAudiencia.detail(id ?? ''),
```

`id ?? ''` entra cuando `id` es `undefined`. Un string vacío no se confunde con un id real, y además la query ni siquiera corre: `enabled: Boolean(id)`.

En este proyecto casi no hace falta `?.`. El caso del temario aparece en el cliente HTTP de audiencias: `auth.currentUser?.getIdToken()` llama a `getIdToken` solo si hay un usuario.

### `{count && <X />}` cuando count es 0

`&&` no devuelve un booleano: devuelve el primer valor si es falsy, o el segundo si el primero es truthy. `0` es falsy. React pinta en la página el número `0`.

```tsx
{tipos.data.length && <ul>...</ul>}
```

Con la lista vacía eso mostraría `0` en la pantalla.

El listado usa ternarios, y cada rama es un elemento o un párrafo:

```tsx
{tipos.isPending ? (
  <p>Cargando…</p>
) : tipos.isError ? (
  <p>No se pudieron cargar los tipos.</p>
) : tipos.data.length === 0 ? (
  <p>No hay tipos.</p>
) : (
  <ul>...</ul>
)}
```

El formulario hace lo mismo con el error: `{error ? <p>{error}</p> : null}`. `null` no se ve.

---

## 3. Async/await

Una promesa es un resultado que llega después. `async` marca una función que devuelve una promesa. `await` pausa esa función hasta que la promesa termina, y el resto del programa sigue.

En este proyecto no hay servidor. Las funciones de `src/data/tiposAudiencia.ts` igual devuelven `Promise`, que es la forma que espera TanStack Query:

```ts
export async function getAll(): Promise<TipoAudiencia[]> {
  return [...tipos]
}
```

`return [...tipos]` adentro de una función `async` queda envuelto en una promesa resuelta. `useQuery` hace el `await` por su cuenta.

El error también viaja por esa promesa. Si el id no está, `getOne` lanza:

```ts
if (!tipo) {
  throw new Error('No existe ese tipo de audiencia.')
}
```

Query atrapa el throw y la pantalla de edición lee `tipo.isError`. La ruta `#/tipos-audiencia/no-existe/edit` muestra ese mensaje.

### fetch, try/catch y res.ok

Eso está en audiencias, en `src/lib/apiClient.ts`. El esquema es el mismo que va a tener este proyecto el día que deje la memoria y llame a la API:

```ts
const res = await fetch(url, opciones)
if (!res.ok) {
  throw new Error(...)
}
return res.json()
```

`fetch` solo rechaza la promesa si la red falla. Un 404 o un 500 llegan como respuesta normal, con `res.ok === false`. Por eso el chequeo va explícito: si no, Query creería que la llamada salió bien. El `throw` es lo que después se ve como `isError`.

### Promise.all

Sirve para esperar varias promesas a la vez, en lugar de una detrás de la otra.

Acá no hay dos pedidos juntos. Si una pantalla necesitara el tipo y otro catálogo, serían dos `useQuery` en el mismo componente: Query los dispara en paralelo. `Promise.all` es la versión de eso cuando las llamadas se escriben a mano, fuera de un componente.

---

## 4. Hooks

Un hook es una función de React que se engancha al render de un componente. `useState`, `useQuery` y los hooks propios de `src/hooks/useTiposAudiencia.ts` son hooks. Pueden llamarse solo desde un componente o desde otro hook, y siempre en el mismo orden.

### useState

Guarda un valor entre renders. El formulario tiene dos:

```tsx
const [descripcion, setDescripcion] = useState(inicial)
const [error, setError] = useState<string | undefined>(undefined)
```

`useState(inicial)` usa `inicial` solo en el primer render de esa instancia. Los renders siguientes conservan lo que la persona escribió, aunque el padre le pase otra `inicial`. Por eso la edición pone `key={actual.id}` en el formulario: si cambia el tipo, React tira esa instancia y crea otra, y `useState(inicial)` corre de nuevo con la descripción nueva.

`setError` y `setDescripcion` programan el próximo render. Llamarlos no cambia `descripcion` en la línea de abajo: el valor nuevo aparece cuando la función del componente vuelve a ejecutarse.

### useEffect, y cuándo no usarlo

`useEffect` corre después del render, para sincronizar el componente con algo de afuera (un título del documento, una suscripción).

Cargar la lista no va en un efecto. El listado no tiene `useEffect`: pide los datos con `useTiposAudiencia`. El combo que el temario quiere dejar atrás es el de audiencias en `TipoAudienciaList`: un estado para los datos, un estado para el loading, un estado para el error, y un `useEffect` que llama a `getPage`.

### useRef

Guarda un valor mutable que sobrevive a los renders y no los dispara. También guarda un nodo del DOM, cuando de verdad hace falta medirlo o enfocarlo.

Este proyecto no lo usa. El input se controla con `value` y `onChange`, así que no hace falta un ref para leer lo que está escrito.

### useMemo y useCallback

Memorizan un cálculo o una función para no rehacerlos en cada render. Sirven cuando ese valor es dependencia de otro hook, o cuando un hijo memorizado se evita un render caro. Ponerlos por costumbre no acelera nada y suma código para leer.

Acá no hay ninguno. El `onClick` del botón Borrar se crea de nuevo en cada render y alcanza:

```tsx
onClick={() => borrar.mutate(tipo.id)}
```

### Custom hooks

`useTiposAudiencia`, `useTipoAudiencia`, `useCrearTipoAudiencia`, `useActualizarTipoAudiencia` y `useBorrarTipoAudiencia` agrupan la llamada a Query. El componente pide «los tipos» o «borrar este id» y no arma `queryKey` ni `invalidateQueries`.

El nombre empieza con `use` porque adentro llaman a `useQuery` o `useMutation`. Esa es la regla que los hace hooks.

### Nunca dentro de un if o un loop

React guarda el estado de cada hook según el orden de las llamadas. Si un render llama a un hook y el siguiente no, el orden se corre y el estado queda pegado al hook equivocado.

En `TipoAudienciaEdit` los cuatro hooks van antes de cualquier `return`:

```tsx
const { tipoAudienciaId } = useParams()
const navigate = useNavigate()
const tipo = useTipoAudiencia(tipoAudienciaId)
const actualizar = useActualizarTipoAudiencia()

if (tipo.isLoading) {
  return ( /* Cargando… */ )
}
```

`useActualizarTipoAudiencia` corre también mientras la ficha está cargando y también cuando el id no existe. Moverlo debajo del `if` haría que, al pasar de «cargando» a «listo», aparezca un hook nuevo en el medio de la lista.

---

## 5. Render

### Qué dispara un re-render

React vuelve a ejecutar el componente cuando cambia un estado al que está suscripto.

- En el formulario, cada `setDescripcion` y cada `setError`.
- En el listado, el pasaje de `isPending` a datos, o a `isError`. Lo dispara la caché de Query, no un `useState` del componente.
- Mientras una baja está en curso, `borrar.isPending` pasa a `true` y el botón se deshabilita. Eso es otro render.
- Si el padre se renderiza, el hijo también. `Layout` se renderiza y con él `Menu` y la pantalla de adentro (`Outlet`).

Pintar no es lo mismo que pedir datos. El cuerpo de `TipoAudienciaList` puede ejecutarse varias veces y `getAll` corre cuando Query decide fetchear, no en cada tecla de otra pantalla.

### key en listas

React empareja cada ítem del render anterior con el del render nuevo. `key={tipo.id}` le dice que «Preliminar» sigue siendo el mismo ítem aunque cambie de posición.

```tsx
{tipos.data.map((tipo) => (
  <li key={tipo.id}>
```

Con el índice del array como key, borrar el primero haría que React reutilice el `<li>` del segundo para pintar lo que ahora está primero. En una lista de texto se nota poco. En una lista con inputs, el texto quedaría en la fila equivocada.

La misma idea está en el formulario de edición: `key={actual.id}` identifica la instancia. Otro id, otra instancia, estado interno nuevo.

### Closures con estado viejo

Una función recuerda las variables del render en el que fue creada.

```tsx
onChange={(event) => setDescripcion(event.target.value)}
```

Esa función no suma sobre `descripcion`. Toma el valor del evento, así que no arrastra el texto de un render anterior.

El caso que se rompe es guardar el estado para usarlo más tarde:

```tsx
setTimeout(() => {
  setCount(count + 1)
}, 1000)
```

`count` es el número de ese render. Si se dispara dos veces antes del segundo, las dos suman el mismo número. La forma que lee el valor más nuevo es `setCount((actual) => actual + 1)`.

En este proyecto el guardar del formulario corre en el submit, en el mismo render en el que `descripcion` es el texto actual. No hay un timer de por medio.

### StrictMode en desarrollo

`src/main.tsx` envuelve la app en `<StrictMode>`. En desarrollo, React monta el árbol, lo desmonta y lo monta otra vez, y corre los efectos dos veces. Sirve para descubrir efectos que se olvidan de limpiar, o un render que modifica algo mientras pinta.

`getAll` solo lee y devuelve una copia, así que llamarla dos veces deja los datos iguales. `createOne` no puede ir en una query: incrementa `siguienteId` y agrega un elemento. Eso vive en la mutación, que corre cuando la persona aprieta Guardar, una vez.

En el build de producción, StrictMode no duplica ese ciclo.

---

## 6. TanStack Query

Hay dos clases de estado.

El estado del servidor es lo que vive en la API (acá, el array en memoria que hace de API): la lista de tipos, una ficha. Lo comparten todas las pantallas y puede quedar viejo si alguien dio de alta en otra. Va en Query.

El estado del cliente es de esta pantalla y de esta sesión: el texto a medio escribir, el mensaje «La descripción es requerida». Vive en el `useState` del formulario. No se manda a la caché.

### Dónde está armado

`src/lib/queryClient.ts` crea un solo `QueryClient`, afuera de cualquier componente. `main.tsx` lo pasa con `QueryClientProvider`. Crearlo adentro de `App` lo reinventaría en cada render y la caché se perdería.

`src/lib/queryKeys.ts` nombra los datos:

```ts
export const queryKeys = {
  tiposAudiencia: {
    all: ['tipos-audiencia'] as const,
    detail: (id: string) => ['tipos-audiencia', id] as const,
  },
}
```

La misma clave es la misma entrada de caché. `['tipos-audiencia']` es la lista. `['tipos-audiencia', '2']` es la ficha del id 2.

### useQuery

```ts
export function useTiposAudiencia() {
  return useQuery({
    queryKey: queryKeys.tiposAudiencia.all,
    queryFn: getAll,
  })
}
```

`queryFn` es la función async de `data/`. El componente recibe `isPending`, `isError` y `data`, y no llama a `getAll`.

La ficha solo pide si hay id:

```ts
export function useTipoAudiencia(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tiposAudiencia.detail(id ?? ''),
    queryFn: () => getOne(id as string),
    enabled: Boolean(id),
  })
}
```

`retry: false` en el cliente está puesto a propósito. El default reintenta tres veces. Un id que no existe va a fallar igual las tres, y la pantalla de error tardaría en aparecer.

`isPending` significa «todavía no hay datos». `isLoading` significa «todavía no hay datos y además hay un pedido en curso». El listado usa `isPending`. La edición usa `isLoading`: con la query apagada (`enabled: false`), `isPending` es verdadero e `isLoading` es falso, y la pantalla sigue hacia el mensaje de «no existe» en lugar de quedarse en «Cargando…».

Con datos en memoria la promesa se resuelve enseguida. «Cargando…» está en el código y casi no se alcanza a ver. En las DevTools de Query (el botón abajo a la izquierda) se ve el pedido y la entrada de caché.

### useMutation e invalidateQueries

Crear, modificar y borrar no son queries. Son mutaciones: cambian los datos y, si salen bien, marcan la lista como vieja.

```ts
return useMutation({
  mutationFn: (descripcion: string) => createOne(descripcion),
  onSuccess: () => invalidarTipos(queryClient),
})
```

`invalidarTipos` llama a `invalidateQueries` con la clave `['tipos-audiencia']`. Query trata esa clave como prefijo, así que también marca las fichas `['tipos-audiencia', id]`. El listado, si está montado, vuelve a ejecutar `getAll` y pinta el alta, el nombre nuevo o la baja.

Alta y edición navegan al listado en el `onSuccess` de `mutate`, después de que la mutación terminó:

```tsx
crear.mutate(descripcion, {
  onSuccess: () => navigate('/tipos-audiencia'),
})
```

### Qué reemplaza

El listado de tipos en audiencias (`TipoAudienciaList`) guarda los datos, el loading y el error en tres `useState`, y un `useEffect` llama a `getPage` cuando cambia la página. Después de borrar, vuelve a llamar a esa carga a mano.

Acá el componente declara la clave y la función. La caché, el estado de carga y el refresco después de escribir quedan en Query.

---

## 7. React Router

La URL dice qué pantalla mostrar. Con `createHashRouter` la ruta va después del `#`: `http://localhost:3001/#/tipos-audiencia`. El servidor siempre entrega `index.html` y el router lee el hash en el navegador. Sirve para abrir la app desde el contenedor sin configurar redirects.

Las rutas están en `src/App.tsx`:

| Ruta | Pantalla |
| --- | --- |
| `/salas` | aviso de que todavía no está |
| `/tipos-audiencia` | listado |
| `/tipos-audiencia/new` | alta |
| `/tipos-audiencia/:tipoAudienciaId/edit` | edición |
| cualquier otra | redirige al listado |

`:tipoAudienciaId` es el parámetro. En `#/tipos-audiencia/2/edit`, `useParams()` devuelve `{ tipoAudienciaId: '2' }`.

### Link y NavLink

`<Link to="...">` cambia la ruta sin recargar la página. El listado lo usa para Agregar y para Modificar. El formulario lo usa para Volver.

`<NavLink>` es un link que sabe si su ruta es la actual. El menú lo usa para poner el título en negrita:

```tsx
<NavLink to={entrada.path}>
  {({ isActive }) => (isActive ? <strong>{entrada.titulo}</strong> : entrada.titulo)}
</NavLink>
```

### useNavigate

Después de guardar, la pantalla deja el formulario y va al listado:

```tsx
onSuccess: () => navigate('/tipos-audiencia')
```

Es una navegación que depende de un resultado, no de un click en un link. Por eso es una función y no un `<Link>`.

### Layout y Outlet

`Layout` pinta el menú y, en el hueco, la ruta hija:

```tsx
function Layout() {
  return (
    <div>
      <Menu />
      <Outlet />
    </div>
  )
}
```

Al ir de Tipos de audiencia a Salas, el menú sigue montado y `Outlet` cambia de `TipoAudienciaList` a `Salas`. Las rutas hijas están en `children` del layout.

La ruta `*` usa `<Navigate to="/tipos-audiencia" replace />`. Cualquier hash desconocido termina en el listado. `replace` pisa la entrada del historial, así Atrás no vuelve a la ruta que no existía.

### Rutas protegidas

Una ruta protegida mira si hay sesión. Si no hay, muestra el login (o redirige) y no monta la pantalla.

Este proyecto no tiene login. En audiencias eso es `ProtectedRoute`: mientras Firebase responde muestra un spinner; sin usuario muestra `LoginPage`; con usuario muestra los `children`.

---

## 8. Zustand

Hay dos clases de estado, y este punto es el del cliente.

Los catálogos (fueros, organismos, roles, tipos de audiencia) vienen de la API y van en Query. Lo que la persona **eligió** para esta sesión (este fuero, este organismo, este rol) no es la respuesta del servidor: es un recorte que varias pantallas y el `apiClient` tienen que leer. Eso vive en `src/stores/contextoUsuario.ts`.

El store se crea una sola vez, afuera de cualquier componente. `create()` devuelve un hook. Quien lee, pasa un selector: `useContextoUsuario((s) => s.rol)` se vuelve a renderizar solo si cambia `rol`, no si cambia el nombre del fuero.

```ts
export const useContextoUsuario = create<ContextoUsuarioStore>()(
  persist(
    (set) => ({
      idFuero: null,
      // ...
      setContexto: (ctx) => set(ctx),
      limpiar: () => set({ idFuero: null, /* ... */ }),
    }),
    {
      name: 'parametros-contexto-usuario',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

`persist` guarda la elección en `localStorage` con esa clave. Recargar la pestaña conserva fuero, organismo y rol. Cerrar sesión llama a `limpiar()` para que el próximo usuario de la misma máquina no herede el contexto.

`ContextoUsuario` tiene **borrador** (tres `useState` del formulario) y **valor guardado** (el store). Los `<select>` no escriben el store en cada cambio: al cambiar el fuero se vacía el organismo, y recién Guardar llama a `setContexto`. Hasta que hay organismo y rol, `Layout` no monta el menú ni el `Outlet`.

Fuera de React, el store se lee con `getState()`. `apiClient` no es un componente, así que no puede usar el hook. Toma el rol así:

```ts
const rol = useContextoUsuario.getState().rol
```

y lo manda en `x-user-role`. El token sigue saliendo de Firebase, no del store.

En audiencias el mismo store está en `src/stores/contextoUsuario.ts`. El UI es un diálogo MUI (`ContextoUsuarioMenu`). La lista de tipos no está en un store: si dos pantallas la necesitan, comparten la `queryKey`.

---

## 9. Revisar código generado por IA

Lista para mirar un diff de este proyecto, o uno parecido, antes de darlo por bueno.

**Los hooks van todos arriba, en el mismo orden.** En `TipoAudienciaEdit`, `useParams`, `useNavigate`, `useTipoAudiencia` y `useActualizarTipoAudiencia` están antes de los `if`. Un hook debajo de un `return` es un error que a veces solo aparece al pasar de «cargando» a «listo».

**Cargar datos no pide un `useEffect`.** Si el efecto llama a `getAll`, guarda el resultado en `useState` y depende de un arreglo de dependencias, es el combo que Query ya resuelve. El síntoma típico es un efecto que se dispara de más, o que se olvida de refrescar después de un alta.

**El componente no llama a `fetch` ni a `getAll`.** Eso está en `src/data/`. El hook nombra la clave y la función. Un `fetch` suelto en el componente se saltea la caché: dos pantallas piden lo mismo y no se enteran una de la otra.

**La función de la query solo lee.** `getAll` copia el array y lo devuelve. Un alta dentro de `queryFn` se ejecutaría otra vez en desarrollo por StrictMode y dejaría dos registros, o saltaría `siguienteId`.

**El estado no se muta.** `updateOne` arma un objeto nuevo y una lista nueva. `actual.descripcion = descripcion` modificaría el objeto que la caché podría estar mostrando, y React no se entera de un cambio hecho por dentro.

**Después de crear, editar o borrar, se invalida la clave.** Sin `invalidateQueries`, el array en memoria cambia y el listado sigue mostrando la caché anterior hasta recargar.

**Las props están tipadas.** El formulario declara `titulo: string`, `inicial: string` y `onGuardar: (descripcion: string) => void`. `TipoAudiencia` en `data/` es la forma de un registro. `useParams()` tipea el id como `string | undefined`: por eso `useTipoAudiencia` acepta `string | undefined` y lleva `enabled: Boolean(id)`.

### DevTools

Las de React (Components) muestran el árbol, las props y el estado de cada componente. Ahí se ve `descripcion` cambiar con cada tecla.

Las de Query están en la página: botón abajo a la izquierda, `ReactQueryDevtools` en `main.tsx`. Ahí se ve la clave `['tipos-audiencia']`, el estado de la query y el refetch después de Guardar o Borrar.
