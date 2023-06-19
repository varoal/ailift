import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TotalWeightMovedPerSession } from './chart-data';

@Injectable({
  providedIn: 'root',
})
export class GetTotalWeightMovedPerSessionService {

  private authUrl: string;

  constructor(private httpClient: HttpClient) {
    this.authUrl = environment.baseUrl + '/api/userstats';
  }

  public __invoke(userId: string, sessionsNumber: number): Promise<TotalWeightMovedPerSession[] | undefined> {
    return this.httpClient.get<TotalWeightMovedPerSession[]>(this.authUrl + '/' + userId + '/weights/' + sessionsNumber).toPromise();
  }
}
