import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentUser$: Observable<User | null>;
  userRole: string | null = null;
  isLoggedIn = false;

  constructor(private router: Router, private auth: AuthService) 
  {
    this.currentUser$ = this.auth.getCurrentUser();

    // Suscribirse al observable currentUser$
    this.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    // Suscribirse al observable userRole$
    this.auth.userRole$.subscribe(role => {
      this.userRole = role;
    });
  }

  altaPersona()
  {
    this.router.navigate(['/alta']);
  }

  
  listarPersonas()
  {
    this.router.navigate(['/listado-repartidores']);
  }

  
  salenHelados()
  {
    this.router.navigate(['/salen-helados']);
  }

  logout() {
    Swal.fire({
      title: '¿Desea cerrar sesion?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout();
        this.router.navigate(['login']);
      } 
    });
  }
  
  goTo(path:string):void {
    this.router.navigate([path]);
  }
}