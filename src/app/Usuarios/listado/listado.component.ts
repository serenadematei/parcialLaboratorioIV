import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { PersonaDetalleComponent } from '../persona-detalle/persona-detalle.component';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PaisDetalleComponent } from '../../pais-detalle/pais-detalle.component';


interface Elemento {
  nombre: string;
  dni: string;
  paisOrigen: string;
}

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule,PersonaDetalleComponent,PaisDetalleComponent],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent implements OnInit {
  elemento: Elemento | null = null;
  listaElementos: Elemento[];

  constructor(private firestore: Firestore, private router: Router,private auth: AuthService){
    this.listaElementos = []
  }

  ngOnInit()
  {
    const elementosCollection = collection(this.firestore, 'Choferes');
    const elementosData = collectionData(elementosCollection) as Observable<Elemento[]>;
  
    elementosData.subscribe(datos => {
      this.listaElementos = datos;
    });
  }

  async seleccionarElemento(delivery: Elemento) {
    this.elemento = null;
    await setTimeout(() => {
      this.elemento = delivery;
    }, 200);
  }
   

  goTo(path:string):void {
    this.router.navigate([path]);
  }


}