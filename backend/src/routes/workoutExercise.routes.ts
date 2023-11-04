import { Router } from "express";
import { DataSource } from "typeorm";
import { WorkoutExerciseController } from "../controllers/WorkoutExerciseController";
import { WorkoutExerciseService } from "../services/WorkoutExerciseService";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import RoutineExerciseService from "../services/RoutineExerciseService";

export const workoutExerciseRouter = (
  dataSource: DataSource,
  routineExerciseService: RoutineExerciseService
) => {
  const workoutExerciseRouter = Router();
  const workoutExerciseService = new WorkoutExerciseService(
    dataSource,
    routineExerciseService
  );
  const workoutExerciseController = new WorkoutExerciseController(
    workoutExerciseService
  );

  workoutExerciseRouter.get(
    "/:id",
    workoutExerciseController.getWorkoutExerciseById.bind(
      workoutExerciseController
    )
  );

  workoutExerciseRouter.get(
    "/workout/:workoutId",
    workoutExerciseController.getWorkoutExercisesByWorkoutId.bind(
      workoutExerciseController
    )
  );

  workoutExerciseRouter.get(
    "/",
    workoutExerciseController.getAllWorkoutExercises.bind(
      workoutExerciseController
    )
  );

  workoutExerciseRouter.post(
    "/",
    authMiddleware,
    workoutExerciseController.createWorkoutExercise.bind(
      workoutExerciseController
    )
  );

  workoutExerciseRouter.put(
    "/:id",
    authMiddleware,
    workoutExerciseController.updateWorkoutExercise.bind(
      workoutExerciseController
    )
  );

  workoutExerciseRouter.delete(
    "/:id",
    authMiddleware,
    workoutExerciseController.deleteWorkoutExercise.bind(
      workoutExerciseController
    )
  );

  return workoutExerciseRouter;
};
