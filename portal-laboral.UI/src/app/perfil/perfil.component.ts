import { Component, OnInit } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { UsuarioService } from '../servicios/usuario.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  loading: boolean = true;
  error: string | null = null;
  selectedFile: File | null = null;
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

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.usuarioService.buscarPorId(parseInt(idUsuario)).subscribe({
      next: (usuario) => {
        // Asegurarnos de procesar la fecha correctamente
        if (usuario.fecha) {
          usuario.fecha = this.transformarFecha(usuario.fecha);
        }
        
        
        this.usuario = usuario;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuario: ' + (err.error?.message || err.message);
        this.loading = false;
        console.error('Error al cargar usuario:', err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.error = 'Por favor seleccione un archivo PDF válido';
      this.selectedFile = null;
    }
  }

  uploadCv(): void {
    if (!this.selectedFile || !this.usuario?.id) {
      this.error = 'Selecciona un archivo válido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.usuarioService.uploadCv(this.usuario.id, this.selectedFile).subscribe({
      next: (response) => {
        // Actualizar el nombre del archivo en el usuario local
        if (this.usuario) {
          this.usuario.cvFilename = this.selectedFile?.name || 'documento.pdf';
        }
        this.successMessage = 'CV subido correctamente';
        this.loading = false;
        this.selectedFile = null;
        
        // Limpiar el input de archivo
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al subir el CV';
        this.loading = false;
        console.error('Error al subir CV:', err);
      }
    });
  }

  downloadCv(): void {
    if (!this.usuario?.id) {
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
        this.error = 'Error al descargar el CV: ' + (err.error?.message || err.message);
        this.loading = false;
        console.error('Error al descargar CV:', err);
      }
    });
  }

  transformarFecha(fechaInput: any): Date {
    if (!fechaInput) return new Date();
    
    if (typeof fechaInput === 'string') {
      // Si es un string ISO (de backend)
      return new Date(fechaInput);
    }
    
    if (Array.isArray(fechaInput)) {
      // Si viene como array [año, mes, día...]
      return new Date(fechaInput[0], fechaInput[1] - 1, fechaInput[2]);
    }
    
    return new Date(fechaInput);
  }
}