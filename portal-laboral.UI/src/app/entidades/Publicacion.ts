
import { Modalidad } from "./Modalidad";

export interface Publicacion{
    idPublicacion: number
    empresa: number
    titulo: string
    lugar: string
    sueldo: number
    modalidad:{
        id: number
    }
    descripcion: string
    fecha?: Date
}