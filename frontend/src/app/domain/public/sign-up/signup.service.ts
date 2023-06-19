import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SignedupUser } from './signedup-user';

@Injectable({
  providedIn: 'root',
})
export class SignupService {

  private loginUrl: string;

  constructor(private httpClient: HttpClient) {
    this.loginUrl = environment.authUrl;
  }

  public __invoke(data: any): Observable<SignedupUser> {
    return this.httpClient.post(this.loginUrl + '/register', data)
      .pipe(map(signedUpUser => signedUpUser as SignedupUser));
  }
}
