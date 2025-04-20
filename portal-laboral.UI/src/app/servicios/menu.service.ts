import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../../environments/API';
import { Menu } from '../entidades/Menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private request: string = "/menu";


  constructor(private http: HttpClient) { }

  listarMenuPorRol(idRol: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${API.url + this.request}/listarMenu/${idRol}`);
  }
}
