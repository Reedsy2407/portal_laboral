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
  estados = ['POSTULADO', 'SELECCIONADO', 'DESCARTADO', 'FINALIZADO'];

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
          console.log('Postulaciones recibidas:', this.postulaciones);

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

  parseFecha(fechaArray: number[]): Date {
    return new Date(
      fechaArray[0], // año
      fechaArray[1] - 1, // mes (0-based)
      fechaArray[2], // día
      fechaArray[3], // horas
      fechaArray[4], // minutos
      fechaArray[5], // segundos
      fechaArray[6] / 1000000 // milisegundos
    );
  }
}
