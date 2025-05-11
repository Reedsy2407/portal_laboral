import { Component, OnInit } from '@angular/core';
import { PostulacionService } from '../servicios/postulacion.service';
import { AuthService } from '../servicios/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-postulaciones',
  standalone: false,
  templateUrl: './postulaciones.component.html',
  styleUrl: './postulaciones.component.css'
})
export class PostulacionesComponent implements OnInit{
  postulaciones: any[] = [];
  estados = ['POSTULADO', 'SELECCIONADO', 'DESCARTADO', 'FINALIZADO'];
  cargando: boolean = true;

  constructor(
    private postulacionService: PostulacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarPostulaciones();
  }

  cargarPostulaciones(): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (usuarioId) {
      this.cargando = true;
      this.postulacionService.obtenerPostulacionesDelUsuario(usuarioId).subscribe({
        next: (data) => {
          this.postulaciones = data;
          this.cargando = false;
          if (this.postulaciones.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No hay postulaciones',
              text: 'No has realizado ninguna postulación aún',
              confirmButtonColor: '#3085d6'
            });
          }
        },
        error: (error) => {
          this.cargando = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar tus postulaciones',
            confirmButtonColor: '#3085d6'
          });
        }
      });
    } else {
      this.cargando = false;
      Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión para ver tus postulaciones',
        confirmButtonColor: '#3085d6'
      });
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