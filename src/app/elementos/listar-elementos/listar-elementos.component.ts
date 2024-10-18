import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-listar-elementos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-elementos.component.html',
  styleUrl: './listar-elementos.component.css'
})
export class ListarElementosComponent implements OnInit{

  @Input() listaElementos: any;
  @Output() crearElementoEmit: EventEmitter<any> = new EventEmitter();
  @Output() modificarElementoEmit: EventEmitter<any> = new EventEmitter();
  @Output() borrarElementoEmit: EventEmitter<any> = new EventEmitter();


  itemSeleccionado: any;
  opcion: any;
  modificar: boolean = false;


  constructor() { 

  }

  ngOnInit(): void {
  }


  /*async seleccionItem(item: any) {
    this.itemSeleccionado = undefined;
    await setTimeout(() => {
      this.itemSeleccionado = item;

    }, 200);
  }*/

  /*crearElemento(elemento: any) {
    this.crearElementoEmit.emit(elemento);
  }*/

  modificarElemento(elemento: any) {
    this.modificarElementoEmit.emit(elemento);
  }

  borrarElemento(elemento: any) {
    this.borrarElementoEmit.emit(elemento);
  }
}
