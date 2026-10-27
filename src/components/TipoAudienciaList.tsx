import { useState } from 'react'
import { Link } from 'react-router'
import { deleteOne, getAll, type TipoAudiencia } from '../data/tiposAudiencia'

export default function TipoAudienciaList() {
  const [tipos, setTipos] = useState<TipoAudiencia[]>(() => getAll())

  function borrar(id: string) {
    deleteOne(id)
    setTipos(getAll())
  }

  return (
    <section>
      <h1>Tipos de audiencia</h1>
      <p>
        <Link to="/tipos-audiencia/new">Agregar</Link>
      </p>
      {tipos.length === 0 ? (
        <p>No hay tipos.</p>
      ) : (
        <ul>
          {tipos.map((tipo) => (
            <li key={tipo.id}>
              {tipo.descripcion} <Link to={`/tipos-audiencia/${tipo.id}/edit`}>Modificar</Link>{' '}
              <button type="button" onClick={() => borrar(tipo.id)}>
                Borrar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
