import { Router } from "express";
import { DataSource } from "typeorm";
import { RoutineExerciseController } from "../controllers/RoutineExerciseController";
import { RoutineExerciseService } from "../services/RoutineExerciseService";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { SetService } from "../services/SetService";

export const routineExerciseRouter = (dataSource: DataSource) => {
  const routineExerciseRouter = Router();
  const setService = new SetService(dataSource);
  const routineExerciseService = new RoutineExerciseService(dataSource, setService);
  const routineExerciseController = new RoutineExerciseController(routineExerciseService);

  routineExerciseRouter.get("/:id", routineExerciseController.getRoutineExerciseById.bind(routineExerciseController));
  routineExerciseRouter.get("/routine/:routineId", routineExerciseController.getRoutineExercisesByRoutineId.bind(routineExerciseController));
  routineExerciseRouter.get("/", routineExerciseController.getAllRoutineExercises.bind(routineExerciseController));
  routineExerciseRouter.post("/", authMiddleware, routineExerciseController.createRoutineExercise.bind(routineExerciseController));
  routineExerciseRouter.put("/:id", authMiddleware, routineExerciseController.updateRoutineExercise.bind(routineExerciseController));
  routineExerciseRouter.delete("/:id", authMiddleware, routineExerciseController.deleteRoutineExercise.bind(routineExerciseController));

  return routineExerciseRouter;
};
