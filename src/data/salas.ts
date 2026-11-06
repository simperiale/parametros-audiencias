import { api } from '../lib/apiClient'

export interface Sala {
  id: string
  nombre: string
  capacidad: number | null
  id_organismo: string | null
  id_tipo_sala: string | null
}

export async function getAll(idFuero?: string | null): Promise<Sala[]> {
  const params = new URLSearchParams()
  params.set('per_page', '200')
  if (idFuero) {
    params.set('id_fuero', idFuero)
  }
  const res = await api.get<{ count: number; data: Sala[] }>(`/salas/?${params.toString()}`)
  return res.data
}
