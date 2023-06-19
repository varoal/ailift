import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public authUrl = '';
  public redirectUrl = '';

  constructor(private router: Router,
              private httpClient: HttpClient) {
    this.authUrl = environment.authUrl;
  }

  public refreshToken(): Observable<any> {
    return this.httpClient.get(this.authUrl + '/refresh');
  }

  public logOut(): void {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }
}
