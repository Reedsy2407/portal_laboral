import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publicacion } from '../entidades/Publicacion';
import { API } from '../../environments/API';
@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  request: string = "/publicacion";
  constructor(private http: HttpClient) { }

  getPublicaciones(): Observable<Publicacion[]>{
    return this.http.get<Publicacion[]>(`${API.url + this.request}/listar`)
  }

  crearPublicacion(publicacion: Publicacion): Observable<Publicacion>{
    return this.http.post<Publicacion>(`${API.url + this.request}/guardar`, publicacion);
  }
}
