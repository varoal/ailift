export interface Workout {
  id: string;
  name: string;
  description: string;
  startedAt: string;
  endedAt: string;
  duration: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  progressionType: string;
  startWeight: number;
  setsGoal: number;
  repsGoal: number;
  increments: number;
  frequencyOfIncrement: number;
  deload: number;
  frequencyOfDeload: number;
  successfulSessionsCount: number;
  failedSessionsCount: number;
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
}

export interface WorkoutSet {
  isDone: boolean;
  id: string;
  routineSetId: string;
  reps: 0;
  weight: number;
  date: number;
}



