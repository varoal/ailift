import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { WorkoutExercise } from "./WorkoutExercise";

@Entity({ name: "workout_sets" })
export class WorkoutSet {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => WorkoutExercise, (workoutExercise) => workoutExercise.sets, {
    onDelete: "CASCADE",
  })
  workoutExercise!: WorkoutExercise;

  @Column({ nullable: true })
  routineSetId!: string;

  @Column()
  reps!: number;

  @Column({ type: "double precision" })
  weight!: number;

  @CreateDateColumn()
  date!: Date;

  @Column({ default: false })
  isDone: boolean = false;
}
