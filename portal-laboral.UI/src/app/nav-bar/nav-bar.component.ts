import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { MenuService } from '../servicios/menu.service';
import { Menu } from '../entidades/Menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  email: string = '';
  content_one = true;
  estaLogueado: boolean = false;
  menus: Menu[] = [];

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    this.estaLogueado = !!token
  }

  ngOnInit(): void {
    this.estaLogueado = this.authService.estaLogueado();
    
    const idRol = this.authService.getIdRol();

    if (idRol) {
      this.menuService.listarMenuPorRol(idRol).subscribe({
        next: (data) => {
          this.menus = data;
        },
        error: (err) => {
          console.error('Error al obtener menús:', err);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }

  switch_to_second(): void {
    this.content_one = false;
  }

  switch_to_one(): void {
    this.content_one = true;
  }
}
