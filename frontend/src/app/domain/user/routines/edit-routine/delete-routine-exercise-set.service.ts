import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteRoutineExerciseSetService {
  private readonly setsUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.setsUrl = environment.baseUrl + '/api/sets';
  }

  public __invoke(setId: string): Observable<any> {
    return this.httpClient.delete<any>(this.setsUrl + '/' + setId);
  }
}
