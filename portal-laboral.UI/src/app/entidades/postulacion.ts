import { Publicacion } from "./Publicacion";
import { Usuario } from "./Usuario";

export interface Postulacion {
    id: number;
    estado: string;
    fechaPostulacion: string; // Usamos string porque se serializa desde JSON
    usuario: number;
    publicacion: number;
  }

export enum EstadoPostulacion {
    POSTULADO = 'POSTULADO',
    EN_REVISION = 'EN_REVISION',
    SELECCIONADO = 'SELECCIONADO',
    DESCARTADO = 'DESCARTADO',
    FINALIZADO = 'FINALIZADO'
  }