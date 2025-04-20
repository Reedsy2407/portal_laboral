import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../environments/API';
import { Rol } from '../entidades/Rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private request: string = "/rol";

  constructor(private http: HttpClient) {}

  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<any[]>(`${API.url + this.request}/listar`);
  }


}
