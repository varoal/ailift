import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Exercise } from '../../../../application/user/modules/exercises/exercise';

@Injectable({
  providedIn: 'root'
})
export class GetRoutineExerciseService {
  private routineUrl: string = '';
  constructor(private httpClient: HttpClient) {
    this.routineUrl = environment.baseUrl + '/api/routine-exercises/routine';
  }

  public __invoke(routineId: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.routineUrl + '/' + routineId);
  }
}
