import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Routine } from "./Routine";
import { WorkoutExercise } from "./WorkoutExercise";

@Entity({ name: "workouts" })
export class Workout {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.workouts, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Routine, { onDelete: "CASCADE" })
  routine!: Routine;

  @OneToMany(
    () => WorkoutExercise,
    (workoutExercise) => workoutExercise.workout
  )
  exercises!: WorkoutExercise[];

  @CreateDateColumn()
  startedAt!: Date;

  @Column({ nullable: true })
  endedAt?: Date;

  @Column("double precision", { nullable: true }) // duration in minutes
  duration?: number;
}
