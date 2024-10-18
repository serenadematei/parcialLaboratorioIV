import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-persona-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './persona-detalle.component.html',
  styleUrl: './persona-detalle.component.css'
})
export class PersonaDetalleComponent implements OnInit{

    @Input() inputItemSeleccionado: any;
    
    constructor() { }
  
    ngOnInit(): void {
    }

}
