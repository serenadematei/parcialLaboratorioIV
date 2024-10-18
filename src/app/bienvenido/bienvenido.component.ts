import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
//import { ApiService } from '../services/api.service'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive, RouterOutlet],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export class BienvenidoComponent implements OnInit{

  currentUser$: Observable<User | null>;
  isLoggedIn = false;
  perfil:any;
  urlApi:string = "https://api.github.com/users/serenadematei";

  constructor( private http:HttpClient, private router: Router, private auth: AuthService){

    this.currentUser$ = this.auth.getCurrentUser();

    this.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }    

  ngOnInit(): void {
     this.http.get(this.urlApi).subscribe(res => this.perfil = res);
  }

  goTo(path: string):void
  {
    this.router.navigate([path]);
  }

}
