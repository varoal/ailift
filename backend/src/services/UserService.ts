import bcrypt from "bcrypt";
import { DataSource, Repository } from "typeorm";
import { User } from "../entity/User";

export class UserService {
  constructor(private dataSource: DataSource) {}

  async getUserProfile(id: string): Promise<User | undefined> {
    const userRepository: Repository<User> =
      this.dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      select: ["username", "description"],
    });
    return user ?? undefined;
  }

  async updateUserProfile(
    id: string,
    data: Partial<User>
  ): Promise<User | undefined> {
    const userRepository: Repository<User> =
      this.dataSource.getRepository(User);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await userRepository.update({ id }, data);
    const updatedUser = await userRepository.findOne({ where: { id } });
    return updatedUser ?? undefined;
  }
}
