import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Exercise } from "./Exercise";

@Entity({ name: "muscle_groups" })
export class MuscleGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => Exercise, (exercise) => exercise.primaryMuscleGroup)
  primaryExercises!: Exercise[];

  @ManyToMany(() => Exercise, (exercise) => exercise.secondaryMuscleGroups)
  secondaryExercises!: Exercise[];
}