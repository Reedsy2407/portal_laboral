import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../entidades/Publicacion';
import { PublicacionService } from '../servicios/publicacion.service';
import { PostulacionService } from '../servicios/postulacion.service';
import { AuthService } from '../servicios/auth.service';
import { EstadoPostulacion, Postulacion } from '../entidades/postulacion';

@Component({
  selector: 'app-ofertas',
  standalone: false,
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  listaOfertas: Publicacion[] = [];
  ofertaSeleccionada?: Publicacion;
  postulacionesUsuario: Postulacion[] = []; // Ahora almacenamos objetos completos

  constructor(
    private publicacionService: PublicacionService,
    private postulacionService: PostulacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarOfertas();
    this.cargarPostulaciones();
  }

  cargarOfertas(): void {
    this.publicacionService.getPublicaciones().subscribe(data => {
      this.listaOfertas = data;
    });
  }

  cargarPostulaciones(): void {
    const usuarioId = this.authService.obtenerUsuarioId(); 
    if (usuarioId === null) return;
    
    this.postulacionService.obtenerPostulacionesDelUsuario(usuarioId).subscribe(postulaciones => {
      this.postulacionesUsuario = postulaciones;
    });
  }

  seleccionarOferta(oferta: Publicacion): void {
    this.ofertaSeleccionada = oferta;
    // Opcional: cargar detalles específicos de la postulación
    if (this.estaPostulado(oferta.idPublicacion!)) {
      this.getPostulacionesPorPublicacion(oferta.idPublicacion!);
    }
  }

  postular(oferta: Publicacion): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (usuarioId === null) return;

    this.postulacionService.postular(usuarioId, oferta.idPublicacion!).subscribe(() => {
      // Crear una postulación básica localmente
      const nuevaPostulacion: Postulacion = {
        id: 0,
        estado: EstadoPostulacion.POSTULADO,
        fechaPostulacion: new Date().toISOString(),
        usuario: usuarioId,
        publicacion: oferta.idPublicacion!
      };
      this.postulacionesUsuario.push(nuevaPostulacion);
    });
  }

  despostular(oferta: Publicacion): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (usuarioId === null) return;
    
    this.postulacionService.eliminarPostulacion(usuarioId, oferta.idPublicacion!).subscribe(() => {
      this.postulacionesUsuario = this.postulacionesUsuario.filter(
        p => p.publicacion !== oferta.idPublicacion

      );
    });
  }

  estaPostulado(id: number): boolean {
    return this.postulacionesUsuario.some(p => p.publicacion === id);
  }

  getPostulacion(idPublicacion: number): Postulacion | undefined {
    return this.postulacionesUsuario.find(p => p.publicacion === idPublicacion);
  }

  getBadgeClass(estado?: string): string {
    switch (estado) {
      case 'POSTULADO': return 'bg-primary';
      case 'EN_REVISION': return 'bg-info';
      case 'SELECCIONADO': return 'bg-success';
      case 'DESCARTADO': return 'bg-danger';
      case 'FINALIZADO': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  }

  getPostulacionesPorPublicacion(id: number): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (!usuarioId) return;

    this.postulacionService.obtenerPostulacionPorPublicacionId(id).subscribe({
      next: (postulaciones) => {
        if (postulaciones && Array.isArray(postulaciones)) {
          const postulacionUsuario = postulaciones.find(p => p.usuario === usuarioId);
          if (postulacionUsuario) {
            // Actualizar la postulación en el array local
            const index = this.postulacionesUsuario.findIndex(
              p => p.publicacion === id
            );
            if (index !== -1) {
              this.postulacionesUsuario[index] = postulacionUsuario;
            }
          }
        }
      },
      error: (error) => console.error('Error al obtener postulaciones:', error)
    });
  }
}