import { useNavigate } from 'react-router'
import { createOne } from '../data/tiposAudiencia'
import TipoAudienciaForm from './TipoAudienciaForm'

export default function TipoAudienciaCreate() {
  const navigate = useNavigate()

  return (
    <TipoAudienciaForm
      titulo="Nuevo tipo de audiencia"
      inicial=""
      onGuardar={(descripcion) => {
        createOne(descripcion)
        navigate('/tipos-audiencia')
      }}
    />
  )
}
