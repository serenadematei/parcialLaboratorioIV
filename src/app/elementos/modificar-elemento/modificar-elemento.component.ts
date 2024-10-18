import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-modificar-elemento',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './modificar-elemento.component.html',
  styleUrl: './modificar-elemento.component.css'
})
export class ModificarElementoComponent implements OnInit{

  @Output() elementoCreado: EventEmitter<any> = new EventEmitter(); //devuelve
  @Input() elemento: any; //recibo

  nombre: any = '';
  tipo: any;
  cantidadRuedas: any;
  capacidadPromedio: any;
  correcto: boolean = false;

  constructor() { }
 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['elemento']) { //se ejecuta cuando cambia el valor de @Input() elemento
      this.ngOnInit();//// Se asegura de que cuando el valor de "elemento" cambie, se actualicen los valores en el formulario.
    }
  }
  
  ngOnInit(): void {  //los datos actuales del elemento aparecen automáticamente en el form
    if (this.elemento) {
      this.nombre = this.elemento.nombre;
      this.tipo = this.elemento.tipo;
      this.cantidadRuedas = this.elemento.cantidadRuedas;
      this.capacidadPromedio = this.elemento.capacidadPromedio;
    }
  }

  reset() 
  {
    this.elemento = null; //limpio e form
  }

  modificarElemento() {
    if (this.nombre && this.tipo && this.cantidadRuedas !== null && this.capacidadPromedio !== null) {
      if (this.nombre.length >= 4 && this.nombre.length <= 25 &&
          this.cantidadRuedas >2 && this.cantidadRuedas <= 6 &&
          this.capacidadPromedio >= 2 && this.capacidadPromedio <=100) {
        let elementoNuevo = { nombre: this.nombre, tipo: this.tipo, cantidadRuedas: this.cantidadRuedas, capacidadPromedio: this.capacidadPromedio };
        this.elementoCreado.emit(elementoNuevo); // emite el elemento modificado al compo padre
        this.reset();
      }
      else
      {
        this.correcto = false;
       
      }
    }
  }

  
}