import { useQuery } from '@tanstack/react-query'
import { getAll } from '../data/fueros'
import { queryKeys } from '../lib/queryKeys'

export function useFueros() {
  return useQuery({
    queryKey: queryKeys.fueros.all,
    queryFn: getAll,
  })
}
