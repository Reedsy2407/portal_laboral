import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicacionService } from '../servicios/publicacion.service';
import { Publicacion } from '../entidades/Publicacion';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-reclutamiento',
  standalone: false,
  templateUrl: './reclutamiento.component.html',
  styleUrl: './reclutamiento.component.css'
})
export class ReclutamientoComponent implements OnInit{
  show = true;
  formAviso: FormGroup;
  idEmpresa: number = 0;

  constructor(private formBuilder: FormBuilder,  private publicacionService: PublicacionService, private usuarioService: UsuarioService){
    this.formAviso = this.formBuilder.group({
      titulo: ["", Validators.required],
      publicacion: ["", Validators.required],
      lugar: ["", Validators.required],
      sueldo: ["", Validators.required],
      modalidad: ["", Validators.required]
    });
  }
  ngOnInit(): void {
  }

  cambiarEstado(statement: boolean){
    this.show = statement;
  }

  crear() {
    if (this.formAviso.valid) {
      const formValue = this.formAviso.value;
      const idUsuario = localStorage.getItem('idUsuario');

      this.usuarioService.getUsuarios().subscribe((usuarios) => {
        const usuario = usuarios.find(u => Number(u.id) === Number(idUsuario));
        console.log(usuario)
        if (usuario && usuario.empresa.id) {
          this.idEmpresa = usuario.empresa.id;
  
          const nuevaPublicacion = {
            titulo: formValue.titulo,
            descripcion: formValue.publicacion,
            lugar: formValue.lugar,
            sueldo: formValue.sueldo,
            empresa: this.idEmpresa,
            modalidad: formValue.modalidad
          };

          console.log(nuevaPublicacion);
  
          this.publicacionService.crearPublicacion(nuevaPublicacion as Publicacion).subscribe(response => {
            console.log('Publicación creada exitosamente', response);
            this.formAviso.reset();
          }, error => {
            console.error('Error al crear la publicación', error);
          });
        } else {
          console.error('Usuario no encontrado o id_empresa es undefined');
        }
      });
    }
  }
  
  
}
