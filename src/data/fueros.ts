import { api } from '../lib/apiClient'

export interface Fuero {
  id: string
  nombre: string
}

export async function getAll(): Promise<Fuero[]> {
  const res = await api.get<{ count: number; data: Fuero[] }>('/fueros/?per_page=200')
  return res.data
}
