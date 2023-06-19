import { Request, Response } from "express";
import { ExerciseService } from "../services/ExerciseService";
import { MuscleGroupService } from "../services/MuscleGroupService";
import { Exercise } from "../entity/Exercise";
import { DataSource } from "typeorm";

export class InputExercise {
  name!: string;
  description!: string;
  primaryMuscleGroupId!: string;
  secondaryMuscleGroupId!: Array<string>;
}

interface ErrorResponse {
  message: string;
  error: any;
}

export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  async getAllExercises(req: Request, res: Response): Promise<void> {
    const exercises = await this.exerciseService.findAll();
    res.json(exercises);
  }

  async getExerciseById(req: Request, res: Response): Promise<void> {
    const exercise = await this.exerciseService.findById(req.params.id);
    if (!exercise) {
      res.sendStatus(404);
      return;
    }
    res.json(exercise);
  }

  // SIEMPRE tipar las request y response :)
  async createExercise(
    req: Request<any, any, InputExercise>,
    res: Response<Exercise | ErrorResponse>
  ): Promise<void> {
    try {
      const createdExercise = await this.exerciseService.create(req.body);
      res.status(201).json(createdExercise);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error creating exercise", error });
    }
  }

  async updateExercise(req: Request, res: Response): Promise<void> {
    const exercise = new Exercise();
    exercise.name = req.body.name;
    exercise.description = req.body.description;
    exercise.primaryMuscleGroup = req.body.primaryMuscleGroup;
    exercise.secondaryMuscleGroups = req.body.secondaryMuscleGroups;

    const updatedExercise = await this.exerciseService.update(
      req.params.id,
      exercise
    );
    if (!updatedExercise) {
      res.sendStatus(404);
      return;
    }
    res.json(updatedExercise);
  }

  async deleteExercise(req: Request, res: Response): Promise<void> {
    await this.exerciseService.delete(req.params.id);
    res.sendStatus(204);
  }
}

export default ExerciseController;
