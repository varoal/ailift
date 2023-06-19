import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { RoutineResponse } from './create-routine.service';

@Injectable({
  providedIn: 'root',
})
export class CreateRoutineExerciseService {

  private exercises: string = '';

  constructor(private httpClient: HttpClient) {
    this.exercises = environment.baseUrl + '/api/routine-exercises';
  }

  public __invoke(exercise: any): Promise<RoutineResponse | undefined> {
    return this.httpClient.post<RoutineResponse>(this.exercises, exercise).toPromise();
  }
}
