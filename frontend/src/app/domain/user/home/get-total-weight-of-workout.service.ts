import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LastWeekWorkout } from './last-week-workout';
import { Volume } from './volume';

@Injectable({
  providedIn: 'root'
})
export class GetTotalWeightOfWorkoutService {

  private authUrl: string;

  constructor(private httpClient: HttpClient) {
    this.authUrl = environment.baseUrl + '/api/userstats';
  }

  public __invoke(userId: string): Promise<Volume | undefined> {
    return this.httpClient.get<Volume>(this.authUrl + '/' + userId + '/volume').toPromise();
  }
}
