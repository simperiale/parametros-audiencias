import { useQuery } from '@tanstack/react-query'
import { getAll } from '../data/organismos'
import { queryKeys } from '../lib/queryKeys'

export function useOrganismos() {
  return useQuery({
    queryKey: queryKeys.organismos.all,
    queryFn: getAll,
  })
}
