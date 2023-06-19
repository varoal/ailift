import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { MuscleGroup } from './muscle-group';

@Injectable({
  providedIn: 'root'
})
export class GetMuscleGroupsService {
  private readonly getMuscleGroupsUrl: string;
  constructor(private httpClient: HttpClient) {
    this.getMuscleGroupsUrl = environment.baseUrl + '/api/musclegroups';
  }

  public __invoke(): Observable<MuscleGroup[]> {
    return this.httpClient.get<MuscleGroup[]>(this.getMuscleGroupsUrl);
  }
}
