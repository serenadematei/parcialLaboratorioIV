import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-crear-elemento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-elemento.component.html',
  styleUrl: './crear-elemento.component.css'
})
export class CrearElementoComponent implements OnInit{

  @Output() elementoCreado: EventEmitter<any> = new EventEmitter();

  nombre: any;
  tipo: any;
  cantidadRuedas: any;
  capacidadPromedio: any;
  correcto: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  reset() {
    this.nombre = '';
    this.tipo = '';
    this.cantidadRuedas = '';
    this.capacidadPromedio = '';
  }

  crearElemento() {
    if (this.nombre && this.tipo && this.cantidadRuedas !== null && this.capacidadPromedio !== null) {
      if (this.nombre.length >= 4 && this.nombre.length <= 25 &&
          this.cantidadRuedas >0 && this.cantidadRuedas <= 6 &&
          this.capacidadPromedio >= 2 && this.capacidadPromedio <=100) {
        let elementoNuevo = { nombre: this.nombre, tipo: this.tipo, cantidadRuedas: this.cantidadRuedas, capacidadPromedio: this.capacidadPromedio };
        this.elementoCreado.emit(elementoNuevo);
        this.reset();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, complete todos los campos correctamente.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos.',
      });
      this.correcto = false;
      return;
    }
  }

}