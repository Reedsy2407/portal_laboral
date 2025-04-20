import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../entidades/Publicacion';
import { PublicacionService } from '../servicios/publicacion.service';
import { PostulacionService } from '../servicios/postulacion.service';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-ofertas',
  standalone: false,
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  listaOfertas: Publicacion[] = [];
  ofertaSeleccionada?: Publicacion;
  idsPostulaciones: number[] = [];

  constructor(
    private publicacionService: PublicacionService,
    private postulacionService: PostulacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.publicacionService.getPublicaciones().subscribe(data => {
      this.listaOfertas = data;
    });

    
    const usuarioId = this.authService.obtenerUsuarioId(); 
    if (usuarioId === null) return;
    this.postulacionService.obtenerPostulacionesDelUsuario(usuarioId).subscribe(postulaciones => {
      this.idsPostulaciones = postulaciones.map(p => p.idPublicacion);
    });
  }

  postular(oferta: Publicacion): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (usuarioId === null) return;

    this.postulacionService.postular(usuarioId, oferta.idPublicacion).subscribe(() => {
      this.idsPostulaciones.push(oferta.idPublicacion);
      alert(`¡Postulación enviada a: ${oferta.titulo}!`);
    });
  }

  despostular(oferta: Publicacion): void {
    const usuarioId = this.authService.obtenerUsuarioId();
    if (usuarioId === null) return;
    this.postulacionService.eliminarPostulacion(usuarioId, oferta.idPublicacion).subscribe(() => {
      this.idsPostulaciones = this.idsPostulaciones.filter(id => id !== oferta.idPublicacion);
    });
  }

  estaPostulado(id: number): boolean {
    return this.idsPostulaciones.includes(id);
  }
}