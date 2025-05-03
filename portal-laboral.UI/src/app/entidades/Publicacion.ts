
import { Modalidad } from "./Modalidad";

export interface Publicacion {
    idPublicacion: number;
    empresa: {
      id: number;
      nombre: string;
      ruc: string;
      correo: string;
      direccion: string;
      descripcion: string;
      contacto: {
        telefono: string;
        sitioWeb: string;
        linkedin: string;
      };
    };
    titulo: string;
    lugar: string;
    sueldo: number;
    modalidad: string;
    descripcion: string;
    fecha: string | Date;
    estado: string;
  }