import { Request, Response } from "express";
import { MuscleGroupService } from "../services/MuscleGroupService";

export class MuscleGroupController {
  constructor(private muscleGroupService: MuscleGroupService) {}

  async getMuscleGroups(req: Request, res: Response): Promise<void> {
    try {
      const muscleGroup = await this.muscleGroupService.findAll();
      res.json(muscleGroup);
    } catch (error) {
      res.status(500).json({ message: "Error fetching muscle groups", error });
    }
  }

  async createMuscleGroup(req: Request, res: Response): Promise<void> {
    const { name } = req.body;
    try {
      const muscleGroup = await this.muscleGroupService.createMuscleGroup(name);
      res.status(201).json(muscleGroup);
    } catch (error) {
      res.status(400).json({ message: "Error creating muscle group", error });
    }
  }
}

export default MuscleGroupController;
