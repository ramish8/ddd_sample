import { User, UserName, type IUserRepository } from "../../domain/user";

export class CreateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(name: string): Promise<void> {
    const user = new User(new UserName(name));
    await this.userRepository.create(user);
  }
}
