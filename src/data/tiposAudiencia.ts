export interface TipoAudiencia {
  id: string
  descripcion: string
}

let tipos: TipoAudiencia[] = [
  { id: '1', descripcion: 'Preliminar' },
  { id: '2', descripcion: 'De debate' },
  { id: '3', descripcion: 'Lectura de sentencia' },
]

let siguienteId = 4

export function getAll(): TipoAudiencia[] {
  return [...tipos]
}

export function getOne(id: string): TipoAudiencia | undefined {
  return tipos.find((tipo) => tipo.id === id)
}

export function createOne(descripcion: string): TipoAudiencia {
  const nuevo: TipoAudiencia = { id: String(siguienteId), descripcion }
  siguienteId += 1
  tipos = [...tipos, nuevo]
  return nuevo
}

export function updateOne(id: string, descripcion: string): TipoAudiencia | undefined {
  const actual = tipos.find((tipo) => tipo.id === id)
  if (!actual) {
    return undefined
  }
  const actualizado: TipoAudiencia = { ...actual, descripcion }
  tipos = tipos.map((tipo) => (tipo.id === id ? actualizado : tipo))
  return actualizado
}

export function deleteOne(id: string): void {
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
