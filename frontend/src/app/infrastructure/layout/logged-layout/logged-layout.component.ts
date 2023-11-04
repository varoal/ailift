import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logged-layout',
  templateUrl: './logged-layout.component.html',
  styleUrls: ['./logged-layout.component.css']
})
export class LoggedLayoutComponent {

  constructor(private router: Router) { }


  public logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
