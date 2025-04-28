import { Empresa } from "./Empresa"

export interface Usuario {
  id?: number
  nombre: string
  apellido: string
  correo: string
  password: string
  fecha: Date
  contacto: {
    telefono: string
    sitioWeb: string
    linkedin: string
  }
  empresa: Empresa
}
