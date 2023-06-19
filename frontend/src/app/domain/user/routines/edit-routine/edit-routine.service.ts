import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Routine } from '../../../../application/user/interfaces/routine';

@Injectable({
  providedIn: 'root'
})
export class EditRoutineService {
  private routineUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.routineUrl = environment.baseUrl + '/api/routines';
  }

  public __invoke(data: any, routineId: string): Observable<Routine> {
    return this.httpClient.put<Routine>(this.routineUrl + '/' + routineId, data);
  }
}
