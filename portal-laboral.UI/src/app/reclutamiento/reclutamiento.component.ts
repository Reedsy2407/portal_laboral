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
      .subscribe((usuario: Usuario) => {
        this.usuarioCoincidente = usuario;
        console.log(this.usuarioCoincidente);
        
        if (this.usuarioCoincidente.empresa?.id !== undefined) {
          this.idEmpresa = this.usuarioCoincidente.empresa.id;
          console.log(this.idEmpresa);
          this.cargarPublicaciones();
        }
      });
  }

  cambiarEstado(estado: boolean): void {
    this.show = estado;
    if (estado) {
      this.cargarPublicaciones();
    }
  }

  cargarPublicaciones(): void {
    if (!this.idEmpresa) return;
    
    this.publicacionService.getPublicacionesPorEmpresa(this.idEmpresa)
      .subscribe({
        next: (data: Publicacion[]) => {
          this.publicaciones = data;
        },
        error: (error) => {
          console.error('Error al cargar publicaciones:', error);
          alert('Error al cargar las publicaciones');
        }
      });
  }

  verPostulantes(publicacionId: number, publicacion: any) {
    this.publicacionSeleccionada = publicacion;
    this.postulacionService.obtenerPostulacionPorPublicacionId(publicacionId).subscribe({
      next: (data) => {
        console.log('Datos transformados:', data); // Para verificar
        this.postulantes = data;
        const modalElement = document.getElementById('postulantesModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (err) => {
        console.error('Error al obtener postulantes:', err);
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
        empresa: { id: this.idEmpresa }   // Enviar como objeto con id
      };
  
      this.publicacionService.crearPublicacion(nuevaPublicacion)
        .subscribe(
          () => {
            alert('Publicación creada con éxito');
            this.formAviso.reset();
            this.cambiarEstado(true);
          },
          error => {
            console.error('Error al crear publicación:', error);
            alert('Error al crear la publicación. Por favor verifica los datos.');
          }
        );
    } else if (!this.idEmpresa) {
      alert('No se pudo identificar la empresa asociada.');
    }
  }
  eliminarPublicacion(idPublicacion: number): void {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
      this.publicacionService.eliminarPublicacion(idPublicacion)
        .subscribe(
          () => {
            this.cargarPublicaciones(); // Recargar la lista después de eliminar
          },
          error => {
            console.error('Error al eliminar publicación:', error);
          }
        );
    }
  }

  // En tu componente
cambiarEstadoPostulacion(idPostulacion: number, nuevoEstado: string) { //AGREGAR CONDICIONAL VERIFICAR ID POSTULACION
  this.postulacionService.cambiarEstadoPostulacion(idPostulacion, nuevoEstado).subscribe({
    next: () => {
      // Actualizar el estado localmente
      const postulacion = this.postulantes.find(p => p.id === idPostulacion);
      if (postulacion) {
        postulacion.estado = nuevoEstado;
      }
      
      // Mostrar notificación (opcional)
      const mensaje = nuevoEstado === 'DESCARTADO' 
        ? 'Postulante descartado' 
        : 'Estado actualizado correctamente';
      alert(mensaje); // Puedes reemplazar esto con un toast de Angular
    },
    error: (err) => {
      console.error('Error al cambiar estado:', err);
      alert('Error al actualizar el estado');
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
}
