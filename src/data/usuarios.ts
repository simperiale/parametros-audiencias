import { api } from '../lib/apiClient'

export interface UsuarioRol {
  rol: string
  id_organismo: string
  casos_de_uso: string[]
}

export interface UsuarioConRoles {
  id: string
  email: string
  nombre: string
  apellido: string
  roles: UsuarioRol[]
}

export async function getUsuarioRol(): Promise<UsuarioConRoles> {
  return api.get<UsuarioConRoles>('/usuarios/usuario_rol')
}
