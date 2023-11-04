import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Workout } from './workout';

@Injectable({
  providedIn: 'root',
})
export class GetWorkoutService {
  private readonly workoutUrl: string = '';
  constructor(private httpClient: HttpClient) {
    this.workoutUrl = environment.baseUrl + '/api/workouts';
  }

  public __invoke(workoutId: string): Observable<Workout> {
    return this.httpClient.get<Workout>(this.workoutUrl + '/' + workoutId);
  }
}
