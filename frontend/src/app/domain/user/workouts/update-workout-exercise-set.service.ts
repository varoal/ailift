import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UpdateWorkoutExerciseSetService {
  private readonly workoutUrl: string = '';
  constructor(private httpClient: HttpClient) {
    this.workoutUrl = environment.baseUrl + '/api/workouts/sets';
  }

  public __invoke(setId: string, data: any): Promise<any> {
    return this.httpClient
      .put<any>(this.workoutUrl + '/' + setId, data)
      .toPromise();
  }
}
