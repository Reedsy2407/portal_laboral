import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../entidades/LoginRequest';
import { API } from '../../environments/API';

@Injectable({ providedIn: 'root' })
export class AuthService {

  request = "/auth"

  constructor(private http: HttpClient) {}

  login(datos: LoginRequest) {
    return this.http.post<{ 
      token: string, 
      correo: string, 
      rol: { id: number, nombre: string }, 
      idUsuario: number 
    }>(`${API.url + this.request}/login`, datos);
  }
  

  register(usuario: any) {
    return this.http.post(`${API.url + this.request}/register`, usuario, { responseType: 'text' });
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('idRol');
    localStorage.removeItem('idUsuario');

  }

  guardarToken(token: string, idUsuario: number, idRol: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('idUsuario', idUsuario.toString());
    localStorage.setItem('idRol', idRol.toString());
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogueado(): boolean {
    return !!this.obtenerToken();
  }

  obtenerUsuarioId(): number | null {
    const id = localStorage.getItem('idUsuario');
    return id ? +id : null;
  }

  getIdRol(): number | null {
    const rolId = localStorage.getItem('idRol');
    return rolId ? parseInt(rolId) : null;
  }
}