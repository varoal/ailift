import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from './user';
import { LastWeekWorkout } from './last-week-workout';

@Injectable({
  providedIn: 'root',
})
export class GetLastWeekWorkoutsService {

  private authUrl: string;

  constructor(private httpClient: HttpClient) {
    this.authUrl = environment.baseUrl + '/api/userstats';
  }

  public __invoke(userId: string): Observable<LastWeekWorkout[]> {
    return this.httpClient.get<LastWeekWorkout[]>(this.authUrl + '/' + userId + '/workouts/lastweek');
  }
}
