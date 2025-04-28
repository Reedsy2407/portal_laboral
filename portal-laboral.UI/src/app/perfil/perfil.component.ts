import { Component } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  usuario: Usuario | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (!idUsuario) {
      this.error = 'No se encontró el ID de usuario en el almacenamiento local';
      this.loading = false;
      return;
    }

    this.usuarioService.buscarPorId(parseInt(idUsuario)).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos del usuario';
        this.loading = false;
        console.error('Error al obtener usuario:', err);
      }
    });
  }
}
