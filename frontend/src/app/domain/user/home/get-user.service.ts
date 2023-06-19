import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class GetUserService {
  private authUrl: string;

  constructor(private httpClient: HttpClient) {
    this.authUrl = environment.authUrl + '/user/';
  }

  public __invoke(userId: string): Observable<User> {
    return this.httpClient.get<User>(this.authUrl + userId);
  }
}
