import { Request, Response } from "express";
import { RoutineService } from "../services/RoutineService";
import { Routine } from "../entity/Routine";

export class RoutineController {
  constructor(private routineService: RoutineService) {}

  async getAllRoutines(req: Request, res: Response): Promise<void> {
    const routines = await this.routineService.findAll();
    res.json(routines);
  }

  async getRoutinesByUser(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user.id;
    const routines = await this.routineService.findByUserId(userId);
    res.json(routines);
  }

  async getRoutineById(req: Request, res: Response): Promise<void> {
    const routine = await this.routineService.findById(req.params.id);
    if (!routine) {
      res.sendStatus(404);
      return;
    }
    res.json(routine);
  }

  async createRoutine(req: Request, res: Response): Promise<void> {
    try {
      // res.locals.user should contain the authenticated user's information
      const user = res.locals.user;
  
      // Pass the user to the create method of the service
      const createdRoutine = await this.routineService.create({...req.body, user});
  
      res.status(201).json(createdRoutine);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error creating routine", error });
    }
  }
  

  async updateRoutine(req: Request, res: Response): Promise<void> {
    try {
      const routine: Routine | null = await this.routineService.findById(
        req.params.id
      );
      if (!routine) {
        res.sendStatus(404);
        return;
      }
      if (routine.user.id !== res.locals.user.id) {
        res
          .status(403)
          .json({
            message: "User does not have permission to update this routine",
          });
        return;
      }

      const inputRoutine = new Routine();
      inputRoutine.name = req.body.name;
      inputRoutine.description = req.body.description;

      const updatedRoutine = await this.routineService.update(
        req.params.id,
        inputRoutine
      );
      res.json(updatedRoutine);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating routine", error });
    }
  }

  async deleteRoutine(req: Request, res: Response): Promise<void> {
    try {
      const userId = res.locals.user.id;
      await this.routineService.delete(req.params.id, userId);
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      if (error === "Routine not found") {
        res.status(404).json({ message: "Error deleting routine: Routine not found", error });
      } else if (error === "User does not have permission to delete this routine") {
        res.status(403).json({ message: "Error deleting routine: No permission", error });
      } else {
        res.status(500).json({ message: "Error deleting routine", error });
      }
    }
  }
}

export default RoutineController;
