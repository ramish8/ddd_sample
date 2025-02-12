import { User, UserId, type IUserRepository, type UserName } from "../../domain/user";

export class CreateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(name: UserName): Promise<void> {
    const user = new User(new UserId(), name);
    await this.userRepository.create(user);
  }
}
