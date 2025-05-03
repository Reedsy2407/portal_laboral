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
        // Asegurarse de que todas las postulaciones tengan estado
        this.postulacionesUsuario = postulaciones.map(p => ({
          ...p,
          estado: p.estado || EstadoPostulacion.POSTULADO
        }));
        
        // Verificar que las postulaciones se están cargando correctamente
        console.log('Postulaciones cargadas:', this.postulacionesUsuario);
        
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
    if (usuarioId === null || !oferta.idPublicacion) return;
  
    this.postulacionService.postular(usuarioId, oferta.idPublicacion).subscribe({
      next: (postulacion) => {
        // Crear una postulación completa localmente si el backend no devuelve toda la estructura
        const nuevaPostulacion: Postulacion = {
          id: postulacion.id || 0,
          estado: postulacion.estado || EstadoPostulacion.POSTULADO,
          fecha: postulacion.fecha || new Date().toISOString(),
          usuario: {
            id: usuarioId
            // Agrega otras propiedades si son necesarias
          },
          publicacion: {
            idPublicacion: oferta.idPublicacion,
            // Agrega otras propiedades mínimas necesarias
            titulo: oferta.titulo,
            empresa: {
              nombre: oferta.empresa?.nombre || ''
            }
          }
        };
        this.postulacionesUsuario.push(nuevaPostulacion);
      },
      error: (err) => {
        console.error('Error al postular:', err);
      }
    });
  }
  despostular(oferta: Publicacion): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (usuarioId === null) return;
    
    this.postulacionService.eliminarPostulacion(usuarioId, oferta.idPublicacion!).subscribe({
      next: () => {
        this.postulacionesUsuario = this.postulacionesUsuario.filter(
          p => p.publicacion.idPublicacion !== oferta.idPublicacion
        );
      },
      error: (err) => {
        console.error('Error al despostular:', err);
      }
    });
  }

  estaPostulado(idPublicacion: number | undefined): boolean {
    if (!idPublicacion) return false;
    return this.postulacionesUsuario.some(p => {
      // Maneja tanto postulaciones completas como parciales
      const publicacionId = typeof p.publicacion === 'object' ? 
                           p.publicacion.idPublicacion : 
                           (p.publicacion as unknown as number);
      return publicacionId === idPublicacion;
    });
  }

  getPostulacion(idPublicacion: number | undefined): Postulacion | undefined {
    if (!idPublicacion) return undefined;
    return this.postulacionesUsuario.find(p => {
      const publicacionId = typeof p.publicacion === 'object' ? 
                           p.publicacion.idPublicacion : 
                           (p.publicacion as unknown as number);
      return publicacionId === idPublicacion;
    });
  }
// Actualizar el método obtenerPostulacionesPorPublicacion
getPostulacionesPorPublicacion(id: number): void {
  const usuarioId = this.authService.obtenerUsuarioId();
  if (!usuarioId) return;

  this.postulacionService.obtenerPostulacionPorPublicacionId(id).subscribe({
    next: (postulaciones) => {
      if (postulaciones && Array.isArray(postulaciones)) {
        const postulacionUsuario = postulaciones.find(p => 
          p.usuario.id === usuarioId
        );
        if (postulacionUsuario) {
          // Actualizar la postulación en el array local
          const index = this.postulacionesUsuario.findIndex(
            p => p.publicacion.idPublicacion === id
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
    const index = this.postulacionesUsuario.findIndex(p => p.publicacion.idPublicacion === idPublicacion);
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

transformarFecha(fechaInput: any): Date | null {
  if (!fechaInput) return null;
  
  // Si ya es un string de fecha ISO
  if (typeof fechaInput === 'string') {
    return new Date(fechaInput);
  }
  
  // Si es un array [año, mes, día, ...]
  if (Array.isArray(fechaInput)) {
    // Los meses en JavaScript son 0-indexed (0=Enero, 1=Febrero, etc.)
    const [year, month, day, hours, minutes, seconds, milliseconds] = fechaInput;
    return new Date(year, month - 1, day, hours, minutes, seconds, milliseconds / 1000000);
  }
  
  // Si es un timestamp numérico
  if (typeof fechaInput === 'number') {
    return new Date(fechaInput);
  }
  
  return null;
}
}