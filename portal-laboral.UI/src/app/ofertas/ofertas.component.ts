import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../entidades/Publicacion';
import { PublicacionService } from '../servicios/publicacion.service';
import { PostulacionService } from '../servicios/postulacion.service';
import { AuthService } from '../servicios/auth.service';
import { EstadoPostulacion, Postulacion } from '../entidades/postulacion';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  // Datos principales
  listaOfertas: Publicacion[] = [];
  ofertasFiltradas: Publicacion[] = [];
  ofertaSeleccionada?: Publicacion;
  postulacionesUsuario: Postulacion[] = [];
  
  // Estados y carga
  isLoading = true;
  errorMessage = '';
  
  // Filtros y ordenación
  filtroForm: FormGroup;
  estadosPostulacion = [
    {value: 'TODAS', label: 'Todas las ofertas'},
    {value: 'POSTULADO', label: 'Postuladas'},
    {value: 'SELECCIONADO', label: 'Seleccionado'},
    {value: 'DESCARTADO', label: 'Descartadas'},
    {value: 'NO_POSTULADO', label: 'No postuladas'}
  ];
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;

  constructor(
    private publicacionService: PublicacionService,
    private postulacionService: PostulacionService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      busqueda: [''],
      estado: ['TODAS'],
      fechaDesde: [''],
      fechaHasta: [''],
      orden: ['fecha_desc'],
      sueldoMin: [''],
      sueldoMax: [''],
      modalidad: ['TODAS']
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    
    this.filtroForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.aplicarFiltros();
        this.currentPage = 1;
      });
  }

  cargarDatos(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.publicacionService.getPublicaciones().subscribe({
      next: (data) => {
        this.listaOfertas = data;
        this.ofertasFiltradas = [...this.listaOfertas];
        this.totalItems = this.ofertasFiltradas.length;
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
          estado: p.estado || EstadoPostulacion.POSTULADO
        }));
        this.isLoading = false;
        this.aplicarFiltros(); // Aplicar filtros después de cargar postulaciones
      },
      error: (err) => {
        console.error('Error al cargar postulaciones:', err);
        this.isLoading = false;
        this.errorMessage = 'Error al cargar tus postulaciones';
      }
    });
  }

  aplicarFiltros(): void {
    let resultados = [...this.listaOfertas];
    const filtros = this.filtroForm.value;

    // Filtro por texto de búsqueda
    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      resultados = resultados.filter(oferta => 
        oferta.titulo?.toLowerCase().includes(termino) ||
        oferta.empresa?.nombre?.toLowerCase().includes(termino) ||
        oferta.descripcion?.toLowerCase().includes(termino) ||
        oferta.lugar?.toLowerCase().includes(termino)
      );
    }

    // Filtro por estado de postulación
    if (filtros.estado !== 'TODAS') {
      resultados = resultados.filter(oferta => {
        if (filtros.estado === 'NO_POSTULADO') {
          return !this.estaPostulado(oferta.idPublicacion);
        } else {
          const postulacion = this.getPostulacion(oferta.idPublicacion);
          return postulacion?.estado === filtros.estado;
        }
      });
    }

    // Filtro por fecha
    if (filtros.fechaDesde) {
      const fechaDesde = new Date(filtros.fechaDesde);
      resultados = resultados.filter(oferta => 
        oferta.fecha && new Date(oferta.fecha) >= fechaDesde
      );
    }

    if (filtros.fechaHasta) {
      const fechaHasta = new Date(filtros.fechaHasta);
      resultados = resultados.filter(oferta => 
        oferta.fecha && new Date(oferta.fecha) <= fechaHasta
      );
    }

    // Filtro por sueldo
    if (filtros.sueldoMin) {
      resultados = resultados.filter(oferta => 
        oferta.sueldo && oferta.sueldo >= Number(filtros.sueldoMin)
      );
    }

    if (filtros.sueldoMax) {
      resultados = resultados.filter(oferta => 
        oferta.sueldo && oferta.sueldo <= Number(filtros.sueldoMax)
      );
    }

    // Filtro por modalidad
    if (filtros.modalidad !== 'TODAS') {
      resultados = resultados.filter(oferta => 
        oferta.modalidad === filtros.modalidad
      );
    }

    // Ordenación
    resultados = this.ordenarOfertas(resultados, filtros.orden);

    this.ofertasFiltradas = resultados;
    this.totalItems = resultados.length;
  }

  ordenarOfertas(ofertas: Publicacion[], orden: string): Publicacion[] {
    const copia = [...ofertas];
    switch (orden) {
      case 'fecha_desc':
        return copia.sort((a, b) => 
          (b.fecha ? new Date(b.fecha).getTime() : 0) - 
          (a.fecha ? new Date(a.fecha).getTime() : 0)
        );
      case 'fecha_asc':
        return copia.sort((a, b) => 
          (a.fecha ? new Date(a.fecha).getTime() : 0) - 
          (b.fecha ? new Date(b.fecha).getTime() : 0)
        );
      case 'sueldo_desc':
        return copia.sort((a, b) => (b.sueldo || 0) - (a.sueldo || 0));
      case 'sueldo_asc':
        return copia.sort((a, b) => (a.sueldo || 0) - (b.sueldo || 0));
      case 'titulo_asc':
        return copia.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
      case 'titulo_desc':
        return copia.sort((a, b) => (b.titulo || '').localeCompare(a.titulo || ''));
      default:
        return copia;
    }
  }

  // Métodos de paginación
  get paginatedOfertas(): Publicacion[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.ofertasFiltradas.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  pageChanged(page: number): void {
    this.currentPage = page;
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({
      busqueda: '',
      estado: 'TODAS',
      fechaDesde: '',
      fechaHasta: '',
      orden: 'fecha_desc',
      sueldoMin: '',
      sueldoMax: '',
      modalidad: 'TODAS'
    });
  }

  // Métodos existentes (postular, despostular, etc.)
  seleccionarOferta(oferta: Publicacion): void {
    this.ofertaSeleccionada = oferta;
    if (this.estaPostulado(oferta.idPublicacion!)) {
      this.getPostulacionesPorPublicacion(oferta.idPublicacion!);
    }
  }

  postular(oferta: Publicacion): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (usuarioId === null || !oferta.idPublicacion) return;
  
    this.postulacionService.postular(usuarioId, oferta.idPublicacion).subscribe({
      next: (postulacion) => {
        const nuevaPostulacion: Postulacion = {
          id: postulacion.id || 0,
          estado: postulacion.estado || EstadoPostulacion.POSTULADO,
          fecha: postulacion.fecha || new Date().toISOString(),
          usuario: { id: usuarioId },
          publicacion: {
            idPublicacion: oferta.idPublicacion,
            titulo: oferta.titulo,
            empresa: { nombre: oferta.empresa?.nombre || '' }
          }
        };
        this.postulacionesUsuario.push(nuevaPostulacion);
        this.aplicarFiltros(); // Reaplicar filtros para actualizar vista
      },
      error: (err) => console.error('Error al postular:', err)
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
        this.aplicarFiltros(); // Reaplicar filtros para actualizar vista
      },
      error: (err) => console.error('Error al despostular:', err)
    });
  }

  estaPostulado(idPublicacion: number | undefined): boolean {
    if (!idPublicacion) return false;
    return this.postulacionesUsuario.some(p => {
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

  getPostulacionesPorPublicacion(id: number): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (!usuarioId) return;

    this.postulacionService.obtenerPostulacionPorPublicacionId(id).subscribe({
      next: (postulaciones) => {
        if (postulaciones && Array.isArray(postulaciones)) {
          const postulacionUsuario = postulaciones.find(p => p.usuario.id === usuarioId);
          if (postulacionUsuario) {
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

  getBadgeClass(estado?: EstadoPostulacion | string): string {
    if (!estado) return 'bg-light text-dark';
    
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

  transformarFecha(fechaInput: any): Date | null {
    if (!fechaInput) return null;
    
    if (typeof fechaInput === 'string') {
      return new Date(fechaInput);
    }
    
    if (Array.isArray(fechaInput)) {
      const [year, month, day, hours, minutes, seconds, milliseconds] = fechaInput;
      return new Date(year, month - 1, day, hours, minutes, seconds, milliseconds / 1000000);
    }
    
    if (typeof fechaInput === 'number') {
      return new Date(fechaInput);
    }
    
    return null;
  }
}