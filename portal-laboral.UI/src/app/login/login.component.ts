import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../servicios/auth.service';  
import { LoginRequest } from '../entidades/LoginRequest'; 
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  rolActivo: 'empresa' | 'postulante' = 'empresa';
  formLogin: FormGroup;
  estaLogueado: boolean = false;
  mensajeError: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.formLogin = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.estaLogueado = this.authService.estaLogueado();
  }

  cambiarRol(rol: 'empresa' | 'postulante'): void {
    this.rolActivo = rol;
  }
  
  enviarLogin() {
    this.mensajeError = '';
    const datosLogin: LoginRequest = this.formLogin.value;

    this.authService.login(datosLogin).subscribe({
      next: (response: any) => {
        Swal.fire('Login exitoso', 'Respuesta del servidor recibida correctamente', 'success');

        let rolUsuario = response.rol?.nombre?.toLowerCase();
        const idRol = response.rol?.id;

        if (!rolUsuario) {
          this.mensajeError = 'Este usuario no tiene un rol válido';
          Swal.fire('Error', this.mensajeError, 'error');
          return;
        }

        const esAdmin = rolUsuario === 'admin' || idRol === 1;

        if (!esAdmin && rolUsuario !== this.rolActivo.toLowerCase()) {
          this.mensajeError = `Este usuario no tiene acceso como ${this.rolActivo}`;
          Swal.fire('Acceso denegado', this.mensajeError, 'warning');
          return;
        }

        this.authService.guardarToken(response.token, response.idUsuario, response.rol.id);
        this.router.navigate(['/inicio']);
      },
      error: () => {
        this.mensajeError = 'Correo o contraseña incorrectos';
        Swal.fire('Error', this.mensajeError, 'error');
      }
    });
  }
  
}
