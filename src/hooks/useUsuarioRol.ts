import { useQuery } from '@tanstack/react-query'
import { getUsuarioRol } from '../data/usuarios'
import { queryKeys } from '../lib/queryKeys'

export function useUsuarioRol() {
  return useQuery({
    queryKey: queryKeys.usuarioRol.all,
    queryFn: getUsuarioRol,
  })
}
