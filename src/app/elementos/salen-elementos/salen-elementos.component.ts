import { Component, OnInit, } from '@angular/core';
import { ListarElementosComponent } from '../listar-elementos/listar-elementos.component';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { CrearElementoComponent } from '../crear-elemento/crear-elemento.component';
import { ModificarElementoComponent } from '../modificar-elemento/modificar-elemento.component';
import { BorrarElementoComponent } from '../borrar-elemento/borrar-elemento.component';
import { CommonModule } from '@angular/common';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-salen-elementos',
  standalone: true,
  imports: [CommonModule, CrearElementoComponent,ListarElementosComponent,ModificarElementoComponent,BorrarElementoComponent],
  templateUrl: './salen-elementos.component.html',
  styleUrl: './salen-elementos.component.css'
})
export class SalenElementosComponent implements OnInit{

  listaElementos: any;
  crear: boolean = true;
  modificar: boolean = false;
  eliminar: boolean = false;
  borrar: boolean = false;
  elementoAModificar: any; 
  elementoAEliminar: any;


  constructor(private router: Router,private databaseService : DatabaseService, private auth: AuthService) { 

  }

  ngOnInit(): void {

    this.traerListaActualizada();

  }

  async traerListaActualizada() {
    this.listaElementos = await this.databaseService.obtenerInfo('elementos');
  }

  async crearElemento(elemento: any) {
    this.databaseService.agregar('elementos', elemento);
    //this.traerListaActualizada();
  }

  async crearElemVisual()
  {
    this.crear = true;
    this.eliminar = false;
    this.modificar = false;
  }

  async modificarElemento(elemento: any) {
    this.modificar = true;
    this.elementoAModificar = elemento;
    this.eliminar = false;
    this.crear = false;    
  }
  
  async borrarElemento(elemento: any) {
    this.eliminar = true;
    this.modificar = false;
    this.crear = false;
    this.elementoAEliminar = elemento;
    //this.traerListaActualizada();

  }

  recibirElementoModificado(elementoNuevo: any) {

    this.databaseService.actualizar(elementoNuevo);
    this.traerListaActualizada();
    this.modificar = false;
    this.crear = true;

  }

  recibirElementoAEliminar(elementoNuevo: any) 
  {
    this.databaseService.eliminar(elementoNuevo);
    this.traerListaActualizada(); 
    this.eliminar = false;
    this.crear = true;

  }
  
  goTo(path:string):void {
    this.router.navigate([path]);
  }
  

}