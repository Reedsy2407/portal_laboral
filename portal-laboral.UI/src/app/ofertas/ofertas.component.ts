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
  postulacionesUsuario: Postulacion[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private publicacionService: PublicacionService,
    private postulacionService: PostulacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.publicacionService.getPublicaciones().subscribe({
      next: (data) => {
        this.listaOfertas = data;
        this.cargarPostulaciones();
      },
      error: (err) => {
        console.error('Error al cargar ofertas:', err);
        this.isLoading = false;
        this.errorMessage = 'Error al cargar las ofertas';
      }
    });
  }

  cargarPostulaciones(): void {
    const usuarioId = this.authService.obtenerUsuarioId(); 
    if (!usuarioId) {
      this.isLoading = false;
      return;
    }
    
    this.postulacionService.obtenerPostulacionesDelUsuario(usuarioId).subscribe({
      next: (postulaciones) => {
        this.postulacionesUsuario = postulaciones.map(p => ({
          ...p,
          estado: p.estado || 'POSTULADO'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar postulaciones:', err);
        this.isLoading = false;
        this.errorMessage = 'Error al cargar tus postulaciones';
      }
    });
  }



  getBadgeClass(estado?: EstadoPostulacion | string): string {
    if (!estado) return 'bg-light text-dark';
    
    // Convert to string if it's an enum value
    const estadoStr = typeof estado === 'string' ? estado : EstadoPostulacion[estado];
    
    switch (estadoStr) {
      case 'POSTULADO': return 'bg-primary';
      case 'EN_REVISION': return 'bg-info';
      case 'SELECCIONADO': return 'bg-success';
      case 'DESCARTADO': return 'bg-danger';
      case 'FINALIZADO': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
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
    return this.postulacionesUsuario.some(p => 
      p.publicacion === id && p.estado !== 'DESCARTADO'
    );
  }

  getPostulacion(idPublicacion: number): Postulacion | undefined {
    return this.postulacionesUsuario.find(p => p.publicacion === idPublicacion);
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

  actualizarEstadoPostulacion(idPublicacion: number, nuevoEstado: string): void {
    const index = this.postulacionesUsuario.findIndex(p => p.publicacion === idPublicacion);
    if (index !== -1) {
      // Convierte el string al enum correspondiente
      this.postulacionesUsuario[index].estado = this.convertirStringAEstado(nuevoEstado);
    }
  }

private convertirStringAEstado(estadoString: string): EstadoPostulacion {
  // Convierte el string al enum de manera segura
  const estado = EstadoPostulacion[estadoString as keyof typeof EstadoPostulacion];
  return estado || EstadoPostulacion.POSTULADO; // Valor por defecto si la conversión falla
}
}