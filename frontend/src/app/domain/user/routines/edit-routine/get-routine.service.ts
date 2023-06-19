import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Routine } from '../../../../application/user/interfaces/routine';

@Injectable({
  providedIn: 'root',
})
export class GetRoutineService {
  private routineUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.routineUrl = environment.baseUrl + '/api/routines';
  }

  public __invoke(routineId: string): Observable<Routine> {
    return this.httpClient.get<Routine>(this.routineUrl + '/' + routineId);
  }
}
