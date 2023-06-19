import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TotalRepsPerSession } from './chart-data';

@Injectable({
  providedIn: 'root',
})
export class GetTotalRepsMovedPerSessionService {

  private authUrl: string;

  constructor(private httpClient: HttpClient) {
    this.authUrl = environment.baseUrl + '/api/userstats';
  }

  public __invoke(userId: string, sessionsNumber: number): Promise<TotalRepsPerSession[] | undefined> {
    return this.httpClient.get<TotalRepsPerSession[]>(this.authUrl + '/' + userId + '/reps/' + sessionsNumber).toPromise();
  }
}
