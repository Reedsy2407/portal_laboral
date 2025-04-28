export interface Empresa {
    id?: number;
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
}
