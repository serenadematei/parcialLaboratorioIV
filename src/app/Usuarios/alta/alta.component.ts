import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Firestore, Timestamp, addDoc, collection } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ListadoPaisesComponent } from '../../listado-paises/listado-paises.component';
import { NumerosDirectiva } from '../../directivas/numeros.directive';
import { LetrasDirectiva } from '../../directivas/letras.directive';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../../guards/can-component-deactivate';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-alta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ListadoPaisesComponent,NumerosDirectiva,LetrasDirectiva],
  templateUrl: './alta.component.html',
  styleUrl: './alta.component.css'
})
export class AltaComponent implements OnInit, CanComponentDeactivate {
  listaPaises: any[] = [];
  formAlta : FormGroup;
  continente: string = '';
  banderaSeleccionada: string | null = null;
  nombrePais: string = '';
  formEnviado: boolean = false;
  hasUnsavedChanges: boolean = false;
  currentUser$: Observable<User | null>;

 
  constructor(private apiService: ApiService, private firestore: Firestore, private readonly fb: FormBuilder, private router: Router, private auth: AuthService){
    this.formAlta = this.fb.group({
      dni: ['', [Validators.pattern("^[0-9]+"), Validators.minLength(8), Validators.maxLength(8)]],
      nombre: ['', [Validators.pattern('^[a-zA-Z]+$'),Validators.minLength(2), Validators.maxLength(20)]],
      edad: ['', [Validators.pattern("^[0-9]+"),Validators.min(18), Validators.max(50)]],
      numeroLicencia:['', [Validators.pattern("^[0-9]+"), Validators.minLength(7), Validators.maxLength(10)]],
      licencia: [false, Validators.required],
      continente: ['', [Validators.minLength(3), Validators.maxLength(20)]],
      paisOrigen: ['', [Validators.minLength(3), Validators.maxLength(99)]]
    });

    this.currentUser$ = this.auth.getCurrentUser();

    this.formAlta.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = this.formAlta.dirty;
    });
  }

  ngOnInit(): void {

  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasUnsavedChanges) {
      return this.showConfirmationDialog();
    }
    return true;
  }

  private showConfirmationDialog(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      Swal.fire({
        title: 'Tienes cambios sin guardar',
        text: '¿Estás seguro de que quieres salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Salir',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }



  getValue(value: string): AbstractControl{
    return this.formAlta.get(value) as FormGroup;
  }

  getCountries(pais: any) 
  {
    this.nombrePais = pais;
  }



  updatePaises() {
    const selectedContinente = this.formAlta.get('continente');
  
    if (selectedContinente && selectedContinente.value) {
      
      const region = selectedContinente.value;
      
      this.apiService.obtenerPaises(region).subscribe((data: any) => {
        
        this.listaPaises = data;
        
        this.banderaSeleccionada = null;
      });
    }
  }

  onSubmit() {

    this.formEnviado = true;

   if (this.formAlta.valid) 
   {
     this.guardarDatos(this.formAlta.value);
     this.formAlta.reset();
     this.hasUnsavedChanges = false;
   } else {
     Swal.fire({
       icon: 'error',
       title: 'Error',
       text: 'Debe completar todos los campos antes de guardar.',
     });
   }
 }




 guardarDatos(usuarioData: any) {
        
  if (usuarioData.licencia === null) {
    usuarioData.licencia = 'No';
  } else {
    usuarioData.licencia = usuarioData.licencia ? 'Sí' : 'No';
  }

  const firebaseCollection = 'Choferes';
  const collectionRef = collection(this.firestore, firebaseCollection);

  addDoc(collectionRef, {
    ...usuarioData,
    fechaCreacion: Timestamp.now()
  })
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Guardado exitosamente',
        text: '¡El chofer ha sido dado de alta con éxito!',
        confirmButtonText: 'OK'
      });
      this.limpiarListaPaises();
    })
    .catch((error: any) => {
      console.error('Error al guardar en Firestore: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar los datos del chofer.'
      });
    });
}


limpiarListaPaises() {
  this.listaPaises = [];
  this.banderaSeleccionada = null;
  this.nombrePais = '';
}



goTo(path:string):void {
  this.router.navigate([path]);
}

}
