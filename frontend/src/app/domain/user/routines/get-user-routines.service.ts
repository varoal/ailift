import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Routine } from '../../../application/user/interfaces/routine';

@Injectable({
  providedIn: 'root',
})
export class GetUserRoutinesService {
  private routinesUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.routinesUrl = environment.baseUrl + '/api/routines/user';
  }

  public __invoke(): Observable<Routine[]> {
    return this.httpClient.get<Routine[]>(this.routinesUrl);
  }
}
