import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { RoutineExercise } from "./RoutineExercise";

@Entity({ name: "sets" })
export class Set {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => RoutineExercise, (routineExercise) => routineExercise.sets, {
    onDelete: "CASCADE",
  })
  routineExercise!: RoutineExercise;

  @Column()
  reps!: number;

  @Column({ type: "double precision" })
  weight!: number;

  @CreateDateColumn({ type: "timestamp" })
  createdDate!: Date;
}
