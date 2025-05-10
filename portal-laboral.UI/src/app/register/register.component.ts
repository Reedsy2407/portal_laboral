import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { RolService } from '../servicios/rol.service';
import { Rol } from '../entidades/Rol';
import { EmpresaService } from '../servicios/empresa.service';
import { Empresa } from '../entidades/Empresa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formRegistro: FormGroup;
  empresaForm: FormGroup;
  cargando: boolean = false;
  roles: any[] = [];
  empresaRolId: number = 0;
  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  mostrarSugerencias = false;
  empresaId: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private rolService: RolService,
    private empresaService: EmpresaService
  ) {
    this.formRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      rolId: [this.roles.find(rol => rol.nombre === 'Empresa')?.id || '', Validators.required],
      telefono: [''],
      sitioWeb: [''],
      linkedin: [''],
      empresa: ['']
    });

    this.empresaForm = this.fb.group({
      nombre: ['', Validators.required],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      descripcion: [''],
      telefono: [''],
      sitioWeb: [''],
      linkedin: ['']
    });
  }

  ngOnInit() {
    this.cargarRoles();
    this.cargarEmpresas();

    this.formRegistro.get('empresa')?.valueChanges.subscribe(valor => {
      this.filtrarEmpresas(valor);
    });
  }

  cargarRoles() {
    this.rolService.obtenerRoles().subscribe({
      next: (data: Rol[]) => {
        this.roles = data.filter(rol => rol.nombre !== 'ADMIN');
        const empresaRol = this.roles.find(rol => rol.nombre === 'EMPRESA');
        if (empresaRol) {
          this.empresaRolId = empresaRol.id;
        }
      },
      error: (error: any) => {
        Swal.fire('Error', 'Error al cargar roles', 'error');
      }
    });
  }

  cargarEmpresas() {
    this.empresaService.listarEmpresa().subscribe(data => {
      this.empresas = data;
      Swal.fire('Empresas cargadas', 'Se han cargado las empresas correctamente', 'info');
    });
  }

  filtrarEmpresas(valor: string) {
    const texto = valor?.toLowerCase() || '';
    this.empresasFiltradas = this.empresas.filter(emp =>
      emp.nombre.toLowerCase().includes(texto)
    );
    this.mostrarSugerencias = true;
  }

  seleccionarEmpresa(empresa: Empresa) {
    this.empresaId = empresa.id;
    this.formRegistro.get('empresa')?.setValue(empresa.nombre);
    this.mostrarSugerencias = false;
  }

  ocultarSugerenciasConDelay() {
    setTimeout(() => this.mostrarSugerencias = false, 200);
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
      },
      empresa: { id: this.empresaId || null } 
    };

    this.authService.register(usuario).subscribe({
      next: (respuesta: any) => {
        Swal.fire('Registro exitoso', respuesta, 'success');
        this.formRegistro.reset();
        this.cargando = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'Ocurrió un error durante el registro', 'error');
      }
    });
  }

  guardarEmpresa() {
    const empresaData = this.empresaForm.value;
    const contacto = {
      telefono: empresaData.telefono,
      sitioWeb: empresaData.sitioWeb,
      linkedin: empresaData.linkedin
    };

    const empresa = {
      nombre: empresaData.nombre,
      ruc: empresaData.ruc,
      correo: empresaData.correo,
      direccion: empresaData.direccion,
      descripcion: empresaData.descripcion,
      contacto: contacto 
    };

    this.empresaService.guardarEmpresa(empresa).subscribe({
      next: () => {
        Swal.fire('Empresa guardada', 'La empresa se guardó correctamente', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar la empresa', 'error');
      }
    });
  }

  
}
