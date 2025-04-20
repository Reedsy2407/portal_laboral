import { Contacto } from "./Contacto";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  fecha: Date;
  contacto: Contacto;
}
