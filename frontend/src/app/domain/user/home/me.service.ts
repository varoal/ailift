import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Me } from './me';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MeService {
  private authUrl: string;

  constructor(private http: HttpClient) {
    this.authUrl = environment.authUrl + '/me';
  }

  public __invoke(): Observable<Me> {
    return this.http.get<Me>(this.authUrl);
  }
}
