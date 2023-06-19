import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditRoutineExerciseService {

  private routineUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.routineUrl = environment.baseUrl + '/api/routines';
  }

  public __invoke(routineExerciseId: string, data: any): Observable<any> {
    return this.httpClient.put<any>(this.routineUrl + '/' + routineExerciseId, data);
  }
}
