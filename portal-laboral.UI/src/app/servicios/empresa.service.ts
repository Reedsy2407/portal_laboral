import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empresa } from '../entidades/Empresa';
import { Observable } from 'rxjs';
import { API } from '../../environments/API';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  request = "/empresa";

  constructor(private http: HttpClient) { }

  guardarEmpresa(empresa: Empresa): Observable<Empresa>{
    return this.http.post<Empresa>(`${API.url + this.request}/guardar`, empresa)
  }

  listarEmpresa(): Observable<Empresa[]>{
    return this.http.get<Empresa[]>(`${API.url + this.request}/listar`);
  }
}
