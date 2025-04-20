import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../servicios/auth.service';  // Asegúrate de que este servicio exista
import { LoginRequest } from '../entidades/LoginRequest';  // Asegúrate de que esta clase esté definida
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  rolActivo: 'empleador' | 'postulante' = 'empleador';
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

  cambiarRol(rol: 'empleador' | 'postulante'): void {
    this.rolActivo = rol;
  }
  
  enviarLogin() {
    this.mensajeError = '';
  
    if (this.formLogin.invalid) return;
  
    const datosLogin: LoginRequest = this.formLogin.value;
  
    this.authService.login(datosLogin).subscribe({
      next: (response: any) => {
        const rolUsuario = response.rol?.nombre?.toLowerCase();
        const idRol = response.rol?.id;
  
        if (!rolUsuario) {
          this.mensajeError = 'Este usuario no tiene un rol válido';
          return;
        }
  
        const esAdmin = rolUsuario === 'admin' || idRol === 1;
  
        if (!esAdmin && rolUsuario !== this.rolActivo.toLowerCase()) {
          this.mensajeError = `Este usuario no tiene acceso como ${this.rolActivo}`;
          return;
        }
  
        localStorage.setItem('token', response.token);
        this.router.navigate(['/inicio']);
      },
      error: () => {
        this.mensajeError = 'Correo o contraseña incorrectos';
      }
    });
  }
  
}
