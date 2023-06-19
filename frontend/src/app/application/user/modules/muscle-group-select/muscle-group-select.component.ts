import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GetMuscleGroupsService } from './get-muscle-groups.service';
import { MuscleGroup } from './muscle-group';

@Component({
  selector: 'app-muscle-group-select',
  templateUrl: './muscle-group-select.component.html',
  styleUrls: ['./muscle-group-select.component.css'],
})
export class MuscleGroupSelectComponent implements OnInit {
  public muscleGroups = [] as MuscleGroup[];
  @Output() selectedMuscleGroup = new EventEmitter<string>();

  constructor(private getMuscleGroupsService: GetMuscleGroupsService) {
  }

  public ngOnInit(): void {
    this.getMuscleGroups();
  }

  public getMuscleGroups(): void {
    this.getMuscleGroupsService.__invoke().subscribe({
      next: (muscleGroups) => {
        this.muscleGroups = muscleGroups;
      },
    });
  }

  public muscleGroupChange(muscleGroupId: string): void {
    this.selectedMuscleGroup.emit(muscleGroupId);
  }
}
