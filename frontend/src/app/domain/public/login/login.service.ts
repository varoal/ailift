import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginUrl: string;

  constructor(private httpClient: HttpClient) {
    this.loginUrl = environment.authUrl;
  }

  public __invoke(credenciales: any): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.loginUrl + '/login', credenciales);
  }
}
