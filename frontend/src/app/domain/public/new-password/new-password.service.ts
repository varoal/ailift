import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewPasswordService {

  private loginUrl: string;

  constructor(private httpClient: HttpClient) {
    this.loginUrl = environment.authUrl;
  }

  public __invoke(credenciales: any): Observable<string> {
    return this.httpClient.post(this.loginUrl + '/reset-password', credenciales)
      .pipe(map(usuario => usuario as string));
  }

}
