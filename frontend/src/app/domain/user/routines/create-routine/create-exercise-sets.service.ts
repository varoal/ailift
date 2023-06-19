import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateExerciseSetsService {

  private setsUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.setsUrl = environment.baseUrl + '/api/sets';
  }

  public __invoke(set: any): Promise<any | undefined> {
    return this.httpClient.post<any>(this.setsUrl, set).toPromise();
  }
}
