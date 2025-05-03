import { Component } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { UsuarioService } from '../servicios/usuario.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  usuario?: Usuario | null = null;
  loading: boolean = true;
  error: string | null = null;
  selectedFile: File | null = null;
  // En tu componente
successMessage: string | null = null;


  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
        this.error = 'No se encontró ID de usuario';
        this.loading = false;
        return;
    }

    this.usuarioService.buscarPorId(parseInt(idUsuario)).subscribe({
        next: (usuario) => {
            // Convertir fecha si es necesario
            if (usuario.fecha && typeof usuario.fecha === 'string') {
                usuario.fecha = new Date(usuario.fecha);
            }
            this.usuario = usuario;
            this.loading = false;
        },
        error: (err) => {
            this.error = 'Error al cargar usuario';
            this.loading = false;
            console.error(err);
        }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadCv(): void {
    if (!this.selectedFile || !this.usuario?.id) {
        this.error = 'Selecciona un archivo válido';
        return;
    }

    if (this.selectedFile.type !== 'application/pdf') {
        this.error = 'Solo se permiten archivos PDF';
        return;
    }

    this.loading = true;
    this.error = null;

    this.usuarioService.uploadCv(this.usuario.id, this.selectedFile).subscribe({
        next: () => {
            this.loading = false;
            // Recargar los datos del usuario para actualizar el CV
            this.cargarUsuario();
            // Mostrar mensaje de éxito
            this.successMessage = 'CV subido correctamente';
            setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
            this.loading = false;
            this.error = err.error?.message || 'Error al subir el CV';
            console.error('Error:', err);
        }
    });
}

  downloadCv(): void {
    if (!this.usuario || this.usuario.id === undefined) {
      this.error = 'Usuario no válido';
      return;
    }

    this.loading = true;
    this.usuarioService.downloadCv(this.usuario.id).subscribe({
      next: (blob) => {
        const filename = this.usuario?.cvFilename || 'cv.pdf';
        saveAs(blob, filename);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al descargar el CV';
        this.loading = false;
        console.error(err);
      }
    });
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
