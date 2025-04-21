import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portal-laboral';

  constructor(private router: Router){}

  validarRuta(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }
  
}
