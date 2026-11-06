import { api } from '../lib/apiClient'

export interface TipoAudiencia {
  id: string
  descripcion: string
  duracion_default: number | null
  descanso_minutos_default: number | null
  bloqueable: boolean
  habilitado: boolean
}

let tipos: TipoAudiencia[] = []

export async function getAll(idFuero?: string | null): Promise<TipoAudiencia[]> {
  const params = new URLSearchParams()
  params.set('per_page', '200')
  if (idFuero) {
    params.set('id_fuero', idFuero)
  }
  const res = await api.get<{ count: number; data: TipoAudiencia[] }>(
    `/tipos-audiencia/?${params.toString()}`,
  )
  return res.data
}

export async function getOne(id: string): Promise<TipoAudiencia> {
  const tipo = (await getAll()).find((item) => item.id === id)
  if (!tipo) {
    throw new Error('No existe ese tipo de audiencia.')
  }
  return tipo
}

export async function createOne(descripcion: string, idFuero: string): Promise<TipoAudiencia> {
  return api.post<TipoAudiencia>('/tipos-audiencia/', {
    descripcion,
    bloqueable: true,
    descanso_minutos_default: 0,
    duracion_default: 0,
    habilitado: true,
    id_fuero: idFuero,
  })
}

export async function updateOne(id: string, descripcion: string): Promise<TipoAudiencia> {
  const actual = tipos.find((tipo) => tipo.id === id)
  if (!actual) {
    throw new Error('No existe ese tipo de audiencia.')
  }
  const actualizado: TipoAudiencia = { ...actual, descripcion }
  tipos = tipos.map((tipo) => (tipo.id === id ? actualizado : tipo))
  return actualizado
}

export async function deleteOne(id: string): Promise<void> {
  tipos = tipos.filter((tipo) => tipo.id !== id)
}

export function validate(descripcion: string): {
  issues: { message: string; path: ['descripcion'] }[]
} {
  const issues: { message: string; path: ['descripcion'] }[] = []
  if (!descripcion.trim()) {
    issues.push({ message: 'La descripción es requerida', path: ['descripcion'] })
  }
  return { issues }
}
