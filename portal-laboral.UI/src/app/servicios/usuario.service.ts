import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../entidades/Usuario';
import { API } from '../../environments/API';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private request: string = "/usuario";

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API.url}${this.request}/listar`);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${API.url}${this.request}/buscar/${id}`);
  }
}
