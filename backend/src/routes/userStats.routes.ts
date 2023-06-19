// userState.routes.ts
import { Router } from "express";
import { UserStatsController } from "../controllers/UserStatsController";
import { UserStatsService } from "../services/UserStatsService";
import { DataSource } from "typeorm";
import { authMiddleware } from "../middlewares/AuthMiddleware";

export const userStatsRouter = (dataSource: DataSource) => {
  const userStatsRouter = Router();
  const userStatsService = new UserStatsService(dataSource);
  const userStatsController = new UserStatsController(userStatsService);

  userStatsRouter.get("/:userId/workouts/lastweek", authMiddleware, userStatsController.getLastWeekWorkouts.bind(userStatsController));
  userStatsRouter.get("/:userId/workouts/last14", authMiddleware, userStatsController.getLast14Workouts.bind(userStatsController));
  userStatsRouter.get("/:workoutId/volume", authMiddleware, userStatsController.getTotalVolumeForWorkout.bind(userStatsController));
  userStatsRouter.get("/:userId/weights/:numberOfWorkouts", authMiddleware, userStatsController.getTotalWeightMovedPerSession.bind(userStatsController));
  userStatsRouter.get("/:userId/reps/:numberOfWorkouts", authMiddleware, userStatsController.getTotalRepsPerSession.bind(userStatsController));
  userStatsRouter.get("/:userId/exercises/:exerciseId/maxweight/:numberOfWorkouts", authMiddleware, userStatsController.getMaxWeightForExercisePerSession.bind(userStatsController));
  
  return userStatsRouter;
};
