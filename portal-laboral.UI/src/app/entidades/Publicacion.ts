import { Empresa } from "./Empresa";
import { Modalidad } from "./Modalidad";

export interface Publicacion{
    idPublicacion: number;
    empresa: Empresa;
    titulo: string;
    lugar: string;
    sueldo: number;
    modalidad: Modalidad;
    descripcion: string;
    fecha: Date;
}