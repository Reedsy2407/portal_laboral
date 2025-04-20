import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { LoginComponent } from './login/login.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path:"inicio", component: InicioComponent},
  {path:"ofertas", component: OfertasComponent},
  { path: "login", component: LoginComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'register', component: RegisterComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
