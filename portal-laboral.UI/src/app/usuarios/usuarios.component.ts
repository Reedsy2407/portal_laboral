import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { Usuario } from '../entidades/Usuario';

@Component({
  standalone: false,
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    console.log("UsuariosComponent se ha cargado.");
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log("Datos JSON crudo:", JSON.stringify(data));
        console.log(`Usuarios cargados: ${data.length}`);
        this.usuarios = data;
      },
      error: (err) => console.error("Error al cargar usuarios:", err)
    });
    
  }}