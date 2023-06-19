import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { User } from "./User";
import { RoutineExercise } from "./RoutineExercise";
import { Workout } from "./Workout";

@Entity({ name: "routines" })
export class Routine {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.routines)
  user!: User;

  @OneToMany(
    () => RoutineExercise,
    (routineExercise) => routineExercise.routine
  )
  exercises!: RoutineExercise[];

  @OneToMany(() => Workout, (workout) => workout.routine)
  workouts!: Workout[];
}
