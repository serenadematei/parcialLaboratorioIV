import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
//import { MovieResponse, Movie } from '../home/elemento.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnInit{

  private urlApi = 'https://restcountries.com/v3.1/region/';
  paises: any = [];
  private datosGitSubject = new BehaviorSubject<any>(null);
  paisSubject = new BehaviorSubject<any>(null);

  pais$: Observable<any> = this.paisSubject.asObservable();
  datosGit$: Observable<any> = this.datosGitSubject.asObservable();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerPaises();
  }

  obtenerPaises(region: string = ''): Observable<any[]> {
    
    const apiUrl = this.urlApi + region;

    return this.http.get(apiUrl).pipe(
      
      map((response: any) => {

        if (Array.isArray(response)) {
          const paisesMapeados = response.slice(3,6).map((auxPais: any) => {
            const pais = {
              nombre: auxPais.name.common,
              region: auxPais.region,
              bandera: auxPais.flags.svg,
            };

            return pais;
          });
          console.log(paisesMapeados);
          return paisesMapeados;
          
        } else {
          return [];
        }
      })
    );
  }

  

  
}