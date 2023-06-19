export interface Exercise {
  id: string;
  name: string;
  description: string;
  primaryMuscleGroup: PrimaryMuscleGroup;
  secondaryMuscleGroup: PrimaryMuscleGroup[];
  progressionType: string;
  repsGoal: number;
  setsGoal: number;
  startWeight: number;
  frequencyOfIncrement: number;
  increments: number;
  deload: boolean;
  frequencyOfDeload: number;
  successfulSessionsCount: number;
  failedSessionsCount: number;
}

export interface PrimaryMuscleGroup {
  id: string;
  name: string;
}
