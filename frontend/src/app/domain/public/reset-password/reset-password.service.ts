import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {

  private loginUrl: string;

  constructor(private httpClient: HttpClient) {
    this.loginUrl = environment.authUrl;
  }

  public __invoke(data: any): Observable<any> {
    return this.httpClient.post(this.loginUrl + '/forgot-password', data)
      .pipe(map(response => response as any));
  }
}
