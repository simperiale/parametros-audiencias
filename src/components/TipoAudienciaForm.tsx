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
      <h1>{titulo}</h1>
      <form onSubmit={guardar}>
        <label>
          Descripción{' '}
          <input value={descripcion} onChange={(event) => setDescripcion(event.target.value)} />
        </label>
        {error ? <p>{error}</p> : null}
        <p>
          <button type="submit">Guardar</button> <Link to="/tipos-audiencia">Volver</Link>
        </p>
      </form>
    </section>
  )
}
