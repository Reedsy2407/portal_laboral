import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private API = 'http://localhost:8080/postulacion';

  constructor(private http: HttpClient) {}

  obtenerPostulacionesDelUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/mis-postulaciones/${usuarioId}`);
  }
  

  postular(usuarioId: number, publicacionId: number): Observable<any> {
    const body = { usuarioId, publicacionId };
    return this.http.post(`${this.API}/crear`, body, { responseType: 'text' });

  }

  eliminarPostulacion(usuarioId: number, publicacionId: number): Observable<any> {
    return this.http.delete(`${this.API}/eliminar?usuarioId=${usuarioId}&publicacionId=${publicacionId}`);
  }
}
