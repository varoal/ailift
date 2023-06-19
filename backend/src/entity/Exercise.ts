import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { MuscleGroup } from "./MuscleGroup";

@Entity({ name: "exercises" })
export class Exercise {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @ManyToOne(() => MuscleGroup, (muscleGroup) => muscleGroup.primaryExercises)
  primaryMuscleGroup!: MuscleGroup;

  @ManyToMany(() => MuscleGroup, (muscleGroup) => muscleGroup.secondaryExercises, { cascade: true })
  @JoinTable({
    name: "exercise_secondary_muscle_group",
    joinColumn: { name: "exercise_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "muscle_group_id", referencedColumnName: "id" },
  })
  secondaryMuscleGroups!: MuscleGroup[];
}