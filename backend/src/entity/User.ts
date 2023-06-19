import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Routine } from "./Routine";
import { UserExercise } from "./UserExercise";
import { Workout } from "./Workout";
import { Token } from "./Token";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @OneToMany(() => Token, (token) => token.user)
  tokens!: Token[];

  @OneToMany(() => Routine, (routine) => routine.user)
  routines!: Routine[];

  @OneToMany(() => UserExercise, (userExercise) => userExercise.user)
  userExercises!: UserExercise[];

  @OneToMany(() => Workout, (workout) => workout.user)
  workouts!: Workout[];

  @CreateDateColumn({name:"created_at"})
  createdAt!: Date;

  @UpdateDateColumn({name:"updated_at"})
  updatedAt!: Date;

}
