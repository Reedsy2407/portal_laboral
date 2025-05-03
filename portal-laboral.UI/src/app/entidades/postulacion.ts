export interface Postulacion {
  id: number;
  estado: EstadoPostulacion;
  fecha: string | Date | number[];
  usuario: {
    id: number;
    nombre?: string;
    // otras propiedades opcionales
  };
  publicacion: {
    idPublicacion: number;
    titulo?: string;
    empresa?: {
      nombre?: string;
    };
    // otras propiedades opcionales
  };
}

export enum EstadoPostulacion {
  POSTULADO = 'POSTULADO',
  EN_REVISION = 'EN_REVISION',
  SELECCIONADO = 'SELECCIONADO',
  DESCARTADO = 'DESCARTADO',
  FINALIZADO = 'FINALIZADO'
}