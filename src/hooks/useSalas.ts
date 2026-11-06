import { useQuery } from '@tanstack/react-query'
import { getAll } from '../data/salas'
import { queryKeys } from '../lib/queryKeys'

export function useSalas(idFuero: string | null) {
  return useQuery({
    queryKey: queryKeys.salas.list(idFuero),
    queryFn: () => getAll(idFuero),
    enabled: Boolean(idFuero),
  })
}
