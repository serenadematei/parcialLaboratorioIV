import { CanActivateFn,Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const loggedGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const isLoggedIn = authService.isLoggedIn();

  if (isLoggedIn) {
    return true;
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'Debe estar logueado para acceder a esta página.',
    }).then(() => {
      router.navigate(['/login']);
    });
    return false;
  }
};