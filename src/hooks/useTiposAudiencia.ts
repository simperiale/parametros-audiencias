import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOne, deleteOne, getAll, getOne, updateOne } from '../data/tiposAudiencia'
import { queryKeys } from '../lib/queryKeys'

export function useTiposAudiencia(idFuero: string | null) {
  return useQuery({
    queryKey: queryKeys.tiposAudiencia.list(idFuero),
    queryFn: () => getAll(idFuero),
    enabled: Boolean(idFuero),
  })
}

export function useTipoAudiencia(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tiposAudiencia.detail(id ?? ''),
    queryFn: () => getOne(id as string),
    enabled: Boolean(id),
  })
}

function invalidarTipos(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.tiposAudiencia.all })
}

export function useCrearTipoAudiencia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ descripcion, idFuero }: { descripcion: string; idFuero: string }) =>
      createOne(descripcion, idFuero),
    onSuccess: () => invalidarTipos(queryClient),
  })
}

export function useActualizarTipoAudiencia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, descripcion }: { id: string; descripcion: string }) =>
      updateOne(id, descripcion),
    onSuccess: () => invalidarTipos(queryClient),
  })
}

export function useBorrarTipoAudiencia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => invalidarTipos(queryClient),
  })
}
