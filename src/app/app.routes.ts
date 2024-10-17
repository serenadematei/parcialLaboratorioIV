import { Routes } from '@angular/router';
import { loggedGuard } from './guards/logged.guard';
import { infoGuard } from './guards/info.guard';
import { CanDeactivateGuard } from './guards/can-component-deactivate';


export const routes: Routes = [
    {
        path: 'bienvenido',
       loadComponent: () => import('./bienvenido/bienvenido.component').then((m) => m.BienvenidoComponent),
    }, 
    {
        path: '',
        redirectTo: '/bienvenido',
        pathMatch: 'full',
    },
    {
        path: 'login',
       loadComponent: () => import('./Usuarios/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'registrarse',
       loadComponent: () => import('./Usuarios/registrarse/registrarse.component').then((m) => m.RegistrarseComponent),
    },
    {
        path: 'alta',
        loadComponent: () => import('./Usuarios/alta/alta.component').then(m => m.AltaComponent),
        canActivate: [loggedGuard], canDeactivate: [infoGuard]
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
       
    }
];
