import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-listado-paises',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-paises.component.html',
  styleUrl: './listado-paises.component.css'
})
export class ListadoPaisesComponent implements OnInit{

  @Input() listaPaises: any;
  @Output() paisEmitido: EventEmitter<any> = new EventEmitter();
  paises: any[] = [];

  ngOnInit(): void { }

  emitirPais(pais: any) {

    this.paisEmitido.emit(pais);
  }
}