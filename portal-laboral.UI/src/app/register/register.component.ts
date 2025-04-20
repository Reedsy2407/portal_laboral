import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { RolService } from '../servicios/rol.service';
import { Rol } from '../entidades/Rol';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formRegistro: FormGroup;
  cargando: boolean = false;
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private rolService: RolService
  ) {
    this.formRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rolId: ['', Validators.required],
      telefono: [''],
      sitioWeb: [''],
      linkedin: ['']
    });
  }

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.rolService.obtenerRoles().subscribe({
      next: (data: Rol[]) => {
        this.roles = data;
        console.log(this.roles)
      },
      error: (error: any) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }

  register() {
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }
  
    this.cargando = true;
  
    const formValue = this.formRegistro.value;
  
    const usuario = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      correo: formValue.correo,
      password: formValue.password,
      rol: { id: formValue.rolId },  
      contacto: {
        telefono: formValue.telefono,
        sitioWeb: formValue.sitioWeb,
        linkedin: formValue.linkedin
      }
    };
  
    this.authService.register(usuario).subscribe({
      next: (respuesta: any) => {
        alert(respuesta);
        this.formRegistro.reset();
        this.cargando = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Error completo:", err);
        const mensaje = err?.error || err?.message || 'Error desconocido';
        alert("Error al registrar: " + mensaje);
        this.cargando = false;
      }
    });
  }
  
}
