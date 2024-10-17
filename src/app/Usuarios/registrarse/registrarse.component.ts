import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { collection, doc, setDoc, Firestore } from '@angular/fire/firestore';
//import { LetrasDirectiva} from '../../directivas/letras.directive';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [[CommonModule, FormsModule, ReactiveFormsModule, /*LetrasDirectiva*/]],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent {
  nombre: string = '';
  password: string = '';
  repetirPassword: string = '';
  email: string = '';
  selectedRole: string = '';
  formRegister: FormGroup;

  constructor(private router: Router, private readonly fb: FormBuilder,private auth: AuthService, private firestore: Firestore) 
  {
    this.formRegister = this.fb.group({
      nombre: ['', [Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(2), Validators.maxLength(10)]],
      email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),Validators.minLength(2), Validators.maxLength(30)]],
      password: ['', [Validators.min(5)]],
      repetirPassword: ['',[Validators.min(5)]],
      selectedRole: ['', [Validators.minLength(3), Validators.maxLength(20)]],
    });
  }

  async onSubmit() {
    
    if (this.formRegister.invalid) {
      return;
    }

    const passwordControl = this.formRegister.get('password');
    const repetirPasswordControl = this.formRegister.get('repetirPassword');
    const selectedRole = this.formRegister.get('selectedRole')?.value;
    const { email, password, repetirPassword } = this.formRegister.value;
  
    if (password !== repetirPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden. Por favor, intentelo denuevo',
      }).then(() => {
        if (passwordControl && repetirPassword) {
          passwordControl.reset();
          repetirPassword.reset();
        }
      });
      return;
    }

    if (!selectedRole) {
      Swal.fire({
        icon: 'error',
        title: 'Perfil no seleccionado',
        text: 'Debe seleccionar un perfil antes de registrarse.',
      });
      return;
    }
   
    try {
      const userExists = await this.auth.checkIfUserExists(email);
  
      if (userExists) {
                Swal.fire({
                  icon: 'error',
                  title: 'Usuario existente',
                  text: 'El correo electrónico ya está registrado. Inicie sesión en lugar de registrarse.',
                }).then(() => {
                  if (passwordControl && repetirPasswordControl) {
                    passwordControl.reset();
                    repetirPasswordControl.reset();
                  }
                });
      } else {
 
        const userCredential = await this.auth.register(email, password, selectedRole);
        const user = userCredential.user;
        const userDocRef = doc(collection(this.firestore, 'users&role'), user.uid);
        await setDoc(userDocRef, { mail: email, role: selectedRole }, { merge: true });
        await this.auth.login({email, password})
    
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: '¡Bienvenido!',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/home']);
        });
      }
    } catch (error: any) {

      if (error.code === 'auth/invalid-email') {
        Swal.fire({
          icon: 'error',
          title: 'Error en el correo electrónico',
          text: 'El formato del correo electrónico es incorrecto. Por favor, verifique.',
        });
      } else if (error.code === 'auth/weak-password') {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña débil',
          text: 'La contraseña debe contener al menos 6 caracteres.',
        }).then(() => {
          if (passwordControl && repetirPasswordControl) {
            passwordControl.reset();
            repetirPasswordControl.reset();
          }
        });
      }else if (error.code === 'auth/email-already-in-use') {

        Swal.fire({
          icon: 'error',
          title: 'Correo electrónico en uso',
          text: 'El correo electrónico ya está registrado. Inicie sesión en lugar de registrarse.',
        }); 
      } else {
        console.error('Error en el registro:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'Hubo un error al registrar la cuenta. Por favor, verifique sus datos e intentelo denuevo.',
        }).then(() => {
          if (passwordControl && repetirPasswordControl) {
            passwordControl.reset();
            repetirPasswordControl.reset();
          }
        });
      }
    }
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
