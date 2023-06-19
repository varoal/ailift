import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Exercise } from "./Exercise";
import { Workout } from "./Workout";
import { WorkoutSet } from "./WorkoutSet";
import { ProgressionType } from "../types/ProgressionType";
import { RoutineExercise } from "./RoutineExercise";

@Entity({ name: "workout_exercises" })
export class WorkoutExercise {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Exercise)
  exercise!: Exercise;

  @ManyToOne(() => Workout, (workout) => workout.exercises, {
    onDelete: "CASCADE",
  })
  workout!: Workout;

  @OneToMany(() => WorkoutSet, (workoutSet) => workoutSet.workoutExercise, {
    onDelete: "CASCADE",
  })
  sets!: WorkoutSet[];

  @Column({
    type: "enum",
    enum: ProgressionType,
  })
  progressionType!: ProgressionType;

  @ManyToOne(() => RoutineExercise, { onDelete: "CASCADE" })
  @JoinColumn()
  routineExercise!: RoutineExercise;

  @Column({ type: "double precision", nullable: true })
  startWeight?: number;

  @Column({ nullable: true })
  setsGoal?: number;

  @Column({ nullable: true })
  repsGoal?: number;

  @Column({ type: "double precision", nullable: true })
  increments?: number;

  @Column({ nullable: true })
  frequencyOfIncrement?: number;

  @Column({ type: "double precision", nullable: true })
  deload?: number;

  @Column({ nullable: true })
  frequencyOfDeload?: number;

  @Column({ default: 0 })
  successfulSessionsCount!: number;

  @Column({ default: 0 })
  failedSessionsCount!: number;
}
