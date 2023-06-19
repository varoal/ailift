import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

export interface RoutineResponse {
  id: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class CreateRoutineService {
  private createRoutineUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.createRoutineUrl = environment.baseUrl + '/api/routines';
  }

  public __invoke(routine: any): Promise<RoutineResponse | undefined> {
    return this.httpClient.post<RoutineResponse>(this.createRoutineUrl, routine).toPromise();
  }
}
