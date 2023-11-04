import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RemoveRoutineService {
  private routineUrl: string = '';
  constructor(private httpClient: HttpClient) {
    this.routineUrl = environment.baseUrl + '/api/routines';
  }

  public __invoke(id: string) {
    return this.httpClient.delete(this.routineUrl + '/' + id);
  }
}
