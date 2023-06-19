import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditRoutineExerciseSetService {

  private setsUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.setsUrl = environment.baseUrl + '/api/sets';
  }

  public __invoke(set: any, setId: string): Observable<any> {
    return this.httpClient.put<any>(this.setsUrl + '/' + setId, set);
  }
}
