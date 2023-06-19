import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetExercisesService } from './get-exercises.service';
import { Exercise } from './exercise';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css'],
})
export class ExercisesComponent implements OnInit {
  public exercises = [] as Exercise[];
  public filteredExercises = [] as Exercise[];
  @Output() public addExerciseEvent = new EventEmitter<Exercise>();
  public selected: boolean = false;
  public exercisesForm = {} as FormGroup;
  public muscleGroup: string = 'All';
  @Input() view: string = 'add';

  constructor(private getExercisesService: GetExercisesService,
              private formBuilder: FormBuilder) {
    this.buildForm();
  }

  public ngOnInit(): void {
    this.getExercises();
  }

  private getExercises(): void {
    this.getExercisesService.__invoke().subscribe({
      next: (exercises) => {
        this.exercises = exercises;
        this.filteredExercises = exercises;
      },
    });
  }

  public addExercise(exercise: Exercise): void {
    this.selected = true;
    this.addExerciseEvent.emit(exercise);
  }

  private buildForm(): void {
    this.exercisesForm = this.formBuilder.group({
      name: null,
    });

    this.exercisesForm.valueChanges.subscribe((value) => {
      this.filterExercises();
    });
  }

  private filterExercises(): void {
    this.filteredExercises = this.exercises.filter((exercise) => {
      if (this.exercisesForm.value.name === null || this.exercisesForm.value.name === undefined || this.exercisesForm.value.name === '') {
        return this.muscleGroup === 'All' || exercise.primaryMuscleGroup.name === this.muscleGroup;
      } else {
        return exercise.name.toLowerCase().includes(this.exercisesForm.value.name.toLowerCase()) && (this.muscleGroup === 'All' || exercise.primaryMuscleGroup.name === this.muscleGroup);

      }
    });
  }

  public setMuscleGroupSelected($event: string): void {
    this.muscleGroup = $event;
    this.filterExercises();
  }
}
