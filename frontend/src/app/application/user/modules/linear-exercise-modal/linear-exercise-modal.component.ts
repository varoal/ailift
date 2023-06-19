import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormControlState, FormGroup, Validators } from '@angular/forms';

export interface LinearExerciseFG {
  repsGoal: number | FormControlState<null>;
  setsGoal: number | FormControlState<null>;
  startWeight: number | FormControlState<null>;
  frequencyOfIncrement: number | FormControlState<null>;
  increments: number | FormControlState<null>;
  deload: number | FormControlState<null>;
  frequencyOfDeload: number | FormControlState<null>;
}

@Component({
  selector: 'app-linear-exercise-modal',
  templateUrl: './linear-exercise-modal.component.html',
  styleUrls: ['./linear-exercise-modal.component.css'],
})

export class LinearExerciseModalComponent {
  public modalId = 'linear-exercise-modal';
  public actionConfirmedSubject: Subject<any> = new Subject<any>();
  public linearProgessionData: any;
  public linearExerciseForm = {} as FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  private buildForm() {
    this.linearExerciseForm = this.formBuilder.group<LinearExerciseFG>({
      deload: new FormControl(null, Validators.required),
      frequencyOfDeload: new FormControl( null, Validators.required),
      frequencyOfIncrement: new FormControl( null, Validators.required),
      increments: new FormControl( null, Validators.required),
      repsGoal: new FormControl( null, Validators.required),
      setsGoal: new FormControl( null, Validators.required),
      startWeight: new FormControl( null, Validators.required)

    });
  }


  public openModal(): void {
    this.actionConfirmedSubject = new Subject<LinearExerciseFG>();
    this.toggleModal();
  }

  public closeModal(): void {
    this.toggleModal();
  }

  private toggleModal(): void {
    const modal = document.getElementById(this.modalId);
    modal?.classList.toggle('hidden');
  }

  public confirmAction(): void {
    this.actionConfirmedSubject.next(this.linearExerciseForm.value);
    this.closeModal();
  }

  public setLinearProgressionData(data: any): void {
    this.linearProgessionData = data;
    console.log(this.linearProgessionData);
    this.linearExerciseForm.patchValue(data);
  }
}


