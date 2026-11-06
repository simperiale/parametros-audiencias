import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ContextoUsuarioStore {
  idFuero: string | null
  nombreFuero: string | null
  idOrganismo: string | null
  nombreOrganismo: string | null
  rol: string | null
  setContexto: (ctx: {
    idFuero: string
    nombreFuero: string
    idOrganismo: string
    nombreOrganismo: string
    rol: string
  }) => void
  limpiar: () => void
}

export const useContextoUsuario = create<ContextoUsuarioStore>()(
  persist(
    (set) => ({
      idFuero: null,
      nombreFuero: null,
      idOrganismo: null,
      nombreOrganismo: null,
      rol: null,
      setContexto: (ctx) => set(ctx),
      limpiar: () =>
        set({
          idFuero: null,
          nombreFuero: null,
          idOrganismo: null,
          nombreOrganismo: null,
          rol: null,
        }),
    }),
    {
      name: 'parametros-contexto-usuario',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
