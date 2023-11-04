import { Router } from "express";
import { DataSource } from "typeorm";
import { RoutineController } from "../controllers/RoutineController";
import { RoutineService } from "../services/RoutineService";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { routineValidationRules } from "../middlewares/RoutineValidationMiddleware";

export const routineRouter = (dataSource: DataSource) => {
  const routineRouter = Router();
  const routineService = new RoutineService(dataSource);
  const routineController = new RoutineController(routineService);

  routineRouter.get(
    "/",
    routineController.getAllRoutines.bind(routineController)
  );

  routineRouter.get(
    "/user",
    authMiddleware,
    routineController.getRoutinesByUser.bind(routineController)
  );

  routineRouter.get(
    "/:id",
    routineController.getRoutineById.bind(routineController)
  );

  routineRouter.post(
    "/",
    authMiddleware,
    routineValidationRules(),
    routineController.createRoutine.bind(routineController)
  );

  routineRouter.put(
    "/:id",
    authMiddleware,
    routineValidationRules(),
    routineController.updateRoutine.bind(routineController)
  );
  
  routineRouter.delete(
    "/:id",
    authMiddleware,
    routineController.deleteRoutine.bind(routineController)
  );

  return routineRouter;
};
