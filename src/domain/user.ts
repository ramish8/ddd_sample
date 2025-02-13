export class UserId {
  private value: string;
  constructor(value: string) {
    this.value = value;
  }

  get _value(): string {
    return this.value;
  }
}

export class UserName {
  constructor(private readonly value: string) {
    if (value.length < 1 || value.length > 100) {
      throw new Error('ユーザー名は1文字以上100文字以下である必要があります');
    }
  }

  get _value(): string {
    return this.value;
  }
}

export class User {
  private id!: UserId;
  constructor(
    private name: UserName
  ) {}

  get _id(): UserId {
    return this.id;
  }

  get _name(): UserName {
    return this.name;
  }

  reconstructor(id: UserId, name: UserName): User {
    this.id = id;
    this.name = name;
    return this;
  }

  rename(name: UserName): User {
    this.name = name;
    return this;
  }
}

export interface IUserRepository {
  create(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
}
