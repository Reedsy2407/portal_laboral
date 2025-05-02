import { Component, OnInit } from '@angular/core';
import { PostulacionService } from '../servicios/postulacion.service';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-postulaciones',
  standalone: false,
  templateUrl: './postulaciones.component.html',
  styleUrl: './postulaciones.component.css'
})
export class PostulacionesComponent implements OnInit{
  postulaciones: any[] = [];
  estados = ['POSTULADO', 'EN_REVISION', 'SELECCIONADO', 'DESCARTADO', 'FINALIZADO'];

  constructor(
    private postulacionService: PostulacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (usuarioId) {
      this.postulacionService.obtenerPostulacionesDelUsuario(usuarioId).subscribe(
        (data) => {
          this.postulaciones = data;
        }
      );
    }
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'POSTULADO':
        return 'bg-primary';
      case 'EN_REVISION':
        return 'bg-info';
      case 'SELECCIONADO':
        return 'bg-success';
      case 'DESCARTADO':
        return 'bg-danger';
      case 'FINALIZADO':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  }
}
