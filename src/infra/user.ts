import type { IUserRepository } from "../domain/user";
import { User, UserId, UserName } from "../domain/user";
import type { Database } from "./database";

export class UserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async create(user: User): Promise<void> {
    await this.db.users.create({
      data: {
        id: user._id._value,
        name: user._name._value,
      },
    });
  }

  async findById(id: UserId): Promise<User | null> {
    const result = await this.db.users.findUnique({
      where: {
        id: id._value,
      },
    });

    if (!result) {
      return null;
    }

    const user = new User(new UserName(result.name));
    user.reconstructor(new UserId(result.id), new UserName(result.name));
    return user;
  }
}
