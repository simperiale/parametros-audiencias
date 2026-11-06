import { api } from '../lib/apiClient'

export interface Organismo {
  id: string
  descripcion: string
  descripcion_corta: string
  habilitado: boolean
  id_fuero?: string | null
}

export async function getAll(): Promise<Organismo[]> {
  const res = await api.get<{ count: number; data: Organismo[] }>('/organismos/?per_page=200')
  return res.data
}
