import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { MarkAsDone } from './mark-as-done';

@Injectable({
  providedIn: 'root',
})
export class MarkWorkoutSetAsDoneService {
  private readonly workoutUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.workoutUrl = environment.baseUrl + '/api/workouts/sets/done';
  }

  public __invoke(workoutSetId: string): Observable<MarkAsDone> {
    return this.httpClient.post<MarkAsDone>(this.workoutUrl + '/' + workoutSetId, {});
  }
}
