import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Exercise } from "./Exercise";
import { Routine } from "./Routine";
import { Set } from "./Set";
import { ProgressionType } from "../types/ProgressionType";
import { WorkoutExercise } from "./WorkoutExercise";

@Entity({ name: "routine_exercises" })
export class RoutineExercise {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Exercise)
  exercise!: Exercise;

  @ManyToOne(() => Routine, (routine) => routine.exercises, {
    onDelete: "CASCADE",
  })
  routine!: Routine;

  @OneToMany(() => Set, (set) => set.routineExercise)
  sets!: Set[];

  @Column({
    type: "enum",
    enum: ProgressionType,
    default: ProgressionType.FREE,
  })
  progressionType: ProgressionType = ProgressionType.FREE;

  @OneToMany(
    () => WorkoutExercise,
    (workoutExercise) => workoutExercise.routineExercise,
    {
      onDelete: "CASCADE",
    }
  )
  workoutExercises!: WorkoutExercise[];

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
