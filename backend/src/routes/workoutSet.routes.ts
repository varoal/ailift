import { Router } from "express";
import { DataSource } from "typeorm";
import { WorkoutSetController } from "../controllers/WorkoutSetController";
import { WorkoutSetService } from "../services/WorkoutSetService";
import { authMiddleware } from "../middlewares/AuthMiddleware";

export const workoutSetRouter = (
  dataSource: DataSource,
) => {
  const workoutSetRouter = Router();
  const workoutSetService = new WorkoutSetService(dataSource);
  const workoutSetController = new WorkoutSetController(workoutSetService);

  workoutSetRouter.get(
    "/:id",
    workoutSetController.getWorkoutSetById.bind(workoutSetController)
  );

  workoutSetRouter.get(
    "/workoutExercise/:workoutExerciseId",
    workoutSetController.getWorkoutSetsByWorkoutExerciseId.bind(
      workoutSetController
    )
  );

  workoutSetRouter.get(
    "/",
    workoutSetController.getAllWorkoutSets.bind(workoutSetController)
  );

  workoutSetRouter.post(
    "/",
    authMiddleware,
    workoutSetController.addWorkoutSet.bind(workoutSetController)
  );

  workoutSetRouter.put(
    "/:id",
    authMiddleware,
    workoutSetController.updateWorkoutSet.bind(workoutSetController)
  );

  workoutSetRouter.delete(
    "/:id",
    authMiddleware,
    workoutSetController.deleteWorkoutSet.bind(workoutSetController)
  );

  return workoutSetRouter;
};
