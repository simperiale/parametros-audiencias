import { Link, useNavigate, useParams } from 'react-router'
import { getOne, updateOne } from '../data/tiposAudiencia'
import TipoAudienciaForm from './TipoAudienciaForm'

export default function TipoAudienciaEdit() {
  const { tipoAudienciaId } = useParams()
  const navigate = useNavigate()
  const tipo = tipoAudienciaId ? getOne(tipoAudienciaId) : undefined

  if (!tipo) {
    return (
      <section>
        <h1>Modificar tipo de audiencia</h1>
        <p>No existe ese tipo de audiencia.</p>
        <Link to="/tipos-audiencia">Volver</Link>
      </section>
    )
  }

  return (
    <TipoAudienciaForm
      key={tipo.id}
      titulo="Modificar tipo de audiencia"
      inicial={tipo.descripcion}
      onGuardar={(descripcion) => {
        updateOne(tipo.id, descripcion)
        navigate('/tipos-audiencia')
      }}
    />
  )
}
