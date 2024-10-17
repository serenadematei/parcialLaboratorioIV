import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.userRole$.subscribe(role => {
      this.isLoggedIn = !!role;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
    });
  }

}
