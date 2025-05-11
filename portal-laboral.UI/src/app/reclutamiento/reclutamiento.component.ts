import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionService } from '../servicios/publicacion.service';
import { Publicacion } from '../entidades/Publicacion';
import { UsuarioService } from '../servicios/usuario.service';
import { EmpresaService } from '../servicios/empresa.service';
import { AuthService } from '../servicios/auth.service';
import { Usuario } from '../entidades/Usuario';
import { PostulacionService } from '../servicios/postulacion.service';
import { Empresa } from '../entidades/Empresa';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

declare var bootstrap: any; 

@Component({
  selector: 'app-reclutamiento',
  standalone: false,
  templateUrl: './reclutamiento.component.html',
  styleUrl: './reclutamiento.component.css'
})
export class ReclutamientoComponent implements OnInit{
  show: boolean = true;
  formAviso: FormGroup;
  publicaciones: Publicacion[] = [];
  idEmpresa: number = 0;
  usuarioCoincidente!: Usuario;
  publicacionSeleccionada: any;
  postulantes: any[] = [];
  mostrandoEliminadas: boolean = false;
  constructor(
    private fb: FormBuilder,
    private publicacionService: PublicacionService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private postulacionService: PostulacionService
  ) {
    this.formAviso = this.fb.group({
      titulo: ['', Validators.required],
      publicacion: ['', Validators.required],
      lugar: ['', Validators.required],
      sueldo: ['', [Validators.required, Validators.min(0)]],
      modalidad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.usuarioService.buscarPorId(Number(this.authService.obtenerUsuarioId()))
      .subscribe({
        next: (usuario: Usuario) => {
          this.usuarioCoincidente = usuario;
          
          if (this.usuarioCoincidente.empresa?.id !== undefined) {
            this.idEmpresa = this.usuarioCoincidente.empresa.id;
            this.cargarPublicaciones();
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar la información del usuario',
            confirmButtonColor: '#3085d6'
          });
        }
      });
  }
  cambiarEstado(estado: boolean): void {
    this.show = estado;
    this.mostrandoEliminadas = false;
    if (estado) {
      this.cargarPublicaciones();
    }
  }
  cargarPublicaciones(): void {
    if (!this.idEmpresa) return;
  
    this.publicacionService.getPublicacionesPorEmpresa(this.idEmpresa)
      .subscribe({
        next: (data: Publicacion[]) => {
          // Filtrar solo las publicaciones creadas (no eliminadas)
          this.publicaciones = data.filter(pub => pub.estado === 'creado');
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar las publicaciones',
            confirmButtonColor: '#3085d6'
          });
        }
      });
  }

  verPostulantes(publicacionId: number, publicacion: any) {
    this.publicacionSeleccionada = publicacion;
    this.postulacionService.obtenerPostulacionPorPublicacionId(publicacionId).subscribe({
      next: (data) => {
        this.postulantes = data;
        const modalElement = document.getElementById('postulantesModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los postulantes',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  crear(): void {
    if (this.formAviso.valid && this.idEmpresa) {
      const nuevaPublicacion: any = {
        titulo: this.formAviso.value.titulo,
        descripcion: this.formAviso.value.publicacion,
        lugar: this.formAviso.value.lugar,
        sueldo: this.formAviso.value.sueldo,
        modalidad: this.formAviso.value.modalidad,
        empresa: { id: this.idEmpresa }
      };

      this.publicacionService.crearPublicacion(nuevaPublicacion)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Publicación creada con éxito',
              confirmButtonColor: '#3085d6'
            });
            this.formAviso.reset();
            this.cambiarEstado(true);
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al crear la publicación. Por favor verifica los datos.',
              confirmButtonColor: '#3085d6'
            });
          }
        });
    } else if (!this.idEmpresa) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'No se pudo identificar la empresa asociada.',
        confirmButtonColor: '#3085d6'
      });
    }
  }
  eliminarPublicacion(idPublicacion: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicacionService.eliminarPublicacion(idPublicacion)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'La publicación ha sido eliminada',
                confirmButtonColor: '#3085d6'
              });
              // Actualizar el estado localmente sin recargar
              const pubIndex = this.publicaciones.findIndex(p => p.idPublicacion === idPublicacion);
              if (pubIndex !== -1) {
                this.publicaciones[pubIndex].estado = 'eliminado';
              }
            
            },
            error: (error) => {
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'La publicación ha sido eliminada',
                confirmButtonColor: '#3085d6'
              });
            }
          });
      }
    });
  }
  // En tu componente
  cambiarEstadoPostulacion(idPostulacion: number, nuevoEstado: string) {
    this.postulacionService.cambiarEstadoPostulacion(idPostulacion, nuevoEstado).subscribe({
      next: () => {
        const postulacion = this.postulantes.find(p => p.id === idPostulacion);
        if (postulacion) {
          postulacion.estado = nuevoEstado;
        }

        const mensaje = nuevoEstado === 'DESCARTADO' 
          ? 'Postulante descartado' 
          : 'Estado actualizado correctamente';
        
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: mensaje,
          confirmButtonColor: '#3085d6',
          timer: 1500
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el estado',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  getSiguienteEstado(estadoActual: string): string {
    switch(estadoActual) {
      case 'POSTULADO': return 'SELECCIONADO';
      case 'SELECCIONADO': return 'FINALIZADO';
      default: return estadoActual;
    }
  }

  descargarCVPostulante(idUsuario: number, nombreArchivo?: string): void {
    if (!idUsuario) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo identificar al usuario',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    this.usuarioService.downloadCv(idUsuario).subscribe({
      next: (blob) => {
        const filename = nombreArchivo || 'cv.pdf';
        saveAs(blob, filename);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo descargar el CV: ' + (err.error?.message || err.message),
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  mostrarEliminadas(): void {
    if (!this.idEmpresa) return;
  
    this.mostrandoEliminadas = true;
    
    this.publicacionService.getPublicacionesPorEmpresa(this.idEmpresa)
      .subscribe({
        next: (data: Publicacion[]) => {
          this.publicaciones = data.filter(pub => pub.estado === 'eliminado');
          this.show = true;
          
          if (this.publicaciones.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Información',
              text: 'No tienes publicaciones eliminadas',
              confirmButtonColor: '#3085d6'
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar las publicaciones eliminadas',
            confirmButtonColor: '#3085d6'
          });
        }
      });
  }
}
