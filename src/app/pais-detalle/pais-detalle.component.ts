import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-pais-detalle',
  standalone: true,
  imports: [],
  templateUrl: './pais-detalle.component.html',
  styleUrl: './pais-detalle.component.css'
})
export class PaisDetalleComponent {
  @Input() inputItemSeleccionado: any;

  detallePais: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.obtenerListadoParametro('https://restcountries.com/v3.1/name/' + this.inputItemSeleccionado.paisOrigen).subscribe((pais: any) => {
      this.detallePais = pais[0];
    });
  }
}
