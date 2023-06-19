import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Exercise } from "./Exercise";

@Entity({ name: "user_exercises" })
export class UserExercise {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.userExercises, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Exercise)
  exercise!: Exercise;
}
