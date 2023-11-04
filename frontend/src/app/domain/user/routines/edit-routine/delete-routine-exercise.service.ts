import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { RoutineResponse } from '../create-routine/create-routine.service';

@Injectable({
  providedIn: 'root',
})
export class DeleteRoutineExerciseService {
  private exercises: string = '';

  constructor(private httpClient: HttpClient) {
    this.exercises = environment.baseUrl + '/api/routine-exercises';
  }

  public __invoke(routineExerciseId: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.exercises + '/' + routineExerciseId
    );
  }
}
