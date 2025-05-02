import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API } from '../../environments/API';
import { Postulacion } from '../entidades/postulacion';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  request = "/postulacion";

  constructor(private http: HttpClient) {}

  obtenerPostulacionesDelUsuario(usuarioId: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${API.url + this.request}/mis-postulaciones/${usuarioId}`).pipe(
      map(postulaciones => postulaciones.map(p => ({
        ...p,
        estado: p.estado || 'POSTULADO' // Valor por defecto
      }))
    ));
  }

  postular(usuarioId: number, publicacionId: number): Observable<any> {
    const body = { usuarioId, publicacionId };
    return this.http.post(`${API.url + this.request}/crear`, body, { responseType: 'text' });
  }

  eliminarPostulacion(usuarioId: number, publicacionId: number): Observable<any> {
    return this.http.delete(`${API.url + this.request}/eliminar?usuarioId=${usuarioId}&publicacionId=${publicacionId}`);
  }

  obtenerPostulacionPorPublicacionId(idPublicacion: number): Observable<any[]> {
    return this.http.get<any[]>(`${API.url + this.request}/por-publicacion/${idPublicacion}`).pipe(
      map((postulaciones: any[]) => postulaciones.map(p => ({
        ...p,
        fecha: this.convertirFecha(p.fecha),
        usuario: {
          ...p.usuario,
          email: p.usuario.correo, // Mapeamos correo a emailasdasdasd
          telefono: p.usuario.contacto?.telefono
        }
      })))
    );
  }
  
  private convertirFecha(fechaArray: any[]): Date {
    if (!fechaArray || fechaArray.length < 7) return new Date();
    return new Date(
      fechaArray[0], // año
      fechaArray[1] - 1, // mes (0-indexado)
      fechaArray[2], // día
      fechaArray[3], // horas
      fechaArray[4], // minutos
      fechaArray[5], // segundos
      fechaArray[6] / 1000000 // milisegundos
    );
  }
  cambiarEstadoPostulacion(idPostulacion: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${API.url + this.request}/cambiar-estado/${idPostulacion}`, {
      estado: nuevoEstado
    });
  }
}
