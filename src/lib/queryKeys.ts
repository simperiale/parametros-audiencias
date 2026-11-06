export const queryKeys = {
  tiposAudiencia: {
    all: ['tipos-audiencia'] as const,
    list: (idFuero: string | null) => ['tipos-audiencia', { idFuero }] as const,
    detail: (id: string) => ['tipos-audiencia', id] as const,
  },
  fueros: {
    all: ['fueros'] as const,
  },
  organismos: {
    all: ['organismos'] as const,
  },
  salas: {
    all: ['salas'] as const,
    list: (idFuero: string | null) => ['salas', { idFuero }] as const,
  },
  usuarioRol: {
    all: ['usuario-rol'] as const,
  },
}
