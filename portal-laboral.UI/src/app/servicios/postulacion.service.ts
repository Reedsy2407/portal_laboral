import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../environments/API';
import { Postulacion } from '../entidades/postulacion';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  request = "/postulacion";

  constructor(private http: HttpClient) {}

  obtenerPostulacionesDelUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API.url + this.request}/mis-postulaciones/${usuarioId}`);
  }
  

  postular(usuarioId: number, publicacionId: number): Observable<any> {
    const body = { usuarioId, publicacionId };
    return this.http.post(`${API.url + this.request}/crear`, body, { responseType: 'text' });
  }

  eliminarPostulacion(usuarioId: number, publicacionId: number): Observable<any> {
    return this.http.delete(`${API.url + this.request}/eliminar?usuarioId=${usuarioId}&publicacionId=${publicacionId}`);
  }

  obtenerPostulacionPorPublicacionId(idPublicacion: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${API.url + this.request}/por-publicacion/${idPublicacion}`);
  }
  
}
