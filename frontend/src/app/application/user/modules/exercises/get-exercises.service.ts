import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Exercise } from './exercise';

@Injectable({
  providedIn: 'root',
})
export class GetExercisesService {
  private exercisesUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.exercisesUrl = environment.baseUrl + '/api/exercises';
  }

  public __invoke(): Observable<Exercise[]> {
    return this.httpClient.get<Exercise[]>(this.exercisesUrl);
  }
}
