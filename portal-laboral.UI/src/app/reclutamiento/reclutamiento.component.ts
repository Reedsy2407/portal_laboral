import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionService } from '../servicios/publicacion.service';
import { Publicacion } from '../entidades/Publicacion';
import { UsuarioService } from '../servicios/usuario.service';
import { EmpresaService } from '../servicios/empresa.service';
import { AuthService } from '../servicios/auth.service';
import { Usuario } from '../entidades/Usuario';

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
  constructor(
    private fb: FormBuilder,
    private publicacionService: PublicacionService,
    private usuarioService: UsuarioService,
    private authService: AuthService
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

  crear(): void {
    if (this.formAviso.valid && this.idEmpresa) {
      const nuevaPublicacion: Publicacion = {
        titulo: this.formAviso.value.titulo,
        descripcion: this.formAviso.value.publicacion,
        lugar: this.formAviso.value.lugar,
        sueldo: this.formAviso.value.sueldo,
        modalidad: this.formAviso.value.modalidad,
        empresa: this.idEmpresa   // Enviar como objeto con id
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
}
