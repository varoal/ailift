import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userProfile = await this.userService.getUserProfile(id);
      if (userProfile) {
        res.json(userProfile);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedUserProfile = await this.userService.updateUserProfile(
        id,
        data
      );
      if (updatedUserProfile) {
        res.json(updatedUserProfile);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  }
}
